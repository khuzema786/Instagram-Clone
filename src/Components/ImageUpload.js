import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { storage, db } from '../firebase';
import firebase from "firebase";
import './styles/ImageUpload.css';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: '40%',
      height: '30%',
      backgroundColor: "#fafafa",
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    },
  }));

function ImageUpload({ username }) {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [open, setopen] = useState(true);
    
    const handleChange = (e) => {
        if (e.target.files[0]) {    // Gets the first file selected if multiple files are selected
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
       const uploadTask = storage.ref(`images/${image.name}`).put(image);

       uploadTask.on(
           "state_changed",
            (snapshots) => {
                // Progress Function
                const progress = Math.round(
                    (snapshots.bytesTransferred / snapshots.totalBytes) * 100
                )
                setProgress(progress);
            },
            (error) => {
                // Error Function
                console.log(error);
                alert(error.message);
            },
            () => {
                // Upload complete function
                storage
                 .ref('images')
                 .child(image.name)
                 .getDownloadURL() // We can use this downloadurl from firebase which can be used in post submission or anythin in our Ui
                 .then(url => {
                    // Post image inside db
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // To get latest posts displayed as per the time the post get uploaded on server
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                 })
            }
       )
    }
    return (
        <div className="imageupload">
            <Modal
                open={open}
                onClose={() => setopen(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <progress className="imageupload__progress" value={progress} max="100" />
                    <input 
                        type="text" 
                        placeholder="Enter a caption..." 
                        onChange={(event => setCaption(event.target.value))} 
                        value={caption}
                    />
                    <input type="file" onChange={handleChange} />
                    <Button onClick={handleUpload}>Upload</Button>
                </div>
            </Modal> 
        </div>
    )
}

export default ImageUpload

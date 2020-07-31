import React, { useState, useEffect } from 'react'
import { db } from '../firebase'
import firebase from 'firebase';
import './styles/Posts.css'
import Avatar from '@material-ui/core/Avatar'

function Post({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    
    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => ({
                        id: doc.id,
                        comment: doc.data()
                }))); //snapshots are taken by firebase on each upadates and the data in the snapshot of docs are then mapped
            })
        }

        return () => {
            // cleanup
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName, // Get the signed in username
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // To get latest posts displayed as per the time the post get uploaded on server 
        })
        setComment('');
    }

    return (
        <div className="post">
           <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt="Remy Sharp" 
                    src="/static/images/avatar/1.jpg" 
                />  
                <h3>{username}</h3>     
           </div>
           <img 
                className="post__image"
                src={imageUrl}
                alt=""
           />
           <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>

            <div className="post__comments">
                {
                  comments.map(({id, comment}) => (
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>
                  ))
                }
            </div>
            
            {user && (
                <form className="post__commentBox">
                    <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    /> 
                    <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}
           
        </div>
    )
}

export default Post

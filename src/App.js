import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Components/Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './Components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import PhoneSVG from './Assets/1x/Asset 2.png';

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
    width: '100%',
    height:'100%',
    backgroundColor: "#fafafa",
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [openSignIn, setopenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [Upload, setUpload] = useState(false);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      }))); //snapshots are taken by firebase on each upadates and the data in the snapshot of docs are then mapped
    })
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser); // User logged in

      } else {
        setUser(null); // User logged out
      }

      return () => {
        unsubscribe(); // This performs some cleanup action and dettatches unsubscribe everytime before it refires it again.
      }
    }) // It's gonna listen for any time any single change happens, it fires authUser
  }, [user
    // , username
  ])

  const signUp = (event) => {
    event.preventDefault(); // Does not refresh whole screen on form submit

    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({   // If the user is newly created, update their profile
        displayName: username, 
      })
    })
    .catch((error) => alert(error.message))

    setopen(false);
  }

  const signIn = (event) => {
    event.preventDefault(); // Does not refresh whole screen on form submit

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setopenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setopen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <div className="app__signUpContainer">
            <div className="app__signUpLeft">
              <img src={PhoneSVG} alt="phone" className="app__phone"/>
            </div>
            <div className="app__signUpRight">
                <form className="app__signUp" >
                    <center>
                      <img 
                        className="app__headerImage"
                        src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-and-icon-black-and-white-text-glyph-png.png"
                        alt="Instagram Logo"
                      />
                    </center>
                    <Input 
                      placeholder="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input 
                      placeholder="email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                      placeholder="password"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={signUp}>Sign Up</Button>
                </form>  
              </div>
            </div>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setopenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className="app__signUpContainer">
            <div className="app__signUpLeft">
              <img src={PhoneSVG} alt="phone" className="app__phone"/>
            </div>
            <div className="app__signUpRight">
              <form className="app__signUp" >
                  <center>
                    <img 
                      className="app__headerImage"
                      src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-and-icon-black-and-white-text-glyph-png.png"
                      alt="Instagram Logo"
                    />
                  </center>
                  <Input 
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input 
                    placeholder="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button onClick={signIn}>Login</Button>
              </form>  
            </div>
          </div>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.edigitalagency.com.au/wp-content/uploads/instagram-logo-and-icon-black-and-white-text-glyph-png.png"
          alt="Instagram Logo"
        />
        {user ? (
          <div>
            <Button onClick={() => setUpload(!Upload)}>Upload</Button>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
        <div className="app__loginContainer" >
          <Button onClick={() => setopenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setopen(true)}>Sign Up</Button>
        </div>
      )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>    

      {
        user?.displayName ? ( // If user is there, then go further to displayName
          Upload && <ImageUpload username={user.displayName} />
        ) : (
          <></>
        )
      }

    </div>
  );
}

export default App;

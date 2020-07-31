import React, { useState, useEffect } from 'react'
import { db, auth } from '../firebase';
import firebase from 'firebase';
import './styles/Posts.css'
import Avatar from '@material-ui/core/Avatar'

function Authentication({}) {

    return (
        <div className="authenticate">
            <div className="authentication__left">
                <img src={} alt="mobile" />
            </div>
            <div className="authentication__right">
                <form className="authentication__login" >
                    <center>
                        <img 
                        className="authentication__headerImage"
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
    )
}

export default Authentication

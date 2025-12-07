import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import Button from '@mui/material/Button';

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    return (
        <div id="splash-screen">
            Playlister
            <Button onClick={() => {auth.setGuestMode()}}>Continue As Guest</Button>
            <Button onClick={() => {history.push('/login')}}>Login</Button>
            <Button onClick={() => {history.push('/register')}}>Create Account</Button>

        </div>
    )
}
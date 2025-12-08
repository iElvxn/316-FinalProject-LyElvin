import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../auth';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    return (
        <Box id="splash-screen" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box>
                <Typography variant='h1' sx={{color: 'white'}}>Playlister</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button sx={{ mt: 2, color: 'white', bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' }}}
                        onClick={() => { auth.setGuestMode() }}>Continue As Guest</Button>
                    <Button sx={{ mt: 2, color: 'white', bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' } }}
                        onClick={() => { history.push('/login') }}>Login</Button>
                    <Button sx={{ mt: 2, color: 'white', bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' } }}
                        onClick={() => { history.push('/register') }}>Create Account</Button>
                </Box>
            </Box>
        </Box>
    )
}
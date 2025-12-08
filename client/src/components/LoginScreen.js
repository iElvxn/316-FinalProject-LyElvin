import { useContext } from 'react';
import AuthContext from '../auth'
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.loginUser(
            formData.get('email'),
            formData.get('password')
        );

    };

    let modalJSX = "";
    console.log(auth);
    if (auth.errorMessage !== null) {
        modalJSX = <MUIErrorModal />;
    }
    console.log(modalJSX);

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'var(--spotify-card)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                        backgroundImage: 'url(https://preview.redd.it/i-made-a-set-of-totoro-wallpaper-for-pc-and-mobile-phone-v0-aqhyo4zoqiqb1.jpg?width=4000&format=pjpg&auto=webp&s=529ce3d113d751095d7670e770b4bbdc2feadb3e)',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
                    }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ backgroundColor: 'var(--spotify-card)', color: 'white' }}>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',

                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'var(--spotify-green)' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/register/" variant="body2" sx={{ color: 'var(--spotify-green)' }}>
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
            </Grid>
            {modalJSX}
        </Grid>
    );
}
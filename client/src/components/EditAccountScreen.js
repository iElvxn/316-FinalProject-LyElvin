import { useContext, useState, useEffect } from 'react';
import AuthContext from '../auth'
import MUIErrorModal from './MUIErrorModal'
import Copyright from './Copyright'
import { useHistory } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function EditAccountScreen() {
    const { auth } = useContext(AuthContext);
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const history = useHistory();

    useEffect(() => { //to prepopulate the fields
        if (auth.user) {
            setUserName(auth.user.userName || '');
            setAvatar(auth.user.avatar || '');
            setAvatarPreview(auth.user.avatar || null);
        }
    }, [auth.user]);

    const hasChanges = () => {
        if (!auth.user) return false;
        if (userName.trim() === '') return false;
        const userNameChanged = userName !== (auth.user.userName || '');
        const avatarChanged = avatar !== (auth.user.avatar || '');
        const passwordEntered = password !== '' || passwordVerify !== '';
        return userNameChanged || avatarChanged || passwordEntered;
    };

    const handleAvatarSubmit = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Img = reader.result
                setAvatar(base64Img);
                setAvatarPreview(base64Img);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.updateUser(userName, password, passwordVerify, avatar);
    };

    let modalJSX = ""
    console.log(auth);
    if (auth.errorMessage !== null) {
        modalJSX = <MUIErrorModal />;
    }
    console.log(modalJSX);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar
                    sx={{ m: 1, bgcolor: 'secondary.main', width: 64, height: 64 }}
                    src={avatarPreview}
                >{!avatarPreview && <LockOutlinedIcon />}
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit Account
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="username"
                                name="userName"
                                required
                                fullWidth
                                id="userName"
                                label="User Name"
                                autoFocus
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwordVerify"
                                label="Password Verify"
                                type="password"
                                id="passwordVerify"
                                autoComplete="new-password"
                                value={passwordVerify}
                                onChange={(e) => setPasswordVerify(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                            >
                                Select Avatar
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarSubmit}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={!hasChanges()}
                            >
                                Complete
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {history.goBack()}}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            {modalJSX}
        </Container>
    );
}
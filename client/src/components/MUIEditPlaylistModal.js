import { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AuthContext from '../auth';
import List from '@mui/material/List';
import SongCard from './SongCard';

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 600,
    padding: '20px',
    boxShadow: 24,
    bgcolor: 'var(--spotify-card)',
    color: 'white',
    borderRadius: '8px',
};

// The playlist screeb but moidal edition
export default function MUIEditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const [playlistName, setPlaylistName] = useState(store.currentList?.name || '');
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => { //this is for syncing the input and actual state of the playlist name
        if (store.currentList.name) {
            setPlaylistName(store.currentList.name);
        }
    }, [store.currentList.name]);

    const handleNameChange = (event) => {
        setPlaylistName(event.target.value);
    }

    const handleNameBlur = () => {
        if (playlistName.trim() !== '' && playlistName !== store.currentList.name) {
            store.addChangePlaylistNameTransaction(store.currentList.name, playlistName);
        }
    }

    const handleClose = () => {
        store.closeEditPlaylistModal();
    }

    const handleAddSong = () => {
        store.closeEditPlaylistModal();
        history.push('/songs');
    }

    const handleUndo = () => {
        store.undo();
    }

    const handleRedo = () => {
        store.redo();
    }

    return (
        <Modal
            open={store.currentModal === "EDIT_PLAYLIST"}
        >
            <Box sx={style1}>
                <div id="edit-song-modal" data-animation="slideInOutLeft">
                    <Typography
                        sx={{ fontWeight: 700, color: 'var(--spotify-white)' }}
                        id="edit-song-modal-title" variant="h5" component="h2">
                        Edit Playlist
                    </Typography>
                    <Divider sx={{ borderBottomWidth: 3, borderColor: 'var(--spotify-green)', my: 1, width: '40px' }} />
                    <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: 'var(--spotify-light-gray)', fontWeight: 600 }}>Playlist Name:</Typography>
                        <input
                            id="edit-song-modal-title-textfield"
                            className='modal-textfield'
                            type="text"
                            value={playlistName}
                            onChange={handleNameChange}
                            onBlur={handleNameBlur}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--spotify-gray)',
                                color: 'white',
                                padding: '6px 8px',
                                borderRadius: 4,
                                minWidth: 200
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {!auth.isGuest && (
                            <>
                                <Button
                                    onClick={handleAddSong}
                                    disabled={!store.canAddNewSong()}
                                    variant="contained"
                                    color="primary"
                                >
                                    Add Song
                                </Button>
                                <IconButton
                                    onClick={handleUndo}
                                    disabled={!store.canUndo()}
                                    sx={{ color: 'var(--spotify-light-gray)' }}
                                >
                                    <UndoIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleRedo}
                                    disabled={!store.canRedo()}
                                    sx={{ color: 'var(--spotify-light-gray)' }}
                                >
                                    <RedoIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    <List
                        sx={{
                            overflow: 'auto',
                            maxHeight: 350,
                            bgcolor: 'transparent',
                            borderRadius: 2,
                            p: 1
                        }}
                    >
                        {store.currentList?.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + index}
                                key={'playlist-song-' + index}
                                index={index}
                                song={song}
                            />
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            id="edit-playlist-confirm-button"
                            onClick={handleClose}
                            variant="contained"
                            sx={{ backgroundColor: 'var(--spotify-green)', color: 'white', fontWeight: 600 }}
                        >
                            Close
                        </Button>
                    </Box>

                </div>
            </Box>
        </Modal>
    );
}
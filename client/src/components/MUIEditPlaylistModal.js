import { useContext, useState, useEffect } from 'react'
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
    width: 800,
    height: 400,
    border: '3px solid #000',
    padding: '20px',
    boxShadow: 24,
    bgcolor: 'background.paper'
};

// The playlist screeb but moidal edition
export default function MUIEditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const [playlistName, setPlaylistName] = useState(store.currentList?.name || '');
    const { auth } = useContext(AuthContext);

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
        store.addNewSong();
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
                        sx={{ fontWeight: 'bold' }}
                        id="edit-song-modal-title" variant="h4" component="h2">
                        Edit Playlist
                    </Typography>
                    <Divider sx={{ borderBottomWidth: 5, p: '5px', transform: 'translate(-5.5%, 0%)', width: 377 }} />
                    <Typography
                        sx={{ mt: "10px", color: "#702963", fontWeight: "bold", fontSize: "30px" }}
                        id="modal-modal-title" variant="h6" component="h2">
                        Playlist Name: <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" value={playlistName} onChange={handleNameChange} onBlur={handleNameBlur} />
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {!auth.isGuest && (
                            <>
                                <Button
                                    onClick={handleAddSong}
                                    disabled={!store.canAddNewSong()}
                                >
                                    Add Song
                                </Button>
                                <IconButton
                                    onClick={handleUndo}
                                    disabled={!store.canUndo()}
                                >
                                    <UndoIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleRedo}
                                    disabled={!store.canRedo()}
                                >
                                    <RedoIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>
                    <List
                        sx={{
                            overflow: 'auto',
                            maxHeight: 180,
                            bgcolor: '#8000F00F',
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
                    <Button
                        sx={{ color: "#8932CC", backgroundColor: "#CBC3E3", fontSize: 13, fontWeight: 'bold', border: 2, p: "5px", mt: "20px" }} variant="outlined"
                        id="edit-playlist-confirm-button" onClick={handleClose}>Close</Button>

                </div>
            </Box>
        </Modal>
    );
}
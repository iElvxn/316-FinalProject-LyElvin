import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { createSong } from '../store/requests';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '3px solid rgba(255,255,255,0.06)',
    backgroundColor: 'var(--spotify-card)',
    padding: '20px',
    boxShadow: 24,
};

export default function MUIAddSongModal({ onSongCreated }) {
    const { store } = useContext(GlobalStoreContext);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [year, setYear] = useState('');
    const [youTubeId, setYouTubeId] = useState('');

    const isFormValid = title.trim() && artist.trim() && year.trim() && youTubeId.trim();

    function clearForm() {
        setTitle('');
        setArtist('');
        setYear('');
        setYouTubeId('');
    }

    async function handleConfirm() {
        if (isFormValid) {
            try {
                const response = await createSong(title, artist, year, youTubeId);
                if (response.data.success) {
                    clearForm();
                    store.hideModals();
                    if (onSongCreated) {
                        onSongCreated();
                    }
                }
            } catch (error) {
                console.error('Error creating song:', error);
                alert(error.message || 'Failed to create song');
            }
        }
    }

    function handleCancel() {
        clearForm();
        store.hideModals();
    }

    return (
        <Modal
            open={store.currentModal === "ADD_SONG"}
        >
            <Box sx={style}>
                <div id="edit-song-modal" data-animation="slideInOutLeft">
                    <Typography
                        sx={{ fontWeight: 'bold', color: 'white' }}
                        id="edit-song-modal-title" variant="h4" component="h2">
                        Add Song
                    </Typography>
                    <Divider sx={{ borderBottomWidth: 5, p: '5px', transform: 'translate(-5.5%, 0%)', width: 377 }} />
                    <Typography
                        sx={{ mt: "10px", color: "var(--spotify-white)", fontWeight: "bold", fontSize: "30px" }}
                        id="modal-modal-title" variant="h6" component="h2">
                        Title: <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Typography>
                    <Typography
                        sx={{ color: "var(--spotify-white)", fontWeight: "bold", fontSize: "30px" }}
                        id="modal-modal-artist" variant="h6" component="h2">
                        Artist: <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
                    </Typography>
                    <Typography
                        sx={{ color: "var(--spotify-white)", fontWeight: "bold", fontSize: "30px" }}
                        id="modal-modal-year" variant="h6" component="h2">
                        Year: <input id="edit-song-modal-year-textfield" className='modal-textfield' type="text" value={year} onChange={(e) => setYear(e.target.value)} />
                    </Typography>
                    <Typography
                        sx={{ color: "var(--spotify-white)", fontWeight: "bold", fontSize: "25px" }}
                        id="modal-modal-youTubeId" variant="h6" component="h2">
                        YouTubeId: <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" value={youTubeId} onChange={(e) => setYouTubeId(e.target.value)} />
                    </Typography>
                    <Button
                        disabled={!isFormValid}
                        sx={{
                            color: "var(--spotify-white)",
                            backgroundColor: isFormValid ? "var(--spotify-green)" : "gray",
                            fontSize: 13,
                            fontWeight: 'bold',
                            border: 2,
                            p: "5px",
                            mt: "20px"
                        }}
                        variant="outlined"
                        id="edit-song-confirm-button" onClick={handleConfirm}>Confirm</Button>
                    <Button
                        sx={{ opacity: 0.80, color: "var(--spotify-light-gray)", backgroundColor: "transparent", fontSize: 13, fontWeight: 'bold', border: 2, p: "5px", mt: "20px", ml: "197px" }} variant="outlined"
                        id="edit-song-cancel-button" onClick={handleCancel}>Cancel</Button>
                </div>
            </Box>
        </Modal>
    );
}
import { useContext } from 'react'
import GlobalStoreContext from '../store';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { deleteSong } from '../store/requests';

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 345,
    height: 150,
    backgroundColor: 'var(--spotify-card)',
    border: '3px solid #000',
    padding: '20px',
    boxShadow: 24,
};

export default function MUIDeleteSongModal({ onSongDeleted }) {
    const { store } = useContext(GlobalStoreContext);

    function handleCancel() {
        store.hideModals();
    }

    async function handleDeleteSong() {
        try {
            const response = await deleteSong(store.currentSong._id);
            if (response.data.success) {
                onSongDeleted();
            }
            store.hideModals();
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    }

    let songTitle = store.currentSong ? store.currentSong.title : '';

    return (
        <Modal open={store.currentModal === "REMOVE_SONG"}>
            <Box sx={style1}>
                <Typography sx={{ color: "var(--spotify-white)", fontWeight: 'bold' }} variant="h4" component="h2">
                    Remove Song
                </Typography>
                <Divider sx={{ borderBottomWidth: 5, p: '5px', transform: 'translate(-5.5%, 0%)', width: 377 }} />

                <Typography id="modal-modal-description" variant="h6" sx={{ color: "var(--spotify-light-gray)", fontWeight: 'bold', mt: 1 }}>
                    Are you sure you want to delete the <Typography display="inline" id="modal-modal-description" variant="h6" sx={{ color: "var(--spotify-green)", fontWeight: 'bold', mt: 2, textDecoration: 'underline' }}>{songTitle}</Typography> playlist?
                </Typography>
                <Button sx={{ opacity: 0.7, color: "var(--spotify-white)", backgroundColor: "var(--spotify-green)", fontSize: 13, fontWeight: 'bold', border: 2, p: "5px", mt: "60px", mr: "95px" }} variant="outlined" onClick={handleDeleteSong}> Confirm </Button>
                <Button sx={{ opacity: 0.50, color: "var(--spotify-light-gray)", backgroundColor: "transparent", fontSize: 13, fontWeight: 'bold', border: 2, p: "5px", mt: "60px", ml: "102px" }} variant="outlined" onClick={handleCancel}> Cancel </Button>
            </Box>
        </Modal>
    );
}
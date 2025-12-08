import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 345,
    height: 250,
    border: '3px solid #000',
    padding: '20px',
    boxShadow: 24,
    bgcolor: 'var(--spotify-card)',
    color: 'var(--spotify-white)',
    borderRadius: 8,
    border: '3px solid #000'
};

export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Modal
        open={store.listMarkedForDeletion !== null}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style1}>
            <Typography sx={{fontWeight: 'bold'}} id="modal-modal-title" variant="h4" component="h2">
                Delete Playlist
            </Typography>
            <Divider sx={{borderBottomWidth: 5, p: '5px', transform: 'translate(-5.5%, 0%)', width:377}}/>
            <Box sx={{background: "rgba(29,185,84,0.05)"}}>
            <Typography id="modal-modal-description" variant="h6" sx={{color: "var(--spotify-light-gray)" ,fontWeight: 'bold', mt: 1}}>
                Are you sure you want to delete the <Typography display="inline" id="modal-modal-description" variant="h6" sx={{color: "var(--spotify-green)" ,fontWeight: 'bold', mt: 2, textDecoration: 'underline'}}>{name}</Typography> playlist?
            </Typography>
            </Box>
            <Button sx={{opacity: 0.7, color: "var(--spotify-white)", backgroundColor: "var(--spotify-green)", fontSize: 13, fontWeight: 'bold', border: 2, p:"5px", mt:"60px", mr:"95px"}} variant="outlined" onClick={handleDeleteList}> Confirm </Button>
            <Button sx={{opacity: 0.50, color: "var(--spotify-light-gray)", backgroundColor: "transparent", fontSize: 13, fontWeight: 'bold', border: 2, p:"5px", mt:"60px", ml:"102px"}} variant="outlined" onClick={handleCloseModal}> Cancel </Button>
        </Box>
    </Modal>
    );
}
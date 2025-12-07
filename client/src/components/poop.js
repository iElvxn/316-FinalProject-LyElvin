import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/Close';
import SongCard from './SongCard';
import MUIEditSongModal from './MUIEditSongModal';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    height: '80%',
    bgcolor: 'background.paper',
    border: '3px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
};

export default function MUIEditPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [playlistName, setPlaylistName] = useState(store.currentList?.name || '');

    function handleClose() {
        store.closeEditPlaylistModal();
    }

    function handleNameChange(event) {
        setPlaylistName(event.target.value);
    }

    function handleNameBlur() {
        if (playlistName !== store.currentList.name && playlistName.trim() !== '') {
            store.changeListName(store.currentList._id, playlistName);
        }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            handleNameBlur();
            event.target.blur();
        }
    }

    function handleAddSong() {
        store.addNewSong();
    }

    function handleUndo() {
        store.undo();
    }

    function handleRedo() {
        store.redo();
    }

    let editSongModal = "";
    if (store.isEditSongModalOpen()) {
        editSongModal = <MUIEditSongModal />;
    }

    return (
        <Modal
            open={store.isEditPlaylistModalOpen()}
            onClose={handleClose}
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <TextField
                        value={playlistName}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        label="Playlist Name"
                        disabled={auth.isGuest}
                        sx={{ flexGrow: 1, mr: 2 }}
                    />
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {!auth.isGuest && (
                        <>
                            <Button
                                variant="contained"
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
                        flexGrow: 1,
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>

                {editSongModal}
            </Box>
        </Modal>
    );
}

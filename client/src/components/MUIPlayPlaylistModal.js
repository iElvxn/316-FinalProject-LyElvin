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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import List from '@mui/material/List';
import YouTube from 'react-youtube';
import { ListItem } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { incrementSongListenCount } from '../store/requests';


const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 800,
    border: '3px solid #000',
    padding: '20px',
    boxShadow: 24,
    bgcolor: 'background.paper'
};

// The playlist screeb but moidal edition
export default function MUIPlayPlaylistModal() {
    const { store } = useContext(GlobalStoreContext);
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isRepeat, setIsRepeat] = useState(false);

    const currentSong = store.currentList?.songs[store.currentSongIndex];

    const playerOptions = {
        playerVars: { autoplay: 1 },
        height: '300',
        width: '400',
    };

    const onPlayerReady = (event) => {
        setPlayer(event.target);
        event.target.playVideo();
        // Increment song listen count when song starts playing
        if (currentSong) {
            incrementSongListenCount(currentSong.title, currentSong.artist, currentSong.year);
        }
    }

    const onPlayerEnd = () => {
        if (!isRepeat && store.currentSongIndex + 1 >= store.currentList.songs.length) {
            return;
        }
        store.playNextSong();
    }

    const onPlayerStateChange = (event) => {
        if (event.data === 1) setIsPlaying(true);
        else if (event.data === 2) setIsPlaying(false);
    }

    const handleClose = () => {
        store.closePlayPlaylistModal();
    }

    const handlePlayNext = () => {
        store.playNextSong();
        setIsPlaying(true);
    }

    const handlePlayPrevious = () => {
        store.playPreviousSong();
        setIsPlaying(true);
    }

    const handlePause = () => {
        if (isPlaying) {
            player?.pauseVideo();
        } else {
            player?.playVideo();
        }
        setIsPlaying(!isPlaying);
    }

    const handleSongClick = (index) => {
        store.setCurrentSongIndex(index);
        setIsPlaying(true);
    }

    let cardClass = "list-card unselected-list-card";

    return (
        <Modal
            open={store.currentModal === "PLAY_PLAYLIST"}
        >
            <Box sx={style1}>
                <div id="edit-song-modal" data-animation="slideInOutLeft">
                    <Typography
                        sx={{ fontWeight: 'bold' }}
                        id="edit-song-modal-title" variant="h4" component="h2">
                        Play Playlist
                    </Typography>
                    <Divider sx={{ borderBottomWidth: 5, p: '5px', transform: 'translate(-5.5%, 0%)', width: 377 }} />

                    <Box>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '24px' }}>
                            {store.currentList.name}
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '16px' }}>
                            by: {store.currentList.ownerUsername}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <List
                            sx={{
                                overflow: 'auto',
                                maxHeight: 600,
                                width: '50%',
                                bgcolor: '#8000F00F',
                                borderRadius: 2,
                                p: 1
                            }}
                        >
                            {store.currentList?.songs.map((song, index) => (

                                <ListItem onClick={() => { handleSongClick(index) }}
                                    key={index}
                                    id={'song-' + index + '-card'}
                                    className={cardClass}
                                >
                                    {index + 1}.
                                    <Typography id={'song-' + index + '-link'} className="song-link">
                                        {song.title} ({song.year}) by {song.artist}
                                    </Typography>

                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{
                            width: '50%'
                        }}>
                            {currentSong ? (
                                <Box>
                                    <YouTube
                                        videoId={currentSong.youTubeId}
                                        opts={playerOptions}
                                        onReady={onPlayerReady}
                                        onEnd={onPlayerEnd}
                                        onStateChange={onPlayerStateChange} />

                                </Box>
                            )
                                :
                                null}


                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                <IconButton onClick={handlePlayPrevious}>
                                    <SkipPreviousIcon sx={{ fontSize: 40 }} />
                                </IconButton>
                                <IconButton onClick={handlePause}>
                                    {isPlaying ?
                                        <PauseIcon sx={{ fontSize: 40 }} /> :
                                        <PlayArrowIcon sx={{ fontSize: 40 }} />
                                    }
                                </IconButton>
                                <IconButton onClick={handlePlayNext}>
                                    <SkipNextIcon sx={{ fontSize: 40 }} />
                                </IconButton>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isRepeat}
                                            onChange={(e) => setIsRepeat(e.target.checked)}
                                        />
                                    }
                                    label="Repeat"
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Button
                        sx={{ color: "#8932CC", backgroundColor: "#CBC3E3", fontSize: 13, fontWeight: 'bold', border: 2, p: "5px", mt: "20px" }} variant="outlined"
                        id="edit-playlist-confirm-button" onClick={handleClose}>Close</Button>

                </div>
            </Box>
        </Modal>
    );
}
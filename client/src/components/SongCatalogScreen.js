import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Typography from '@mui/material/Typography';
import YouTube from 'react-youtube';
import { getSongs, getUserPlaylists, addSongToPlaylist, incrementSongListenCount } from '../store/requests';
import MUIAddSongModal from './MUIAddSongModal';
import MUIEditSongModal from './MUIEditSongModal';
import GlobalStoreContext from '../store';
import AuthContext from '../auth';
import MUIDeleteSongModal from './MUIDeleteSongModal ';

const SongCatalogScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState({
        title: '',
        artist: '',
        year: ''
    });
    const [sortBy, setSortBy] = useState('title-asc');
    const [selectedSong, setSelectedSong] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [playlistAnchorEl, setPlaylistAnchorEl] = useState(null);
    const [playlists, setPlaylists] = useState(null);

    useEffect(() => {
        loadSongs();
        loadUserPlaylists();
    }, []);

    async function loadSongs(query = {}, sort = 'title-asc') {
        try {
            const response = await getSongs(query, sort);
            if (response.data.success) {
                setSongs(response.data.songs);
            }
        } catch (error) {
            console.error('Error loading songs:', error);
        }
    }

    function handleQueryChange(field) {
        return (event) => {
            setSearchQuery({ ...searchQuery, [field]: event.target.value });
        };
    }

    async function handleSearch() {
        loadSongs(searchQuery, sortBy);
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    function handleClear() {
        setSearchQuery({ title: '', artist: '', year: '' });
        loadSongs({}, sortBy);
    }

    function handleSortChange(event) {
        setSortBy(event.target.value);
        loadSongs(searchQuery, event.target.value);
    }

    function handleEllipsisClick(event, song) {
        setSelectedSong(song);
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        setPlaylistAnchorEl(null);
    }

    function handleAddToPlaylistClick(event) {
        setPlaylistAnchorEl(event.currentTarget);
    }

    function handlePlaylistMenuClose() {
        setPlaylistAnchorEl(null);
    }

    async function handleAddToPlaylist(playlistId) {
        try {
            await addSongToPlaylist(playlistId, selectedSong._id);
            setAnchorEl(null);
            setPlaylistAnchorEl(null);
            loadSongs(searchQuery, sortBy);
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    }

    function canEditSong() {
        return auth.user && selectedSong && selectedSong.addedBy === auth.user.email;
    }

    async function loadUserPlaylists() {
        try {
            const response = await getUserPlaylists();
            if (response.data.success) {
                setPlaylists(response.data.playlists);
            }
        } catch (error) {
            console.error('Error loading playlists:', error);
        }
    }

    function handleSongCreated() {
        loadSongs(searchQuery, sortBy);
    }

    function handleEditSong() {
        store.showEditSongModal(-1, selectedSong);
        setAnchorEl(null);
    }

    function handleRemoveSong() {
        handleMenuClose();
        store.showRemoveSongModal(selectedSong);
    }

    function handleSongClick(song) {
        setSelectedSong(song);
        incrementSongListenCount(song.title, song.artist, song.year);
    }

    const playerOptions = {
        playerVars: { autoplay: 1 },
        height: '300',
        width: '400',
    };

    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                Song Catalog
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: "30%", gap: 1, alignItems: 'center' }}>
                    <TextField label="by Title" size="small" fullWidth value={searchQuery.title}
                        onChange={handleQueryChange('title')} onKeyDown={handleKeyPress} />
                    <TextField label="by Artist" size="small" fullWidth value={searchQuery.artist}
                        onChange={handleQueryChange('artist')} onKeyDown={handleKeyPress} />
                    <TextField label="by Year" size="small" fullWidth value={searchQuery.year}
                        onChange={handleQueryChange('year')} onKeyDown={handleKeyPress} />
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                        <Button variant="contained" fullWidth onClick={handleSearch}>Search</Button>
                        <Button variant="outlined" fullWidth onClick={handleClear}>Clear</Button>
                    </Box>

                    {selectedSong && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: 'white', borderRadius: 2, textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
                                Now Playing:
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                {selectedSong.title} by {selectedSong.artist}
                            </Typography>
                            <YouTube
                                videoId={selectedSong.youTubeId}
                                opts={playerOptions}
                            />
                        </Box>
                    )}

                    {auth.user && <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => store.showAddSongModal()}
                    >
                        Add New Song
                    </Button>}
                </Box>
                <Box sx={{ bgcolor: "background.paper", flexGrow: 1 }} id="list-selector-list">
                    <FormControl size="small" sx={{ mt: 1 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                            <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                            <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                            <MenuItem value="artist-asc">Artist (A-Z)</MenuItem>
                            <MenuItem value="artist-desc">Artist (Z-A)</MenuItem>
                            <MenuItem value="year-asc">Year (Old-New)</MenuItem>
                            <MenuItem value="year-desc">Year (New-Old)</MenuItem>
                            <MenuItem value="listenCount-desc">Listens (Hi-Lo)</MenuItem>
                            <MenuItem value="listenCount-asc">Listens (Lo-Hi)</MenuItem>
                            <MenuItem value="playlistCount-desc">In Playlists (Hi-Lo)</MenuItem>
                            <MenuItem value="playlistCount-asc">In Playlists (Lo-Hi)</MenuItem>
                        </Select>
                    </FormControl>

                    <List sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {songs.map((song) => (
                            <ListItem
                                key={song._id}
                                onClick={() => handleSongClick(song)}
                                sx={{
                                    borderRadius: "25px",
                                    p: "10px",
                                    bgcolor: selectedSong?._id === song._id ? '#d4a5ff' : '#8000F00F',
                                    marginTop: '15px',
                                    display: 'flex',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: '#d4a5ff' }
                                }}
                                style={{ width: '98%', fontSize: '24pt' }}
                            >
                                <Box sx={{ p: 1, flexGrow: 1 }}>
                                    <Box>{song.title}</Box>
                                    <Box sx={{ fontSize: '14pt', color: '#3c184dff' }}>by: {song.artist}</Box>
                                    <Box sx={{ fontSize: '14pt', color: '#666' }}>Year: {song.year}</Box>
                                </Box>
                                <Box sx={{ p: 1, textAlign: 'right' }}>
                                    <Box sx={{ fontSize: '14pt', color: '#666' }}>{song.listenCount || 0} Listens</Box>
                                    <Box sx={{ fontSize: '14pt', color: '#666' }}>In {song.playlistCount || 0} Playlists</Box>
                                </Box>

                                {auth.user && <IconButton onClick={(event) => handleEllipsisClick(event, song)}>
                                    <MoreVertIcon />
                                </IconButton>}
                            </ListItem>
                        ))}
                    </List>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {auth.user &&(
                            <MenuItem onClick={handleAddToPlaylistClick}>
                                Add to Playlist
                            </MenuItem>
                        )}
                        {canEditSong() && (
                            <MenuItem onClick={handleEditSong}>Edit Song</MenuItem>
                        )}
                        {canEditSong() && (
                            <MenuItem onClick={handleRemoveSong}>Remove from Catalog</MenuItem>
                        )}
                    </Menu>
                    <Menu
                        anchorEl={playlistAnchorEl}
                        open={Boolean(playlistAnchorEl)}
                        onClose={handlePlaylistMenuClose}
                        transitionDuration={0}
                    >
                        {playlists && playlists.map((playlist) => (
                            <MenuItem key={playlist._id} onClick={() => handleAddToPlaylist(playlist._id)}>
                                {playlist.name}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Box>

            <MUIAddSongModal onSongCreated={handleSongCreated} />
            <MUIEditSongModal onSongUpdated={handleSongCreated} />
            <MUIDeleteSongModal onSongDeleted={handleSongCreated} />
        </div>
    );
};

export default SongCatalogScreen;
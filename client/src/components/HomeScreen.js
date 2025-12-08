import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import PlaylistCard from './PlaylistCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditPlaylistModal from './MUIEditPlaylistModal'
import MUIPlayPlaylistModal from './MUIPlayPlaylistModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import AuthContext from '../auth/index.js';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        user: '',
        songTitle: '',
        songArtist: '',
        songYear: ''
    });

    const [sortBy, setSortBy] = useState('name-asc');

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleSearch() {
        store.loadIdNamePairs(searchQuery);
    }

    function handleQueryChange(field) {
        return (event) => {
            setSearchQuery({ ...searchQuery, [field]: event.target.value });
        };
    }

    function handleClear() {
        setSearchQuery({ name: '', user: '', songTitle: '', songArtist: '', songYear: '' });
        store.loadIdNamePairs();
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    function handleSortChange(event) {
        setSortBy(event.target.value);
        store.loadIdNamePairs(searchQuery, event.target.value);
    }

    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '100%', maxHeight: 'calc(100vh - 300px)', overflow: 'auto', bgcolor: 'transparent', mb: "20px" }}>
                {
                    store.idNamePairs.map((pair) => (
                        <PlaylistCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                Your Playlists
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: "30%", gap: 1, mt: 2 }}>
                    <TextField
                        label="by Playlist Name"
                        size="small"
                        value={searchQuery.name}
                        onChange={handleQueryChange('name')}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': { borderColor: '#FFFFFF' },
                                '&:hover fieldset': { borderColor: '#FFFFFF' },
                                '&.Mui-focused fieldset': { borderColor: '#1db954' },
                            },
                            '& .MuiInputLabel-root': { color: '#FFFFFF' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#1db954' },
                        }}
                    />
                    <TextField
                        label="by User Name"
                        size="small"
                        value={searchQuery.user}
                        onChange={handleQueryChange('user')}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': { borderColor: '#FFFFFF' },
                                '&:hover fieldset': { borderColor: '#FFFFFF' },
                                '&.Mui-focused fieldset': { borderColor: '#1db954' },
                            },
                            '& .MuiInputLabel-root': { color: '#FFFFFF' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#1db954' },
                        }}
                    />
                    <TextField
                        label="by Song Title"
                        size="small"
                        value={searchQuery.songTitle}
                        onChange={handleQueryChange('songTitle')}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': { borderColor: '#FFFFFF' },
                                '&:hover fieldset': { borderColor: '#FFFFFF' },
                                '&.Mui-focused fieldset': { borderColor: '#1db954' },
                            },
                            '& .MuiInputLabel-root': { color: '#FFFFFF' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#1db954' },
                        }}
                    />
                    <TextField
                        label="by Song Artist"
                        size="small"
                        value={searchQuery.songArtist}
                        onChange={handleQueryChange('songArtist')}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': { borderColor: '#FFFFFF' },
                                '&:hover fieldset': { borderColor: '#FFFFFF' },
                                '&.Mui-focused fieldset': { borderColor: '#1db954' },
                            },
                            '& .MuiInputLabel-root': { color: '#FFFFFF' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#1db954' },
                        }}
                    />
                    <TextField
                        label="by Song Year"
                        size="small"
                        value={searchQuery.songYear}
                        onChange={handleQueryChange('songYear')}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#FFFFFF',
                                '& fieldset': { borderColor: '#FFFFFF' },
                                '&:hover fieldset': { borderColor: '#FFFFFF' },
                                '&.Mui-focused fieldset': { borderColor: '#1db954' },
                            },
                            '& .MuiInputLabel-root': { color: '#FFFFFF' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#1db954' },
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSearch}
                            sx={{ bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' } }}
                        >
                            Search
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleClear}
                            sx={{
                                color: '#ffffffff',
                                borderColor: '#b3b3b3',
                                '&:hover': { borderColor: '#ffffffff', bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            Clear
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ flexGrow: 1 }} id="list-selector-list">
                    <FormControl
                        size="small"
                        sx={{
                            mt: 1,
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                                color: '#ffffffff',
                                '& fieldset': { borderColor: '#b3b3b3' },
                                '&:hover fieldset': { borderColor: '#ffffffff' },
                            },
                            '& .MuiInputLabel-root': { color: '#b3b3b3' },
                            '& .MuiSvgIcon-root': { color: '#b3b3b3' },
                        }}
                    >
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
                            <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                            <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                            <MenuItem value="listenerCount-desc">Listeners (Hi-Lo)</MenuItem>
                            <MenuItem value="listenerCount-asc">Listeners (Lo-Hi)</MenuItem>
                            <MenuItem value="ownerUsername-asc">User (A-Z)</MenuItem>
                            <MenuItem value="ownerUsername-desc">User (Z-A)</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        listCard
                    }
                    {!auth.isGuest && <Fab sx={{marginTop: 2,marginLeft: 2, bgcolor: '#1db954', '&:hover': { bgcolor: '#1ed760' }}}
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>}
                </Box>
            </Box>
            <MUIDeleteModal />
            {store.isEditPlaylistModalOpen() &&
                <MUIEditPlaylistModal />
            }
            {store.isPlayPlaylistModalOpen() &&
                <MUIPlayPlaylistModal />
            }

        </div>)
}

export default HomeScreen;
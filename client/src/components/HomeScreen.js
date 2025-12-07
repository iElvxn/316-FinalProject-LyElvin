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

    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', mb: "20px" }}>
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

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, height: '100%'}}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: "50%" }}>
                    <TextField label="by Playlist Name" size="small" value={searchQuery.name}
                        onChange={handleQueryChange('name')} onKeyDown={handleKeyPress} />
                    <TextField label="by User Name" size="small" value={searchQuery.user}
                        onChange={handleQueryChange('user')} onKeyDown={handleKeyPress} />
                    <TextField label="by Song Title" size="small" value={searchQuery.songTitle}
                        onChange={handleQueryChange('songTitle')} onKeyDown={handleKeyPress} />
                    <TextField label="by Song Artist" size="small" value={searchQuery.songArtist}
                        onChange={handleQueryChange('songArtist')} onKeyDown={handleKeyPress} />
                    <TextField label="by Song Year" size="small" value={searchQuery.songYear}
                        onChange={handleQueryChange('songYear')} onKeyDown={handleKeyPress} />
                    <Button variant="contained" onClick={handleSearch}>Search</Button>
                    <Button variant="outlined" onClick={handleClear}>Clear</Button>
                </Box>
                <Box sx={{ bgcolor: "background.paper", flexGrow: 1 }} id="list-selector-list">
                    {
                        listCard
                    }
                    {!auth.isGuest && <Fab sx={{ marginTop: 2, marginLeft: 2 }}
                        color="primary"
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
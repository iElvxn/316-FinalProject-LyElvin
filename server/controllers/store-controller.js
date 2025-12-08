const auth = require('../auth/index.js')
const { DatabaseManager } = require('../db/index.js');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body;
    console.log("createPlaylist body: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    try {
        const playlist = await DatabaseManager.createPlaylist(body, req.userId);
        return res.status(201).json({
            playlist: playlist
        })
    } catch (error) {
        if (error.message === 'A playlist with this name already exists') {
            return res.status(400).json({
                errorMessage: 'A playlist with this name already exists'
            })
        }
        return res.status(400).json({
            errorMessage: 'Playlist Not Created!'
        })
    }
}
deletePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    try {
        const playlist = await DatabaseManager.deletePlaylist(req.params.id, req.userId);
        return res.status(200).json({
            playlist: playlist
        })
    } catch (error) {
        if (error.message === "Playlist not found!") {
            return res.status(404).json({
                errorMessage: "Playlist not found!"
            })
        } else if (error.message === "authentication error") {
            return res.status(400).json({
                errorMessage: "authentication error"
            })
        }
    }
}
getPlaylistById = async (req, res) => {
    console.log("Find Playlist with id: " + JSON.stringify(req.params.id));
    let userId = auth.verifyUser(req)
    let playlist;

    try {
        if (userId) {
            playlist = await DatabaseManager.getPlaylistById(req.params.id, req.userId);
        } else {
            playlist = await DatabaseManager.getPlaylistById(req.params.id)
        }
        return res.status(200).json({ success: true, playlist: playlist })
    } catch (error) {
        return res.status(400).json({
            errorMessage: "authentication error"
        })
    }
}
getPlaylistPairs = async (req, res) => {
    console.log("getPlaylistPairs");
    let userId = auth.verifyUser(req)
    let playlists;

    try {
        if (userId) {
            playlists = await DatabaseManager.getPlaylistPairs(userId, req.query);
        } else { // we are a guest, so we want to get every playlist
            playlists = await DatabaseManager.getPlaylists(req.query);
        }
        return res.status(200).json({ success: true, idNamePairs: playlists })

    } catch (error) {
        return res.status(400).json({
            errorMessage: "authentication error"
        })
    }
}
getPlaylists = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    try {
        playlists = await DatabaseManager.getPlaylists();
        return res.status(200).json({ success: true, data: playlists })
    } catch (error) {
        console.log(error)
        throw error
    }

}
updatePlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({
            errorMessage: 'UNAUTHORIZED'
        })
    }
    const body = req.body
    console.log("updatePlaylist: " + JSON.stringify(body));
    console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    try {
        const updatedPlaylist = await DatabaseManager.updatePlaylist(req.params.id, req.userId, body.playlist);
        return res.status(200).json({
            success: true,
            id: updatedPlaylist._id,
            message: 'Playlist updated!',
        })
    } catch (error) {
        if (error.message === 'A playlist with this name already exists') {
            return res.status(400).json({
                errorMessage: 'A playlist with this name already exists'
            })
        }
        return res.status(404).json({
            errorMessage: 'Playlist not updated!'
        })
    }

}
incrementListener = async (req, res) => {
    const body = req.body;
    if (!body.userEmail) {
        return res.status(400).json({ errorMessage: 'User email required' });
    }
    try {
        const playlist = await DatabaseManager.incrementListener(req.params.id, body.userEmail);
        return res.status(200).json({ success: true, playlist: playlist });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

getSongs = async (req, res) => {
    try {
        const songs = await DatabaseManager.getSongs(req.query);
        return res.status(200).json({ success: true, songs: songs });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

addSongToPlaylist = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }
    const { playlistId, songId } = req.body;

    try {
        const playlist = await DatabaseManager.addSongToPlaylist(
            playlistId,
            songId,
            req.userId
        );
        return res.status(200).json({ success: true, playlist });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

getUserPlaylists = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }

    try {
        const playlists = await DatabaseManager.getUserPlaylists(req.userId);
        return res.status(200).json({ success: true, playlists });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

incrementSongListenCount = async (req, res) => {
    const { title, artist, year } = req.body;

    try {
        const song = await DatabaseManager.incrementSongListenCount(title, artist, year);
        return res.status(200).json({ success: true, song });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

createSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }

    const { title, artist, year, youTubeId } = req.body

    //make sure we have all the fields
    if (!title || !artist || !year || !youTubeId) {
        return res.status(400).json({
            errorMessage: 'All fields are required'
        });
    }

    try {
        const user = await DatabaseManager.getUserById(req.userId);
        const song = await DatabaseManager.createSong({ title, artist, year: parseInt(year), youTubeId }, user.email);

        return res.status(200).json({
            success: true,
            song: song
        });

    } catch (error) {
        return res.status(400).json({
            errorMessage: error.message
        });
    }
}

updateSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }

    const { id } = req.params;
    const { title, artist, year, youTubeId } = req.body;

    if (!title || !artist || !year || !youTubeId) {
        return res.status(400).json({
            errorMessage: 'All fields are required'
        });
    }

    try {
        const user = await DatabaseManager.getUserById(req.userId);
        const song = await DatabaseManager.updateSong(id, user.email, { title, artist, year: parseInt(year), youTubeId });
        return res.status(200).json({ success: true, song });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

deleteSong = async (req, res) => {
    if (auth.verifyUser(req) === null) {
        return res.status(400).json({ errorMessage: 'UNAUTHORIZED' });
    }
    const { id } = req.params;
    try {
        const user = await DatabaseManager.getUserById(req.userId);
        await DatabaseManager.deleteSong(id, user.email);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(400).json({ errorMessage: error.message });
    }
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    incrementListener,
    getSongs,
    addSongToPlaylist,
    getUserPlaylists,
    incrementSongListenCount,
    createSong,
    updateSong,
    deleteSong
}
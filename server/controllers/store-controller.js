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
        return res.status(404).json({
            error,
            message: 'Playlist not updated!',
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

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    incrementListener
}
/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const StoreController = require('../controllers/store-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, StoreController.createPlaylist)
router.delete('/playlist/:id', auth.verify, StoreController.deletePlaylist)
router.get('/playlist/:id', StoreController.getPlaylistById)
router.get('/playlistpairs', StoreController.getPlaylistPairs)
router.get('/playlists', auth.verify, StoreController.getPlaylists)
router.put('/playlist/:id', auth.verify, StoreController.updatePlaylist)
router.post('/playlist/:id/listen', StoreController.incrementListener)
router.get('/songs', StoreController.getSongs)
router.post('/song/add-to-playlist', auth.verify, StoreController.addSongToPlaylist)
router.get('/user/playlists', auth.verify, StoreController.getUserPlaylists)
router.post('/song/listen', StoreController.incrementSongListenCount)
router.post('/song', auth.verify, StoreController.createSong)
router.put('/song/:id', auth.verify, StoreController.updateSong)
router.delete('/song/:id', auth.verify, StoreController.deleteSong)

module.exports = router
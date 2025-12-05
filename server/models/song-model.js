const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    Songs in the catalog can be added to playlists by any user.
    Only the user who added the song can edit or remove it.

    @author Elvini Linguini
*/
const songSchema = new Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        year: { type: Number, required: true },
        youTubeId: { type: String, required: true },
        addedBy: { type: String, required: true },
        listenCount: { type: Number, default: 0 },
        playlistCount: { type: Number, default: 0 }
    },
    { timestamps: true }
)

// Ensure no duplicate (title, artist, year) combinations
songSchema.index({ title: 1, artist: 1, year: 1 }, { unique: true })

module.exports = mongoose.model('Song', songSchema)
const mongoose = require('mongoose');
const DatabaseManager = require('../DatabaseManager');
const User = require('../../models/user-model');
const Playlist = require('../../models/playlist-model');
const Song = require('../../models/song-model');

class MongoDBManager extends DatabaseManager {
    constructor() {
        super();
        this.User = User;
        this.Playlist = Playlist;
        this.Song = Song;
    }

    async connect() {
        mongoose
            .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
            .catch(e => {
                console.error('Connection error', e.message)
            })
            .then(() => {
                console.log('Connected to MongoDB');
            })
    }

    async createUser(userData) {
        try {
            const user = new this.User(userData);
            return await user.save();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error
        }
    }

    async getUserById(userId) {
        try {
            let user = await this.User.findById(userId);
            return user;
        } catch (error) {
            console.error('Error getting user by ID:', error);
        }
    }

    async getUserByEmail(email) {
        try {
            let user = await this.User.findOne({ email });
            return user;
        } catch (error) {
            console.error('Error getting user by email:', error);
        }
    }

    async updateUser(userId, updateData) {
        try {
            const user = await this.User.findById(userId);

            if (updateData.userName) {
                user.userName = updateData.userName;
            }
            if (updateData.passwordHash) {
                user.passwordHash = updateData.passwordHash;
            }
            if (updateData.avatar !== undefined) {
                user.avatar = updateData.avatar;
            }
            return await user.save();
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async createPlaylist(playlistData, userID) {
        try {
            const playlist = new Playlist(playlistData);
            console.log("playlist: " + playlist.toString());
            if (!playlist) {
                return null;
            }

            const user = await this.User.findOne({ _id: userID })

            console.log("user found: " + JSON.stringify(user));
            user.playlists.push(playlist._id);
            await user.save();
            await playlist.save();
            return playlist.toObject();
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    async deletePlaylist(playlistID, userID) {
        try {
            const playlist = await Playlist.findById(playlistID);
            console.log("playlist found: " + JSON.stringify(playlist));

            if (!playlist) {
                throw new Error('Playlist not found!');
            }

            // DOES THIS LIST BELONG TO THIS USER?
            const user = await User.findOne({ email: playlist.ownerEmail });
            console.log("user._id: " + user._id);
            console.log("userID: " + userID);

            if (user._id.toString() === userID.toString()) {
                console.log("correct user!");
                await Playlist.findOneAndDelete({ _id: playlistID });
                return {};
            } else {
                console.log("incorrect user!");
                throw new Error("authentication error");
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    }

    async getPlaylistById(playlistID, userID) {
        try {
            const playlist = await Playlist.findById(playlistID);

            if (!playlist) {
                throw new Error('Playlist not found');
            }

            console.log("Found list: " + JSON.stringify(playlist));

            // Verify ownership if not guest
            if (userID) {
                const user = await User.findOne({ email: playlist.ownerEmail });

                if (user._id.toString() === userID.toString()) {
                    console.log("correct user!");
                    return playlist.toObject();
                } else {
                    console.log("incorrect user!");
                    throw new Error('authentication error');
                }
            }
            return playlist.toObject();

        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async getPlaylistPairs(userID, query) {
        try {
            console.log("find user with id " + userID);
            const user = await User.findOne({ _id: userID })

            console.log("find all Playlists owned by " + user.email);

            let filter = { ownerEmail: user.email }

            //build our filter. use regex and make case insensitive to find close matches
            if (query.name) {
                filter.name = { $regex: query.name, $options: 'i' };
            }
            if (query.user) {
                filter.ownerUsername = { $regex: query.user, $options: 'i' };
            }
            if (query.songTitle) {
                filter['songs.title'] = { $regex: query.songTitle, $options: 'i' };
            }
            if (query.songArtist) {
                filter['songs.artist'] = { $regex: query.songArtist, $options: 'i' };
            }
            if (query.songYear) {
                filter['songs.year'] = parseInt(query.songYear);
            }
            let sortOption = { name: 1 };
            if (query.sortBy === 'name-desc') {
                sortOption = { name: -1 };
            } else if (query.sortBy === 'listenerCount-desc') {
                sortOption = { listenerCount: -1 };
            } else if (query.sortBy === 'listenerCount-asc') {
                sortOption = { listenerCount: 1 };
            } else if (query.sortBy === 'ownerUsername-asc') {
                sortOption = { ownerUsername: 1 };
            } else if (query.sortBy === 'ownerUsername-desc') {
                sortOption = { ownerUsername: -1 };
            }

            console.log("Filter:", filter)
            const playlists = await Playlist.find(filter).sort(sortOption);
            console.log("found Playlists: " + JSON.stringify(playlists));

            if (!playlists) {
                console.log("!playlists.length");
                return { success: false, error: 'Playlists not found' }
            }
            else {
                console.log("Send the Playlist pairs");
                // PUT ALL THE LISTS INTO ID, NAME PAIRS
                let pairs = [];
                for (let key in playlists) {
                    let list = playlists[key];
                    let pair = {
                        _id: list._id,
                        name: list.name,
                        listenerCount: list.listenerCount || 0,
                        ownerUsername: list.ownerUsername
                    };
                    pairs.push(pair);
                }
                return pairs
            }
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async updatePlaylist(playlistID, userID, updateData) {
        try {
            const playlist = await Playlist.findOne({ _id: playlistID })
            console.log("playlist found: " + JSON.stringify(playlist));


            // DOES THIS LIST BELONG TO THIS USER?
            const user = await User.findOne({ email: playlist.ownerEmail })
            console.log("user._id: " + user._id);
            console.log("req.userId: " + userID);
            if (user._id.toString() == userID.toString()) {
                console.log("correct user!");
                console.log("updateData.name: " + updateData.name);

                playlist.name = updateData.name;
                playlist.songs = updateData.songs;
                const updatedPlaylist = await playlist.save()

                console.log("SUCCESS!!!");
                return updatedPlaylist.toObject()

            }
            else {
                console.log("incorrect user!");
                return { success: false, description: "authentication error" }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getPlaylists(query) {
        let filter = {}

        //build our filter. use regex and make case insensitive to find close matches
        if (query.name) {
            filter.name = { $regex: query.name, $options: 'i' };
        }
        if (query.user) {
            filter.ownerUsername = { $regex: query.user, $options: 'i' };
        }
        if (query.songTitle) {
            filter['songs.title'] = { $regex: query.songTitle, $options: 'i' };
        }
        if (query.songArtist) {
            filter['songs.artist'] = { $regex: query.songArtist, $options: 'i' };
        }
        if (query.songYear) {
            filter['songs.year'] = parseInt(query.songYear);
        }
        let sortOption = { name: 1 };
        if (query.sortBy === 'name-desc') {
            sortOption = { name: -1 };
        } else if (query.sortBy === 'listenerCount-desc') {
            sortOption = { listenerCount: -1 };
        } else if (query.sortBy === 'listenerCount-asc') {
            sortOption = { listenerCount: 1 };
        } else if (query.sortBy === 'ownerUsername-asc') {
            sortOption = { ownerUsername: 1 };
        } else if (query.sortBy === 'ownerUsername-desc') {
            sortOption = { ownerUsername: -1 };
        }

        const playlists = await Playlist.find(filter).sort(sortOption)
        if (!playlists.length) {
            return { success: false, error: `Playlists not found` }
        }
        return playlists.map(playlist => playlist.toObject())
    }

    async incrementListener(playlistID, userEmail) {
        try {
            const playlist = await Playlist.findById(playlistID);
            if (!playlist) {
                throw new Error('Playlist not found');
            }
            if (!playlist.listenedBy.includes(userEmail)) { //if not listened to the opalyist before
                playlist.listenedBy.push(userEmail);
                playlist.listenerCount = playlist.listenedBy.length;
                await playlist.save();
            }
            return playlist.toObject();
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    async getSongs(query) {
        let filter = {};

        //same qyuery system as playlists
        if (query.title) {
            filter.title = { $regex: query.title, $options: 'i' };
        }
        if (query.artist) {
            filter.artist = { $regex: query.artist, $options: 'i' };
        }
        if (query.year) {
            filter.year = parseInt(query.year);
        }

        let sortOption = { title: 1 };
        if (query.sortBy === 'title-desc') {
            sortOption = { title: -1 };
        } else if (query.sortBy === 'artist-asc') {
            sortOption = { artist: 1 };
        } else if (query.sortBy === 'artist-desc') {
            sortOption = { artist: -1 };
        } else if (query.sortBy === 'year-asc') {
            sortOption = { year: 1 };
        } else if (query.sortBy === 'year-desc') {
            sortOption = { year: -1 };
        } else if (query.sortBy === 'listenCount-desc') {
            sortOption = { listenCount: -1 };
        } else if (query.sortBy === 'listenCount-asc') {
            sortOption = { listenCount: 1 };
        } else if (query.sortBy === 'playlistCount-desc') {
            sortOption = { playlistCount: -1 };
        } else if (query.sortBy === 'playlistCount-asc') {
            sortOption = { playlistCount: 1 };
        }

        const songs = await Song.find(filter).sort(sortOption);
        return songs.map(song => song.toObject());
    }

    async addSongToPlaylist(playlistId, songId, userId) {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new Error('Playlist not found');
        }

        const user = await User.findById(userId);
        if (!user || playlist.ownerEmail !== user.email) {
            throw new Error('Not authorized');
        }

        //get the song
        const song = await Song.findById(songId);
        if (!song) {
            throw new Error('Song not found in catalog');
        }

        //make a deep copy
        const songCopy = {
            title: song.title,
            artist: song.artist,
            year: song.year,
            youTubeId: song.youTubeId
        }

        //add to playlist
        playlist.songs.push(songCopy);
        await playlist.save();

        // Increment playlist counter
        if (song.playlistCount) {
            song.playlistCount += 1
        } else {
            song.playlistCount = 1
        }

        await song.save();

        return playlist.toObject()
    }

    async getUserPlaylists(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const playlists = await Playlist.find({ ownerEmail: user.email })
            .select('_id name'); //we only need id and playlist name

        return playlists.map(playlist => ({ _id: playlist._id, name: playlist.name }));
    }
}
const dbManager = new MongoDBManager();
module.exports = dbManager;
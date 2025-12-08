const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import models
const User = require('../models/user-model');
const Playlist = require('../models/playlist-model');
const Song = require('../models/song-model');

// Path to PlaylisterData.json
const dataPath = path.join(__dirname, '..', '..', '..', 'PlaylisterData', 'public', 'data', 'PlaylisterData.json');

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true });
        console.log('Connected to MongoDB');

        // Read the JSON data
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const data = JSON.parse(rawData);

        console.log(`Found ${data.users.length} users and ${data.playlists.length} playlists`);

        // Clear existing data (optional - comment out if you want to keep existing data)
        await User.deleteMany({});
        await Playlist.deleteMany({});
        await Song.deleteMany({});
        console.log('Cleared existing data');

        // Create users with hashed passwords
        const createdUsers = [];
        for (const userData of data.users) {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash('password123', saltRounds); // Default password for all imported users

            const user = new User({
                userName: userData.name,
                email: userData.email.toLowerCase(),
                passwordHash: passwordHash,
                playlists: []
            });

            await user.save();
            createdUsers.push(user);
        }
        console.log(`Created ${createdUsers.length} users`);

        // Distribute playlists among users (round-robin)
        for (let i = 0; i < data.playlists.length; i++) {
            const playlistData = data.playlists[i];
            const owner = createdUsers[i % createdUsers.length]; // Round-robin assignment

            const playlist = new Playlist({
                name: playlistData.name,
                ownerEmail: owner.email,
                ownerUsername: owner.userName,
                songs: playlistData.songs,
                listenerCount: 0,
                listenedBy: []
            });

            await playlist.save();

            // Add playlist to user's playlists array
            owner.playlists.push(playlist._id);
            await owner.save();
        }
        console.log(`Created ${data.playlists.length} playlists`);

        // Extract unique songs from all playlists and add to Song catalog
        const songMap = new Map(); // key: "title|artist|year", value: song data
        let playlistIndex = 0;

        for (const playlistData of data.playlists) {
            const owner = createdUsers[playlistIndex % createdUsers.length];
            for (const song of playlistData.songs) {
                const key = `${song.title}|${song.artist}|${song.year}`;
                // Skip songs without youTubeId
                if (!song.youTubeId) {
                    continue;
                }
                if (!songMap.has(key)) {
                    songMap.set(key, {
                        title: song.title,
                        artist: song.artist,
                        year: song.year,
                        youTubeId: song.youTubeId,
                        addedBy: owner.email,
                        listenCount: 0,
                        playlistCount: 1
                    });
                } else {
                    // Song already exists, increment playlistCount
                    const existing = songMap.get(key);
                    existing.playlistCount += 1;
                }
            }
            playlistIndex++;
        }

        // Save all unique songs to the catalog (limit to 50)
        let songCount = 0;
        const maxSongs = 50;
        for (const songData of songMap.values()) {
            if (songCount >= maxSongs) break;
            const song = new Song(songData);
            await song.save();
            songCount++;
        }
        console.log(`Created ${songCount} unique songs in catalog (limited to ${maxSongs})`);

        console.log('\nImport completed successfully!');
        console.log('All users have password: password123');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error importing data:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

importData();
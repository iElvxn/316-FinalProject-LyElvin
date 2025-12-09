import { beforeAll, beforeEach, afterEach, afterAll, expect, test } from 'vitest';
const dotenv = require('dotenv');
dotenv.config();
const { DatabaseManager } = require('../db/index.js');
const mongoose = require('mongoose')
const DATABASE_TYPE = process.env.DATABASE_TYPE;

let testUser;
let testPlaylist;


/**
 * Vitest test script for the Playlister app's Mongo Database Manager. Testing should verify that the Mongo Database Manager 
 * will perform all necessarily operations properly.
 *  
 * Scenarios we will test:
 *  1) Reading a User from the database
 *  2) Creating a User in the database
 *  3) ...
 * 
 * You should add at least one test for each database interaction. In the real world of course we would do many varied
 * tests for each interaction.
 */

/**
 * Executed once before all tests are performed.
 */
beforeAll(async () => {
    // SETUP THE CONNECTION VIA MONGOOSE JUST ONCE - IT IS IMPORTANT TO NOTE THAT INSTEAD
    // OF DOING THIS HERE, IT SHOULD BE DONE INSIDE YOUR Database Manager (WHICHEVER)
    await DatabaseManager.connect();

    // reseta our mongodb database
    if (DATABASE_TYPE === 'mongodb') {
        await mongoose.connection.dropDatabase();
    } else if (DATABASE_TYPE === 'postgresql') {
        // reset our postgres database
        await DatabaseManager.sequelize.sync({ force: true });
    }
});

/**
 * Executed before each test is performed.
 */
beforeEach(() => {
});

/**
 * Executed after each test is performed.
 */
afterEach(() => {
});

/**
 * Executed once after all tests are performed.
 */
afterAll(() => {
});

/**
 * Vitest test to see if the Database Manager can get a User.
 */
test('Test #1) createUser', async () => {
    // FILL IN A USER WITH THE DATA YOU EXPECT THEM TO HAVE
    const expectedUser = {
        userName: 'JoeMama',
        email: 'joe.mama@stonybrook.edu',
        passwordHash: 'passwordHash'
    };

    // CREATE THE USER
    testUser = await DatabaseManager.createUser(expectedUser)

    // COMPARE THE VALUES OF THE EXPECTED USER TO THE ACTUAL ONE
    expect(testUser.userName).toBe(expectedUser.userName);
    expect(testUser.email).toBe(expectedUser.email);
});

test('Test #2) getUserById', async () => {
    const userId = testUser._id || testUser.id;
    const actualUser = await DatabaseManager.getUserById(userId);

    expect(actualUser).toBeDefined();
    expect(actualUser.userName).toBe(testUser.userName);
    expect(actualUser.email).toBe(testUser.email);
});

test('Test #3) getUserByEmail', async () => {
    const actualUser = await DatabaseManager.getUserByEmail(testUser.email);

    expect(actualUser).toBeDefined();
    expect(actualUser.userName).toBe(testUser.userName);
    expect(actualUser.email).toBe(testUser.email);
});

test('Test #4) createPlaylist', async () => {
    const expectedPlaylist = {
        name: 'Test Playlist',
        ownerEmail: testUser.email,
        ownerUsername: testUser.userName,
        songs: [
            {
                title: 'Song 1',
                artist: 'Artist1',
                year: 2020,
                youTubeId: '123'
            },
            {
                title: 'Song 2',
                artist: 'Artist2',
                year: 2021,
                youTubeId: '456',
            }
        ]
    };

    const userId = testUser._id || testUser.id;
    testPlaylist = await DatabaseManager.createPlaylist(expectedPlaylist, userId);

    expect(testPlaylist).toBeDefined();
    expect(testPlaylist.name).toBe(expectedPlaylist.name);
    expect(testPlaylist.ownerEmail).toBe(expectedPlaylist.ownerEmail);
    expect(testPlaylist.songs).toEqual(expectedPlaylist.songs);
});

test('Test #5) getPlaylistById', async () => {
    const playlistId = testPlaylist._id || testPlaylist.id;
    const userId = testUser._id || testUser.id;

    const actualPlaylist = await DatabaseManager.getPlaylistById(playlistId, userId);

    expect(actualPlaylist).toBeDefined();
    expect(actualPlaylist.name).toBe(testPlaylist.name);
    expect(actualPlaylist.ownerEmail).toBe(testPlaylist.ownerEmail);
    expect(actualPlaylist.songs).toEqual(testPlaylist.songs);
});

test('Test #6) getPlaylistPairs', async () => {
    const userId = testUser._id || testUser.id;

    const pairs = await DatabaseManager.getPlaylistPairs(userId, {});

    expect(pairs).toBeDefined();

    const testPlaylistPair = pairs.find(playlist => playlist.name === testPlaylist.name);
    expect(testPlaylistPair).toBeDefined();
    expect(testPlaylistPair.name).toBe(testPlaylist.name);
});

test('Test #7) getPlaylists', async () => {
    const playlists = await DatabaseManager.getPlaylists({});

    expect(playlists).toBeDefined();
    expect(playlists.length).toBeGreaterThan(0);

    //it should have our test playlist in it
    const foundPlaylist = playlists.find(playlist => playlist.name === testPlaylist.name);
    expect(foundPlaylist).toBeDefined();
    expect(foundPlaylist.ownerEmail).toBe(testPlaylist.ownerEmail);
    expect(foundPlaylist.songs).toEqual(testPlaylist.songs);
});

test('Test #8) updatePlaylist', async () => {
    const playlistId = testPlaylist._id || testPlaylist.id;
    const userId = testUser._id || testUser.id;
    const updateData = {
        name: "Joe Mama",
        songs: [
            {
                title: "New Song",
                artist: "Joe Mama",
                year: 2022,
                youTubeId: "67",
            },
            {
                title: "1738",
                artist: "Fetty Wap",
                year: 2015,
                youTubeId: "69",
            },
            {
                title: "Rick Roll",
                artist: "Rick Astley",
                year: 1987,
                youTubeId: "420",
            }
        ]
    };

    const updatedPlaylist = await DatabaseManager.updatePlaylist(playlistId, userId, updateData);
    expect(updatedPlaylist).toBeDefined();
    expect(updatedPlaylist.name).toBe(updateData.name);
    expect(updatedPlaylist.songs).toEqual(updateData.songs);

    testPlaylist = updatedPlaylist; //update our global to continue our tsts

});

test('Test #9) deletePlaylist', async () => {
    const playlistId = testPlaylist._id || testPlaylist.id;
    const userId = testUser._id || testUser.id;

    await DatabaseManager.deletePlaylist(playlistId, userId);

    await expect(DatabaseManager.getPlaylistById(playlistId, userId)).rejects.toThrow();
});

let testSong;
let testPlaylist2;

test('Test #10) createSong', async () => {
    const songData = {
        title: 'Test Song',
        artist: 'Test Artist',
        year: 2025,
        youTubeId: 'dQw4w9WgXcQ'
    };

    testSong = await DatabaseManager.createSong(songData, testUser.email);

    expect(testSong).toBeDefined();
    expect(testSong.title).toBe(songData.title);
    expect(testSong.artist).toBe(songData.artist);
    expect(testSong.year).toBe(songData.year);
    expect(testSong.youTubeId).toBe(songData.youTubeId);
    expect(testSong.addedBy).toBe(testUser.email);
    expect(testSong.listenCount).toBe(0);
    expect(testSong.playlistCount).toBe(0);
});

test('Test #11) createSong - duplicate should fail', async () => {
    const duplicateSongData = {
        title: 'Test Song',
        artist: 'Test Artist',
        year: 2025,
        youTubeId: 'dQw4w9WgXcQ'
    };

    await expect(DatabaseManager.createSong(duplicateSongData, testUser.email))
        .rejects.toThrow('Song with this title, artist, and year already exists');
});

test('Test #12) getSongs', async () => {
    const songs = await DatabaseManager.getSongs({});

    expect(songs).toBeDefined();
    expect(songs.length).toBeGreaterThan(0);

    const foundSong = songs.find(s => s.title === testSong.title);
    expect(foundSong).toBeDefined();
});

test('Test #13) getSongs with a query', async () => {
    const songs = await DatabaseManager.getSongs({ artist: 'Test Artist' });

    expect(songs).toBeDefined();
    expect(songs.length).toBeGreaterThan(0);
    expect(songs[0].artist).toBe('Test Artist');
});

test('Test #14) getSongs - sort by year', async () => {
    // Create another song with different year
    await DatabaseManager.createSong({
        title: 'Som Random Song',
        artist: 'Artist',
        year: 1990,
        youTubeId: 'poopybutt'
    }, testUser.email);

    const songsAsc = await DatabaseManager.getSongs({ sortBy: 'year-asc' });
    const songsDesc = await DatabaseManager.getSongs({ sortBy: 'year-desc' });

    expect(songsAsc[0].year).toBeLessThanOrEqual(songsAsc[songsAsc.length - 1].year);
    expect(songsDesc[0].year).toBeGreaterThanOrEqual(songsDesc[songsDesc.length - 1].year);
});

test('Test #15) updateSong', async () => {
    const songId = testSong._id || testSong.id;
    const updateData = {
        title: 'Updated Song',
        artist: 'Joe Mama',
        year: 2024,
        youTubeId: 'randomID'
    };

    const updatedSong = await DatabaseManager.updateSong(songId, testUser.email, updateData);

    expect(updatedSong).toBeDefined();
    expect(updatedSong.title).toBe(updateData.title);
    expect(updatedSong.artist).toBe(updateData.artist);
    expect(updatedSong.year).toBe(updateData.year);
    expect(updatedSong.youTubeId).toBe(updateData.youTubeId);

    testSong = updatedSong;
});

test('Test #16) incrementSongListenCount', async () => {
    const initialCount = testSong.listenCount || 0;

    const updatedSong = await DatabaseManager.incrementSongListenCount(
        testSong.title, testSong.artist, testSong.year
    );

    expect(updatedSong).toBeDefined();
    expect(updatedSong.listenCount).toBe(initialCount + 1);
});

test('Test #17) getUserPlaylists', async () => {
    // Crete a new playlist
    const userId = testUser._id || testUser.id;
    testPlaylist2 = await DatabaseManager.createPlaylist({
        name: 'User Playlist',
        ownerEmail: testUser.email,
        ownerUsername: testUser.userName,
        songs: []
    }, userId);

    const playlists = await DatabaseManager.getUserPlaylists(userId);

    expect(playlists).toBeDefined();
    expect(playlists.length).toBeGreaterThan(0);
    expect(playlists.some(p => p.name === 'User Playlist')).toBe(true);
});

test('Test #18) addSongToPlaylist', async () => {
    const playlistId = testPlaylist2._id || testPlaylist2.id;
    const songId = testSong._id || testSong.id;
    const userId = testUser._id || testUser.id;

    const updatedPlaylist = await DatabaseManager.addSongToPlaylist(playlistId, songId, userId);

    expect(updatedPlaylist).toBeDefined();
    expect(updatedPlaylist.songs.length).toBe(1);
    expect(updatedPlaylist.songs[0].title).toBe(testSong.title);
});

test('Test #19) createPlaylist - duplicate name should fail', async () => {
    const duplicatePlaylist = {
        name: 'User Playlist',
        ownerEmail: testUser.email,
        ownerUsername: testUser.userName,
        songs: []
    };

    const userId = testUser._id || testUser.id;
    await expect(DatabaseManager.createPlaylist(duplicatePlaylist, userId))
        .rejects.toThrow('A playlist with this name already exists');
});

test('Test #20) getPlaylistPairs query by name', async () => {
    const userId = testUser._id || testUser.id;
    const pairs = await DatabaseManager.getPlaylistPairs(userId, { name: 'User Playlist' });

    expect(pairs).toBeDefined();
    expect(pairs.length).toBeGreaterThan(0);

    const foundPlaylist = pairs.find(p => p.name.includes('User Playlist'));
    expect(foundPlaylist).toBeDefined();
});

test('Test #21) getPlaylistPairs search by user', async () => {
    const userId = testUser._id || testUser.id;
    const pairs = await DatabaseManager.getPlaylistPairs(userId, { user: testUser.userName });

    expect(pairs).toBeDefined();
    expect(pairs.length).toBeGreaterThan(0);
});

test('Test #22) incrementListener for playlist', async () => {
    const playlistId = testPlaylist2._id || testPlaylist2.id;
    const listenerEmail = 'joemama@gmail.com';

    const result = await DatabaseManager.incrementListener(playlistId, listenerEmail);

    expect(result).toBeDefined();
    expect(result.listenerCount).toBe(1);
    expect(result.listenedBy).toContain(listenerEmail);
});

test('Test #23) incrementListener for playlist - same listener', async () => {
    const playlistId = testPlaylist2._id || testPlaylist2.id;
    const listenerEmail = 'joemama@gmail.com';

    const result = await DatabaseManager.incrementListener(playlistId, listenerEmail);

    expect(result).toBeDefined();
    expect(result.listenerCount).toBe(1); // Should still be 1
});

test('Test #24) incrementListener for playlist - diff listeners', async () => {
    const playlistId = testPlaylist2._id || testPlaylist2.id;
    const listenerEmail = '67master@gmail.com';

    const result = await DatabaseManager.incrementListener(playlistId, listenerEmail);

    expect(result).toBeDefined();
    expect(result.listenerCount).toBe(2); // Should still be 1
});

test('Test #25) updateUser', async () => {
    const userId = testUser._id || testUser.id;
    const updateData = {
        userName: 'Elvini Linguini',
        avatar: 'https://somerandomimg.png'
    };

    const updatedUser = await DatabaseManager.updateUser(userId, updateData);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.userName).toBe(updateData.userName);
    expect(updatedUser.avatar).toBe(updateData.avatar);
});

test('Test #26) deleteSong', async () => {
    const songId = testSong._id || testSong.id;

    await DatabaseManager.deleteSong(songId, testUser.email);

    const songs = await DatabaseManager.getSongs({ title: testSong.title });
    expect(songs.length).toBe(0);
});
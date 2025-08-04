const express = require('express');
const multer = require('multer');
const uploadfile = require('../service/storage.service');
const SongModels = require('../models/songs.models');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/songs', upload.single('audio'), async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        const filedata = await uploadfile(req.file); 
        console.log(filedata);

        const song = await SongModels.create({
            title: req.body.title,
            artist: req.body.artist,
            audio: filedata.url,
            mood: req.body.mood
        });

        res.status(201).json({
            message: 'Song created successfully',
            song:song
        });
    } catch (error) {
        console.error("Error uploading song:", error);
        res.status(500).json({ message: "Failed to upload song" });
    }
});

router.get('/songs', async (req, res) => {
    try {
        const { mood } = req.query;

        const songs = await SongModels.find({ mood: mood });

        res.status(200).json({
            message: "Songs fetched successfully",
            songs:songs
        });
    } catch (error) {
        console.error("Error fetching songs:", error);
        res.status(500).json({ message: "Failed to fetch songs" });
    }
});

module.exports = router;
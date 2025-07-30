const express = require('express');
const multer = require('multer');
const uploadfile = require('../service/storage.service');
const SongModels = require('../models/songs.models');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post('/songs',upload.single('audio'), async(req, res) => {
    console.log(req.body);
    console.log(req.file);
    const filedata = await uploadfile(req.file);
    console.log(filedata);
    

    const song = await SongModels.create({
        title:req.body.title,
        artist:req.body.artist,
        audio:filedata.url,
        mood:req.body.mood
    })

    res.status(201).json({
        message:'Song Created Succesfully',
        song : song
    });

})

router.get('/songs', async (req,res)=>{
    const {mood} = req.query;

    const song = await SongModels.findOne({
        mood:mood
    })

    res.status(200).json({
        message: "Songs fetched succesfully",
        song
    })
})

module.exports = router
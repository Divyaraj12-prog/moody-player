require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SongRoutes = require('./routes/song.routes');

const app = express();

app.use(cors({
  origin: '*', 
  credentials: true,
}));

app.use(express.json());

app.use('/', SongRoutes);

module.exports = app;
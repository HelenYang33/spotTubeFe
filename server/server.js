const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/topCategoryVideos/:country', routes.topCategoryVideos);
app.get('/topVideos/:country', routes.topVideos);
app.get('/topMusicVideos', routes.topMusicVideos);
app.get('/topArtists', routes.topArtists);
app.post('/liked-videos', routes.addLikedVideo);
app.delete('/liked-videos', routes.deleteLikedVideo);
app.get('/liked-videos/:user_id', routes.likedVideosByUserId);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;

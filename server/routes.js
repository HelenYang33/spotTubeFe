const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /topCategoryVideos/:country
const topCategoryVideos = async function(req, res) {
  const country = req.params.country ?? null;
  if(country != null) {
    connection.query(`
    SELECT v1.category_name, v1.video_id, v1.category_id, v1.title
    FROM Videos v1
    INNER JOIN (
        SELECT category_name, MAX(views) AS max_views
        FROM Videos
        WHERE country = '${country}'
        GROUP BY category_name
    ) AS max_views_per_category ON v1.category_name = max_views_per_category.category_name
                                AND v1.views = max_views_per_category.max_views
    WHERE v1.country = '${country}'
    LIMIT 30
    `, (err, data) => {
      if (err || data.length === 0) {
        // If there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
        // return type you may need to return an empty array [] instead.
        res.json([]);
      } else {
        // Here, we return results of the query as an object, keeping only relevant data
        // being song_id and title which you will add. In this case, there is only one song
        // so we just directly access the first element of the query results array (data)
        // TODO (TASK 3): also return the song title in the response
        res.json(data);
      }
    });
  } else {
    connection.query(`
    SELECT DISTINCT v1.category_name, v1.video_id, v1.category_id, v1.title
    FROM Videos v1
    LEFT JOIN (
        SELECT v2.category_name, MAX(v2.views) AS max_views
        FROM Videos v2
        GROUP BY v2.category_name
    ) max_views_per_category
    ON v1.category_name = max_views_per_category.category_name
      AND v1.views = max_views_per_category.max_views
    LIMIT 5;
    `, (err, data) => {
      if (err || data.length === 0) {
        // If there is an error for some reason, or if the query is empty (this should not be possible)
        // print the error message and return an empty object instead
        console.log(err);
        // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
        // return type you may need to return an empty array [] instead.
        res.json([]);
      } else {
        // Here, we return results of the query as an object, keeping only relevant data
        // being song_id and title which you will add. In this case, there is only one song
        // so we just directly access the first element of the query results array (data)
        // TODO (TASK 3): also return the song title in the response
        res.json(data);
      }
    });
  }
}

// Route 2: GET /topVideos/:country
const topVideos = async function(req, res) {
  connection.query(`
    SELECT DISTINCT *
    FROM Videos 
    WHERE country = '${req.params.country}'
    ORDER BY views DESC
    LIMIT 5;
  `, (err, data) => {
    if (err || data.length === 0) {
      // If there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 3: GET /topMusicVideos
const topMusicVideos = async function(req, res) {
  connection.query(`
  SELECT DISTINCT v1.category_name, v1.video_id, t.track_name, t.spotify_url, v1.title
  FROM Track t LEFT JOIN Videos v1 on t.youtube_video_id = v1.video_id
  LEFT JOIN (
      SELECT v2.category_name, MAX(v2.likes) AS max_likes
      FROM Videos v2
      GROUP BY v2.category_name
  ) max_likes_per_category
  ON v1.category_name = max_likes_per_category.category_name
     AND v1.likes = max_likes_per_category.max_likes
  LIMIT 5;
`, (err, data) => {
  if (err || data.length === 0) {
    // If there is an error for some reason, or if the query is empty (this should not be possible)
    // print the error message and return an empty object instead
    console.log(err);
    // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
    // return type you may need to return an empty array [] instead.
    res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 4: GET /topArtists 
const topArtists = async function(req, res) {
  connection.query(`
  SELECT DISTINCT t.artist, SUM(v.views) AS totalViews
  FROM Track t LEFT JOIN Videos v on t.youtube_video_id = v.video_id
  GROUP BY t.artist
  ORDER BY totalViews DESC
  LIMIT 5;
`, (err, data) => {
  if (err || data.length === 0) {
    // If there is an error for some reason, or if the query is empty (this should not be possible)
    // print the error message and return an empty object instead
    console.log(err);
    // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
    // return type you may need to return an empty array [] instead.
    res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 5: POST /liked-videos
const addLikedVideo = async function(req, res) {
  connection.query(`
  INSERT INTO Liked_videos (video_id, time_watched, user_id)
  VALUES ('${req.body.video_id}', NOW(), '${req.body.user_id}');
`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 6: DELETE /liked-videos
const deleteLikedVideo = async function(req, res) {
  connection.query(`
  DELETE FROM Liked_videos
  WHERE video_id = '${req.body.video_id}' AND user_id = '${req.body.user_id}';
`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 7: GET /liked-videos/:user_id
const likedVideosByUserId = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Liked_videos
  WHERE user_id = ${req.params.user_id};
`, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json([]);
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  topCategoryVideos,
  topVideos,
  topMusicVideos,
  topArtists,
  addLikedVideo,
  deleteLikedVideo,
  likedVideosByUserId
}
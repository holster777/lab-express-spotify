require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

// Home Page

app.get('/', (req, res, next) => {

res.render('index');

})

// Artist Search

app.get('/artist-search', (req, res, next) => {

    console.log(req.query.artistName)

spotifyApi
  .searchArtists(req.query.artistName)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artists: data.body.artists.items});
    
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

})

app.get('/albums/:artistId', (req, res, next) => {

    console.log(req.params)
    
spotifyApi.getArtistAlbums(req.params.artistId)
  .then(function(data) {
    console.log('Artist albums', data.body.items);
    res.render('albums', {album: data.body.items})
    
  }, function(err) {
    console.error(err);
  });

  });


app.get('/album/:albumId', (req, res, next) => {

  console.log(req.params.albumId)

spotifyApi.getAlbumTracks(req.params.albumId)
  .then(function(data) {
    console.log(data.body.items);
    res.render('tracks', {track: data.body.items})

  }, function(err) {
    console.log('Something went wrong!', err);
  });

});

  // Server Listener

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


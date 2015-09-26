'use strict';

var args = process.argv.slice(2);
var listenPort = args.pop() || 80;

var express = require('express');
var wvw_matches = require('./gw2/wvw_matches');

var app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    js: 'index',
    title: 'GW2 WvW Tracker'
  });
});

app.get('/partials/matches', (req, res) => { res.render('matches'); });
app.get('/partials/matchDetails', (req, res) => { res.render('matchDetails'); });

app.get('/ajax/matches', (req, res) => {
  wvw_matches.list()
    .then(matches => { res.json(matches); })
    .catch(error => {
      console.error(error);
      res.status(500);
    });
});

app.use('/js', express.static('lib/client'));
app.use('/', express.static('public'));

app.listen(listenPort, () => {
  console.log(`Server listening on port ${listenPort}`);
});

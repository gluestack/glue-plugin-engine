const express = require('express');

const app = express();
const port = 9000;

app.get('/health-check', (req, res) => {
  return res.status(200).json({status: true, message: 'Health check performed successfully'});
});

app.post('/actions', (req, res) => {
  return res.status(200).json({status: true, message: 'Action performed successfully'});
});

app.post('/events', (req, res) => {
  return res.status(200).json({status: true, message: 'Event performed successfully'});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

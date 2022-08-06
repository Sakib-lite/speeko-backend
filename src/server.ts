import express from 'express';

require('dotenv').config();
const app = express();

app.use('*', (req, res) => {
  res.send('<h1>Welcome to your simple server! Awesome right</h1>');
});

app.listen(process.env.PORT || 5001, () =>
  console.log(`app is running at @${process.env.PORT || 5001}`)
);

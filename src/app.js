const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

require('./routes')(app);

const port = process.env.PORT || 7000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;

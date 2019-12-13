const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const http = require('http').Server(app);

// DB Config
const db = require('./config/keys.js').mongoURI;

mongoose.set('useUnifiedTopology', true);

// Connect to MongoDB
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// parser for input for post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// avoid deprecation
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Routes
app.use('/', require('./routes/index.js'));
app.use('/books', require('./routes/books.js'));

// Port
const PORT = process.env.PORT || 5000;

// listening
const server = http.listen(5000, function() {
    console.log('listening on *:5000');
});

module.exports = app
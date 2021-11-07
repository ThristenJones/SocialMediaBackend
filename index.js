const connectDB = require('./startup/db');
const express = require('express');
const cors = require('cors');
const app = express();
const users = require('./routes/users');
const auth = require('./routes/auth');
const post = require('./routes/post');
const bio = require('./routes/bio');


connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/post', post);
app.use('/api/bio', bio);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
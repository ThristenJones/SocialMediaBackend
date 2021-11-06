const connectDB = require('./startup/db');
const express = require('express');
const cors = require('cors');
const app = express();
const users = require('./routes/users');
const auth = require('./routes/auth');
const post = require('./routes/post');
const cloudinary = require('cloudinary')
var cors = require('cors');
const { default: Cloudinary } = require('./cloudinary');



connectDB();
Cloudinary();

app.use(cors());
app.use(express.json());
app.use('/api/profilePic', profilePic);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/post', post);
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});
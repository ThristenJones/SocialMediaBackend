const { Bio, validateBio } = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const bio = await Bio.find();
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {

        const {error} = validateBio(req.body)
        if (error)
        return res.status(400).send(error)

        const post = new Post ({
            name: req.body.name,
            bio: req.body.bio
        });

        await post.save();
        return res.send(post)
       } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
       }
})

module.exports = router;
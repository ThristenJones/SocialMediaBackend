const { Post, validatePost } = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/:name', async (req, res) => {
    try {
        const post = await Post.find({name: req.params.name});
        return res.send(post);
    } catch (ex) { 
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {

        const {error} = validatePost(req.body)
        if (error)
        return res.status(400).send(error)

        const post = new Post ({
            name: req.body.name,
            text: req.body.text
        });

        await post.save();
        return res.send(post)
       } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
       }
})

router.put('/:id', async (req, res) => {
    try {
        const { error } = Post(req.body);
        if (error) return res.status(400).send(error);

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                text: req.body.text,
            }
        );

        if (!post)
            return res.send(400).send(`The user with the id: "${req.params.id}" does not exist`);

            await post.save();

            return res.send(post)
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete('/:id', async (req, res) => {
    try {

        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post)
            return res.status(400).send(`The post with the id: "${req.params.id}" does not exist`);

            return res.send(post);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/likes/:id', async (req, res) => {
    try {
    const post = await Post.findById(req.params.id);
        if (!post)   
        return res.status(400).send(`The post with id "${req.params.id}" does not exist.`);
        
        post.likes++
        
        await post.save();
        return res.send(post);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;
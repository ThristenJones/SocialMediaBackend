const { User, Friend, PendingFriend, validateUser, validateFriend, Post, validatePost } = require('../models/user');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/post/:name', async (req, res) => {
    try {
        const post = await Post.find({name: req.params.name});
        return res.send(post);
    } catch (ex) { 
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/post/', async (req, res) => {
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

router.put('/post/:id', async (req, res) => {
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

router.delete('/post/:id', async (req, res) => {
    try {

        const post = await Post.findByIdAndRemove(req.params.id);

        if (!post)
            return res.status(400).send(`The post with the id: "${req.params.id}" does not exist`);

            return res.send(post);
    } catch(ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let newUser = await User.findOne({ email: req.body.email });
        if (newUser) return res.status(400).send('User already registered.');
        
        
        newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        
        await newUser.save();
        
        const token = newUser.generateAuthToken();

        return res
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send({ _id: newUser._id, name: newUser.name, email: newUser.email});

        } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/friend/:id', async (req, res) => {
    try {
        const { error } = validateFriend(req.body);
        if (error) return res.status(400).send(error);
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send(`The user with id "${req.params.id}" does not exist.`);
        
        const friend = new Friend({
            name: req.body.name
        })
        user.friendList.push(friend);
        
        await user.save();
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post('/pending/:id', async (req, res) => {
    try {
        const { error } = validateFriend(req.body);
        if (error) return res.status(400).send(error);
        
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send(`The user with id "${req.params.id}" does not exist.`);
        
        const pendingFriend = new PendingFriend({
            name: req.body.name
        })
        user.pendingFriendList.push(pendingFriend);
        
        await user.save();
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.get('/', async (req,res) => {
    try{
        const user = await User.find();
        return res.send(user);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.delete('/:userId/pendingFriendList/:pendingFriendId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);

        let pendingFriend = user.pendingFriendList.id(req.params.pendingFriendId);
        if(!pendingFriend) return res.status(400).send(`The user with id "${req.params.pendingFriendId}" isn't in your pending friends list.`);

        pendingFriend = await pendingFriend.remove();

        await user.save();
        return res.send(pendingFriend);
    }catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


module.exports = router;
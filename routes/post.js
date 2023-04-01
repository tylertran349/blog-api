const express = require('express');
const { Router } = require('express');
const router = Router();
const User = require("../models/user");
const Post = require("../models/post");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const verifyToken = require('./verify_token');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async(req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        console.error(err.message);
        res.status(500).json({error: "Server error"});
    }
});

router.post('/', verifyToken, [
    body('title').isLength({min: 1}).escape().withMessage("Post title must be specified."),
    body('content').isLength({min: 1}).escape().withMessage("Content of post must be specified."),
    body('published').isBoolean().withMessage("published must be a boolean value."),
], async(req, res) => {
    try {
        // Decode the JSON web token
        jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, token) => {
            if(err) {
                return res.status(403).json({error: "Error 403: Forbidden"}); // Only if token is invalid
            } else {
                const validation_errors = validationResult(req);
                if(!validation_errors.isEmpty()) {
                    return res.status(400).json({errors: validation_errors.array()});
                }
                const {title, content, published} = req.body; // Destructure properties from req.body object

                // Create new post
                const post = new Post({
                    title,
                    content,
                    date: new Date(),
                    likes: 0,
                    published,
                    user: token.user, // token.user = user associated with decoded token
                    comments: [],
                });
                post.save().then(function() {
                    res.json(post);
                }, function(err) {
                    return res.status(500).json({error: "Could not create new post in database"}); // New post could not be created/added to the database
                });
            }
        });
    } catch {
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;
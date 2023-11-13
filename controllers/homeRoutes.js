const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

// GET all posts
router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
        attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
            model: Comment,
            attributes: ['id', 'comment', 'postId', 'userId', 'created_at'],
            include: {
                model: User,
                attributes: ['username'],
            },
        },
        {
            model: User,
            attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const post = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      post, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET single post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
            model: Comment,
            attributes: ['id', 'comment', 'postId', 'userId', 'created_at'],
            include: {
                model: User,
                attributes: ['username'],
            },
        },
        {
            model: User,
            attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        { 
            model: BlogPost,
            include: [User],
        },
        {
            model: Comment,
        },
    ],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

// Signup
router.get('/signup', async (req, res) => {
    res.render('signup');
});

module.exports = router;

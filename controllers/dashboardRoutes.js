const router = require('express').Router();
const {Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

// GET all user posts
router.get('/dashboard', withAuth, async (req, res) => {
    try {
      // Get all posts and JOIN with user data
      const postData = await Post.findAll({
        where: {
            user_id: req.session.user_id,
        },
          attributes: ['id', 'user_id', 'title', 'content', 'date_created'],
        include: [
          {
              model: Comment,
              attributes: ['id', 'user_id', 'post_Id', 'content', 'date_created'],
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
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render('dashboard', {posts, logged_in: true});
  
    } catch (err) {
      res.status(500).json(err);
    }
  });

//   Edit a post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
              attributes: ['id', 'user_id', 'title', 'content', 'date_created'],
            include: [
              {
                  model: Comment,
                  attributes: ['id', 'user_id', 'post_Id', 'content', 'date_created'],
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
        
        if (!postData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        const post = postData.map((ost) => post.get({ plain: true }));

        res.render('edit-post', {post, logged_in: true});
    }
    catch (err) {
        res.status(500).json(err);
      }
});

// Handle submission of edited post
router.put('/edit/:id', withAuth, async (req, res) => {
    try {
        const {title, content} = req.body;

        const post = await Post.update(
            {title, content},
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        
        if (post[0] === 0) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }

        res.status(200).json({message: 'Post updated successfully'});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
const router = require('express').Router();
const { BlogPost, Comment, User } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

// GET all user posts
router.get('/dashboard', withAuth, async (req, res) => {
    try {
      // Get all posts and JOIN with user data
      const blogPostData = await BlogPost.findAll({
        where: {
            user_id: req.session.user_id,
        },
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
      const blogPosts = blogPostData.map((blogPost) => blogPost.get({ plain: true }));
      res.render('dashboard', {blogPosts, logged_in: true});
  
    } catch (err) {
      res.status(500).json(err);
    }
  });

//   Edit a post
router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const blogPostData = await BlogPost.findByPk(req.params.id, {
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
        
        if (!blogPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        const blogPost = blogPostData.map((blogPost) => blogPost.get({ plain: true }));

        res.render('edit-post', {blogPost, logged_in: true});
    }
    catch (err) {
        res.status(500).json(err);
      }
});

// Handle submission of edited post
router.put('/edit/:id', withAuth, async (req, res) => {
    try {
        const {title, content} = req.body;

        const updatedPost = await BlogPost.update(
            {title, content},
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        
        if (updatedPost[0] === 0) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }

        res.status(200).json({message: 'Post updated successfully'});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
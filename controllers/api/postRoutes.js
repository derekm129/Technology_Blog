const router = require('express').Router();
const {Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a post
router.post('/', async (req, res) => {
    try {
      const post = await Post.create(req.body);
      res.status(200).json(post);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
// Delete a post
router.delete('/:id', withAuth, async (req, res) => {
    // delete a category by its `id` value
    try {
      const postData = await Post.destroy({
        where: {
          id: req.params.id,
          userId: req.session.userId,
        },
      });
  
      if (!postData) {
        res.status(404).json({message: 'No blog post found with that id!'});
        return;
      }
  
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
// Update a post
router.put('/:id', withAuth, async (req, res) => {
    // update a category by its `id` value
    try {
      const postData = await Post.update (
        {
            title: req.body.title,
            content: req.body.content,
        },
        {
            where: {
                id: req.params.id,
            },
        }
      );
      
      if (!postData[0]) {
        res.status(404).json({message: 'No blog post with this id!'});
        return;
      }
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
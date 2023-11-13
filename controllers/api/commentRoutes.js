const router = require('express').Router();
const {Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

// GET all commments
router.get('/', async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: [
            {
                model: User,
                attributes: ['username'],
            },
        ],
      });

      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
// Create a comment
router.post('/', withAuth, async (req, res) => {
    try {
      const comment = await Comment.create({
        ...req.body,
        userId: req.session.userId,
      });
      
      res.status(200).json(comment);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
// Delete a comment
router.delete('/:id', withAuth, async (req, res) => {
    // delete a category by its `id` value
    try {
      const comment = await Comment.destroy({
        where: {
          id: req.params.id,
          userId: req.session.userId,
        },
      });
  
      if (!comment) {
        res.status(404).json({message: 'No comment found with that id!'});
        return;
      }
  
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
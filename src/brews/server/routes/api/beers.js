const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Beer = require('../../models/Beer');

const ObjectId = require('mongoose').Types.ObjectId; 

// @route   POST api/beers
// @desc    Add beer
// @access  Public
router.post('/', async (req, res) => {
  const { name, type, attributes, brewery } = req.body;

  try {
    // See if beer exists
    let beer = await Beer.findOne({
      name,
    });

    if (beer) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Beer already exists',
          },
        ],
      });
    }

    beer = new Beer({
      name,
      type,
      attributes,
      brewery,
    });

    await beer.save();

    res.json(beer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/beers/:brewery_id
// @desc    Return beers associated with given brewery_id
// @access  Public
router.get('/:brewery_id', async (req, res) => {
  try {
    let beers = await Beer.find(
      { brewery : new ObjectId(req.params.brewery_id) }
    );
    if (!beers) {
      return res.status(400).json({
        errors: [
          {
            msg: 'No beers found',
          },
        ],
      });
    }
    
    res.json(beers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/beers/beer_id/:id
// @desc    Get beer by id
// @access  Public
router.get('/beer_id/:id', async (req, res) => {
    const id = req.params.id;

    try {
      // See if beer exists
      let beer = await Beer.findById(id);

      if (!beer) {
        return res.status(400).json({
          errors: [
            {
              msg: 'Beer does not exist',
            },
          ],
        });
      }

      res.json(beer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});

module.exports = router;

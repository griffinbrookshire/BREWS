const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Beer = require('../../models/Beer');
const Brewery = require('../../models/Brewery');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: 'User already exists',
            },
          ],
        });
      }

      user = new User({
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT user/:email/beers
// @desc    Register liked beer
// @access  Public
router.put('/:email/beers', async (req, res) => {
  const { name } = req.body;
  try {
    let beer = await Beer.findOne({
      name,
    });

    if (!beer) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Drink does not exist',
          },
        ],
      });
    }
    //check if the user exist or assume
    let user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User does not exist',
          },
        ],
      });
    }
    if (!user.likedBeers.some((e) => e.beer.equals(beer._id))) {
      user.likedBeers.push({ beer: beer._id });
    } else {
      return res.status(400).json({
        errors: [
          {
            msg: 'beer has already been added',
          },
        ],
      });
    }

    await user.save();

    res.status(200).json({
      data: beer._id,
    });
    //return the beer object
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:email/beers
// @desc    Grab the users liked beers list
// @access  Public
router.get('/:email/beers', async (req, res) => {
  const email = req.params.email;

  try {
    // Get the beers array from the user
    let beers = await User.findOne({
      email,
    })
      .populate('likedBeers.beer')
      .select('likedbeers -_id');

    if (!beers) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User does not exist',
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

// @route   PUT user/:email/breweries
// @desc    Register liked breweries
// @access  Public
router.put('/:email/breweries', async (req, res) => {
  const { name } = req.body;
  try {
    let brewery = await Brewery.findOne({
      name,
    });

    if (!brewery) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Brewery does not exist',
          },
        ],
      });
    }

    //ensure that user exist
    let user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User does not exist',
          },
        ],
      });
    }
    if (!user.likedBreweries.some((e) => e.brewery.equals(brewery._id))) {
      user.likedBreweries.push({ brewery: brewery._id }); //comment out during testing, replace w/ return message
    } else {
      return res.status(400).json({
        errors: [
          {
            msg: 'Brewery has already been added',
          },
        ],
      });
    }
    await user.save();

    return res.status(200).json({
      data: brewery._id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:email/breweries
// @desc    Grab the users liked breweries list
// @access  Public
router.get('/:email/breweries', async (req, res) => {
  const email = req.params.email;

  try {
    // Get the beers array from the user
    let breweries = await User.findOne({
      email,
    })
      .populate('likedBreweries.brewery')
      .select('likedBreweries -_id');

    if (!breweries) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User does not exist',
          },
        ],
      });
    }

    res.json(breweries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

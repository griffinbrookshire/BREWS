const express = require('express');
const router = express.Router();

const Brewery = require('../../models/Brewery');

// @route   GET api/breweries/search?cit=?
// @desc    Return list of breweries via search
// @access  Public
router.get('/search', async (req, res) => {
  const searchedCity = req.query.city;
  console.dir('Searching breweries for city = ' + searchedCity);
  try {
    let breweries = [];
    if (
      searchedCity === undefined ||
      searchedCity === null ||
      searchedCity === ''
    )
      breweries = await Brewery.find({});
    else
      breweries = await Brewery.find({})
        .where('address.city')
        .equals(searchedCity);
    res.json(breweries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/breweries/:name
// @desc    Return brewery by name
// @access  Public
router.get('/:name', async (req, res) => {
  try {
    let brewery = await Brewery.findOne({
      name: req.params.name,
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
    res.json(brewery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/breweries
// @desc    Register Brewery
// @access  Public
router.post('/', async (req, res) => {
  const { name, address } = req.body;

  try {
    // See if brewery exists
    let brewery = await Brewery.findOne({
      name,
    });

    if (brewery) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Brewery already exists',
          },
        ],
      });
    }

    brewery = new Brewery({
      name,
      address,
    });

    await brewery.save();

    res.json(brewery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/breweries/:name/beers
// @desc    Grab the beers list
// @access  Public
router.get('/:name/beers', async (req, res) => {
  const name = req.params.name;

  try {
    // Get the beers array from the brewery
    let beers = await Brewery.findOne({
      name,
    }).select('beers -_id');

    if (!beers) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Brewery does not exist',
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

// @route   GET api/breweries/type/:type
// @desc    Grab a list of breweries with a certain type of beer
// @access  Public
router.get('/type/:type', async (req, res) => {
    const type = req.params.type;
  
    try {
        // Get all breweries
        let breweries = await Brewery.find();

        let result = []
        for (const brewery of breweries) {
            for (const beer of brewery.beers) {
                let search = await Beer.findById(beer.id);
                if (search.type.toLowerCase() === type.toLowerCase()) {
                    result.push(brewery);
                    break;
                }
            }
        }
  
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

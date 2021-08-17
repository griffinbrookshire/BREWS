const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   POST api/auth
// @desc    User login
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
            // See if user exists find also works
            let user = await User.findOne({
                email,
            });
            //Checks if user exists & if it does load data
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch) {
                    return res.status(400).json({
                        errors: [
                            {
                                msg: 'Invalid Credentials',
                            },
                        ],
                    });
                } else {
                    //This will be stored in localstorage, add liked breweries and beers later
                    return res.status(200).json({
                        data: user.email
                    })
                }
                res.json(user);
            } else {
                res.status(404).send("No user found");
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }

);

module.exports = router;

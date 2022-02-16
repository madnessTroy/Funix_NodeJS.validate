const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post(
	'/signup',
	check('email')
		.isEmail()
		.withMessage('Please enter a valid email!')
		.custom((value, { req }) => {
			if (value === 'toan@gmail.com') {
				throw new Error('This email address is forbidden');
			}
			return true;
		}),
	authController.postSignup
);

router.post('/logout', authController.postLogout);

module.exports = router;

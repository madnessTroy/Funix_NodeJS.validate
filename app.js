// ExpressJs
const express = require('express');
// Mongoose
const mongoose = require('mongoose');
// Core module
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
	'mongodb+srv://admin:admin@funixlab-nodejs.n4ini.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id).then((user) => {
		req.user = user;
		next();
	});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// Mongoose connect

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: 'Toan',
					email: 'test@go.go',
					cart: { items: [] },
				});
				console.log('From: app.js || Created User!');
				user.save();
			}
		});
		app.listen(3000);
	})
	.catch((err) => console.log(err));

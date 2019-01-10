var express = require('express');
var {
    check,
    validationResult
} = require('express-validator/check');
var cuid = require('cuid');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    var router = express.Router();
    var user = require('../models/user');
    var array = [];
    router.get("/", function (req, res) {
        res.render('index', { noteId: cuid() });
    });
    router.get('/note/:nodeId', function (req, res) {
        res.render('typingpage')
    });
    router.get('/typingpage', function (req, res) {
        res.render('typingpage')
    });
    router.get('/login', function (req, res) {
        res.render('signup')
    });
    router.post('/save', function (req, res) {
        note = req.body.notes;


        array.push(note);
        console.log(array);
        res.render('addtask', {
            array
        });

    });
    router.post('/add', function (req, res) {
        //     var newTask = req.body.newtask;





    });
    router.post('/signup', function (req, res) {
        res.render('signup')
    });
    router.post('/register', function (req, res) {
        let name = req.body.name;
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let confirmpassword = req.body.confirmpassword;

        const errors = {};

        if (!name) {
            errors.name = "Name is empty";
        }

        if (!email) {
            errors.email = "Email is empty";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(403).json({
                errors: errors
            });
        }

        let user = new User({
            name: name,
            email: email,
            password: password,
            username: username,
            confirmpassword: confirmpassword
        });

        user.save((err, savedInstance) => {
            if (err) {
                return res.status(403).json({
                    err: "Some data missing"
                });
            }
            console.log(err, savedInstance);
        });

        // createUser(user, function(err, user){
        //     if(err) throw err;
        //     else console.log(user);
        // });
        req.flash('success_message', 'You have registered, Now please login');
        res.redirect('/typingpage');
    });
    router.post('/login', passport.authenticate('local', {
        successRedirect: '/typingpage',
        failureRedirect: '/',
        failureFlash: true
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({
                username: username
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                if (user.password === password) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        }
    ));


    // GET route after registering
    router.get('/', function (req, res, next) {
        User.findById(req.session.userId)
            .exec(function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    if (user === null) {
                        var err = new Error('Not authorized! Go back!');
                        err.status = 400;
                        return next(err);
                    } else {
                        return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email)
                    }
                }
            });
    });
    return router;
}
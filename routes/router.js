var express = require('express');
var cuid = require('cuid');
var test = cuid();
console.log(test);
var router = express.Router();
var user = require('../models/user');
var array=[];
    router.get("/", function (req, res) {
        res.render('index')
    });
router.post('/note', function (req, res) {
    res.render('typingpage')
});
router.post('/save', function (req, res) {
    note = req.body.notes;
    
    
    array.push(note);
    console.log(array);
    res.render('addtask',{array});

});
 router.post('/add', function (req, res) {
//     var newTask = req.body.newtask;
    
    



 });
router.post('/signup', function (req, res) {
    res.render('signup')
});
router.post('/account', function (req, res) {
    if (req.body.password !== req.body.confirmpassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    if (req.body.name &&
        req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.confirmpassword) {

        var userData = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            confirmpassword: req.body.confirmpassword,
        }
        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 400;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });
    } else {
        var err = new Error('All fields required.');
        err.status = 401;
        return next(err);
        // res.send("All fields required.");

        //console.log(err);
    } // GET route after registering
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


});
module.exports = router;
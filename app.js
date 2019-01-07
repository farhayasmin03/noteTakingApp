const http = require('http');

const request = require('request');
const port = 3000;
var express = require('express');

var app = express();
const bodyParser = require('body-parser');

var ejs = require('ejs');
//var error="";
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.get("/",function(req,res){
    res.render('index')
});
app.post('/note',function(req,res){
    res.render('typingpage')
})
app.post('/signup',function(req,res){
    res.render('signup')
})
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
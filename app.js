const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Article = require('./models/articles')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB" , {useNewUrlParser: true});

app.get('/articles', (req, res) => {
    Article.find({}, (err, results) => {

    });
});








app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});


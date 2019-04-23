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
        if (!err) {
            res.send(results);
        } else {
            res.send(err);
        }
    });
});

app.post('/articles', (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send('Successfully added a new article!');
        } else {
            res.send(err);
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});


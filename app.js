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

/////TARGETING ARTICLE ROUTES/////////

app.route('/articles')

.get((req, res) => {
    Article.find({}, (err, results) => {
        if (!err) {
            res.send(results);
        } else {
            res.send(err);
        }
    });
})

.post((req, res) => {
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
})

.delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send('Successfully deleted all articles!');
        } else {
            res.send(err);
        }
    });
});

/////TARGETING ARTICLE ROUTES/////////


/////TARGETING SPECIFIC ARTICLE ROUTES/////////

app.route('/articles/:articleTitle')

.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send('No articles matching that title were found!');
        }
    });
})

.post((req, res) => {

})

.delete((req, res) => {

});

/////TARGETING SPECIFIC ARTICLE ROUTES/////////


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});


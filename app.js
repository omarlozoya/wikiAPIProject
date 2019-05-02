const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const Article = require('./models/articles');
const axios = require('axios');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + 'public'));

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

.put((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if (!err) {
                res.send('Successfully updated Article!');
            } else {
                res.send(err);
            }
        }
    );
})

.patch((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        (err) => {
            if (!err) {
                res.send('Successfully updated article');
            } else {
                res.send(err);
            }
        }
    )
})

.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
        if (!err) {
            res.send("Successfully deleted the article");
        } else {
            res.send(err);
        }
    });
});

/////TARGETING SPECIFIC ARTICLE ROUTES/////////


/////TARGETING WIKI RESTful API ROUTES USING AXIOS/////////

app.get('/WikiArticles/:title', async (req, res) => {
    let results;

    results = await getWikiApi(req.params.title);

    res.send(results);

    // try {
    //     await axios.get('https://en.wikipedia.org/api/rest_v1/page/title/' + req.params.title, ({
    //         params: {
    //             'Api-User-Agent': 'omarlozoya@ymail.com' 
    //         }
    //     })).then(await function(response) {
    //         //console.log(respone.data);
    //         results = response;
    //     });
    // } catch (error) {
    //     console.log(error.response);
    // }

    // await res.status(200).send(results);
    
    // const data = await axios.get('https://en.wikipedia.org/api/rest_v1/page/title/' + req.params.title, ({
    //     params: {
    //         'Api-User-Agent': 'omarlozoya@ymail.com' 
    //     }
    // })).then(function (response) {
    //     console.log(response.data);
    //     return res.status(200).send(response.data);
    // }).catch(function (error) {
    //     console.log(error);
    //     return res.send(error);
    // });

    // return data;
});

async function getWikiApi(name) {
    let data; 
    
    await axios.get('https://en.wikipedia.org/api/rest_v1/page/html/' + name, {params: { 'Api-User-Agent': 'omarlozoya@ymail.com' }})

    .then(response => {
        data = response.data;
    })
    
    .catch(error => {
        // console.log(error);
    });

    return data;
}

async function getArticles() {
    let articles;

    await axios.get('http://localhost:3000/articles').then(response => { articles = response.data }).catch(error => {console.log(error)});

    return articles;
}

/////TARGETING WIKI RESTful API ROUTES USING AXIOS/////////


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on port 3000");
});


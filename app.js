const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
  .get((req, res) => {
    Article.find((err, articles) => {
      (err) ? res.send(err) : res.send(articles);
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      (err) ? res.send(err) : res.send('POST Success!');
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      (err) ? res.send(err) : res.send('DELETE Success!');
    });
  });

app.route('/articles/:title')
  .get((req, res) => {
    Article.findOne({title: req.params.title}, (err, article) => {
      (err) ? res.send(err) : res.send(article);
    });
  })
  .put((req, res) => {
    Article.replaceOne({title: req.params.title}, {title: req.body.title, content: req.body.content}, (err, result) => {
      (err) ? res.send(err) : res.send('UPDATE Success!');
    });
  })
  .patch((req, res) => {
    Article.findOneAndUpdate({title: req.params.title}, {$set: req.body}, (err, result) => {
      (err) ? res.send(err) : res.send('PATCH Success!');
    });
  })
  .delete((req, res) => {
    Article.deleteOne({title: req.params.title}, (err, result) => {
      (err) ? res.send(err) : res.send('DELETE Success!');
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./db');
const { analyzeKeywords, optimizeOnPage, analyzeContent } = require('./seoLibrary');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/generate-blog', async (req, res) => {
  const content = req.body.title;

  try {
    // Perform keyword analysis
    const keywords = await analyzeKeywords(content);

    // Perform on-page optimization
    const optimizedContent = await optimizeOnPage(content);

    // Perform content analysis
    const contentAnalysis = await analyzeContent(content);

    // Save the blog content to the database
    const query = 'INSERT INTO posts (title) VALUES (?)';
    connection.query(query, [content], (err, result) => {
      if (err) {
        console.error('Error saving blog content:', err);
        res.status(500).json({ error: 'Failed to save blog content.' });
      } else {
        res.status(200).json({
          blogContent: content,
          keywords: keywords,
          optimizedContent: optimizedContent,
          contentAnalysis: contentAnalysis
        });
      }
    });
  } catch (error) {
    console.error('Error generating the blog post:', error);
    res.status(500).json({ error: 'Failed to generate the blog post.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3214;

app.use(cors());

const post = {
  name: 'Test Post Name',
  description: 'awdwadawdawdawdawdawd',
  createdAt: new Date(),
  createdBy: 'Brani',
};
const pageContains = 10;
const testPosts = Array.from({ length: 200 }, (_, i) => ({
  ...post,
  id: i,
}));

app.get('/', (req, res) => {
  const { page } = req.query;
  const paginatedPosts = testPosts.slice(
    page * pageContains,
    page * pageContains + pageContains
  );

  res.send(paginatedPosts);
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.....`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3214;

app.use(cors());
app.use(express.json());

const post = {
  name: 'Test news Name',
  description: 'awdwadawdawdawdawdawd',
  createdAt: new Date(),
  createdBy: 'Brani',
  quantity: 0,
};
const pageContains = 10;
const testPosts = Array.from({ length: 200 }, (_, i) => ({
  ...post,
  id: i,
  name: post.name + i,
  quantity: Math.floor(Math.random() * 100),
}));

app.get('/', (req, res) => {
  const { page } = req.query;
  const index = page - 1;
  const paginatedPosts = testPosts.slice(
    index * pageContains,
    index * pageContains + pageContains
  );

  res.send(paginatedPosts);
});

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const result = testPosts.find((post) => post.id == id);
  res.send(result);
});

app.patch('/:id', (req, res) => {
  const { id } = req.params;
  const dto = req.body;

  const currentItem = testPosts.find((post) => post.id == id);

  currentItem.quantity = dto.quantity;

  res.send(currentItem);
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.....`);
});

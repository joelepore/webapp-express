import connection from '../data/db.js';

const index = (req, res) => {
  res.send('Movie list');
}

const show = (req, res) => {
  const id = req.params.id;
  res.send(`Movie with id ${id} detail`);
}

export default {
  index,
  show
}
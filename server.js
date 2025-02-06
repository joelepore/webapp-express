import express from 'express';
const app = express();
// dotenv
import 'dotenv/config';
const port = process.env.PORT;
// Middlewares
import errorsHandler from './middlewares/errorsHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
// Router
import moviesRouter from './routers/movies.js';

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Movies Server api');
})

app.use('/api/movies', moviesRouter);

app.use(errorsHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
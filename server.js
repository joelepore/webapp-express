import express from 'express';
const app = express();
const port = process.env.PORT;
// Middlewares
import errorsHandler from './middlewares/errorsHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import setImagePath from './middlewares/setImagePath.js';
// Router
import moviesRouter from './routers/movies.js';
// Cors
import cors from 'cors';

app.use(express.json());
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:5173'
}))

app.get('/', (req, res) => {
  res.send('Movies Server api');
  console.log(req.imagePath);
})
// Uso il middleware setImagePath prima di settare il router movies
app.use(setImagePath);

app.use('/api/movies', moviesRouter);

app.use(errorsHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})
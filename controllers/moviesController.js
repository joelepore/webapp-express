import connection from '../data/db.js';

const index = async (req, res) => {
  const sql = `
    SELECT movies.*, reviews.name AS review_name, reviews.vote, reviews.text 
    FROM movies 
    LEFT JOIN reviews ON movies.id = reviews.movie_id
  `;

  const aggregateMovies = (results) => {
    const movies = results;
    // Raggruppo i movie in un oggetto che ha come chiave l'id del movie
    const groupedMovies = Object.groupBy(movies, movie => movie.id);
    // Aggrego i movie creando un array di movies in cui ogni movie contiene un array di reviews 
    const aggregatedMovies = Object.keys(groupedMovies).map(id => {
      // Prendo un gruppo di movie tramite la chiave dell'oggetto
      const movieGroup = groupedMovies[id];
      // Pulisco l'oggetto movie
      const { review_name, vote, text, ...cleanMovie } = movieGroup[0];
      // Restituisco un nuovo oggetto unendo cleanMovie e reviews, che sara' un array di oggetti review
      return {
        ...cleanMovie,
        reviews: movieGroup.map(movie => ({ name: movie.review_name, vote: movie.vote, text: movie.text }))
      }
    })
    return aggregatedMovies;
  }

  try {
    const [results] = await connection.query(sql);
    const movies = aggregateMovies(results);
    res.json(movies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

}

const show = async (req, res) => {
  const id = req.params.id;
  const sql = `
  SELECT movies.*, reviews.name AS review_name, reviews.vote, reviews.text 
  FROM movies
  LEFT JOIN reviews ON movies.id = reviews.movie_id
  WHERE movies.id = ?
  `;

  const aggregateMovie = (results) => {

    // Pulisco l'oggetto movie
    const { review_name, vote, text, ...movie } = results[0];

    const aggregatedMovie = {
      ...movie,
      reviews: results.map(movie => ({ name: movie.review_name, vote: movie.vote, text: movie.text }))
    }

    return aggregatedMovie;
  }

  try {
    const [results] = await connection.query(sql, [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Movie not found' });
    const movie = aggregateMovie(results);
    res.json(movie);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default {
  index,
  show
}
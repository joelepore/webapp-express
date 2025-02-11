import connection from '../data/db.js';

const index = async (req, res) => {
  const sql = `
    SELECT movies.*, reviews.name AS review_name, reviews.vote, reviews.text 
    FROM movies 
    LEFT JOIN reviews ON movies.id = reviews.movie_id
  `;
  const sqlAverageVote = `
    SELECT movies.id, ROUND(AVG(reviews.vote), 1) AS average_vote
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    GROUP BY movies.id
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

  const addAverageVote = (movies, votes) => {
    const finalMovies = votes.map(vote => {
      return {
        ...movies.find(movie => movie.id === vote.id),
        average_vote: vote.average_vote
      }
    })
    return finalMovies;
  }

  const addImagePaths = (req, movies) => {
    return movies.map(movie => ({ ...movie, image: req.imagePath + movie.image }));
  }

  try {
    const [results] = await connection.query(sql);
    const [averageVotes] = await connection.query(sqlAverageVote);
    let movies = aggregateMovies(results);
    movies = addAverageVote(movies, averageVotes);
    movies = addImagePaths(req, movies);
    res.json(movies);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

}

const show = async (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT movies.*, reviews.name AS review_name, reviews.vote, reviews.text, reviews.id AS review_id
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?
  `;

  const sqlAverageVote = `
    SELECT movies.id, ROUND(AVG(reviews.vote), 1) AS average_vote
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?
    GROUP BY movies.id
  `;
  const aggregateMovie = (results) => {
    // Pulisco l'oggetto movie
    const { review_id, review_name, vote, text, ...movie } = results[0];

    const aggregatedMovie = {
      ...movie,
      reviews: results.map(movie => ({ id: movie.review_id, name: movie.review_name, vote: movie.vote, text: movie.text }))
    }

    return aggregatedMovie;
  }

  const addAverageVote = (movie, vote) => {
    return {
      ...movie,
      average_vote: vote.average_vote
    }
  }

  const addImagePath = (req, movie) => {
    return {
      ...movie,
      image: req.imagePath + movie.image
    }
  }

  try {
    const [results] = await connection.query(sql, [id]);
    const [[averageVote]] = await connection.query(sqlAverageVote, [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Movie not found' });
    let movie = aggregateMovie(results);
    movie = addAverageVote(movie, averageVote);
    movie = addImagePath(req, movie);
    res.json(movie);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default {
  index,
  show
}
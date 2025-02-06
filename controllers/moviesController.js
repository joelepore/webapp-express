import connection from '../data/db.js';

const index = (req, res) => {
  const sql = `
    SELECT movies.*, reviews.name AS review_name, reviews.vote, reviews.text
    FROM movies 
    JOIN reviews ON movies.id = reviews.movie_id;
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

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

    res.json(aggregatedMovies);
  });
}

const show = (req, res) => {
  const id = req.params.id;
  res.send(`Movie with id ${id} detail`);
}

export default {
  index,
  show
}
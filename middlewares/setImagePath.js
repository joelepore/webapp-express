const setImagePath = (req, res, next) => {
  const protocol = req.protocol;
  const host = req.headers.host;

  req.imagePath = `${protocol}://${host}/img/movies/`;
  next();
}

export default setImagePath;
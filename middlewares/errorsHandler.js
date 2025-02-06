const errorsHandler = (err, req, res, next) => {
  res.status(500);
  res.json({
    status: 500,
    error: 'Internal Server Error',
    message: err.message
  })
}

export default errorsHandler;
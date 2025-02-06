const notFoundHandler = (req, res, next) => {
  res.status(404);
  res.json({
    status: 404,
    message: 'Resource not found',
    error: 'Not Found'
  })
}

export default notFoundHandler;
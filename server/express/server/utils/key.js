const key = 'password';

function apiCheck(req, res, next) {
  if (req.query.apikey === key) {
    next();
    return
  }
  res.status(401).send("Unauthorized")
}

module.exports = apiCheck;
const key = 'password';

function apiCheck(req, res, next) {
  if (checkKey(req.query.apikey)) {
    next();
    return
  }
  res.status(401).send("Unauthorized")
}

// Private function
function checkKey(keyToCheck) {
  if (keyToCheck === key) {
    return true;
  }
  return false;
}

module.exports = apiCheck;
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
  const token = req.headers.token;
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const accessToken = refreshToken;
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.redirect('/auth/login')
  }
};
const verifyUser = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
    const accessToken = refreshToken;
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      req.user = user;
      next();
    });

};
const verifyTokenAndUserAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id|| req.user.quyen=='Admin') {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.quyen=='Admin') {
      next();
    } else {
      res.status(403).json("You're not allowed to do that!");
    }
  });
};

module.exports = {
  verifyUser,
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
};

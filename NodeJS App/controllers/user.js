const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.Password, 10).then(hash => {
    //console.log(req.body.Name);
    
    const user = new User({
      email: req.body.Email,
      password: hash, 
      name: req.body.Name
    });
    user
      .save()
      .then(result => {
        const token = jwt.sign(
          { email: user.email, userId: user._id },
          "secret_this_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(201).json({
          message: "User created!",
          token: token,
          result: result
        });
      })
      .catch(err => {
        console.log(err);
        
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.Email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.Password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.getUser = (req, res, next) => {
  let fetchedUser ;
  //console.log(req.query.email);
  
  User.findOne({ email: req.query.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    else{
      return res.status(201).json({
        email : user.email,
        name : user.name,
        firstName: user.firstName, 
        lastName: user.lastName 
      });
    }
  });
}

exports.UpdateUser = (req, res, next) => {
  //console.log(req.query.email);
  //console.log(req.body);
  
  
  User.findOne({ email: req.body.Email })
  .then(user => {
    if(!user){
      return res.status(401).json({
        message: "user not found"
      });
    }
    else{
      user.firstName = req.body.FirstName;
      user.lastName = req.body.LastName;
      user.save()
      .then(result => {
        res.status(201).json({
          message: "User updated!"
        });
      })
    }
  });
}

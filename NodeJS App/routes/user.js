const express = require("express");

const UserController = require("../controllers/user");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/getUser", UserController.getUser);

router.put("/updateUser", UserController.UpdateUser);

module.exports = router;

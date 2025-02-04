const express = require("express");
const { registerUser, loginUser, getUsers,deleteUser } = require("../Controller/user.controller");

const router = express.Router();

// Register Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

//get user
router.get("/get-users",getUsers);

//delete user
router.delete("/delete-user/:id",deleteUser);

module.exports = router;

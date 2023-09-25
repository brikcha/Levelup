const express = require("express");
const { banUser, unbanUser } = require("../utils/crud");
const router = express.Router();
// import middleware
// import controller register

router.put("/ban/:id", banUser);
router.put("/unban/:id", unbanUser);

module.exports = router;

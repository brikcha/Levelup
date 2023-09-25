const express = require("express");
const { banUser, unbanUser, banUserAccount } = require("../utils/crud");
const router = express.Router();
// import middleware
// import controller register

router.put("/ban/:id", banUserAccount);
router.put("/unban/:id", unbanUser);

module.exports = router;

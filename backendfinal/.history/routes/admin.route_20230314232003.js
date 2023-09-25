const express = require("express");
const { banUser, unbanUser, banUserAccount } = require("../utils/crud");
const router = express.Router();
// import middleware
// import controller register

router.put("/banAcc/:id", banUserAccount);
router.put("/unban/:id", unbanUser);
m3adch test7a9'hom
module.exports = router;

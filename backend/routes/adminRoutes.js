const express = require("express");
const router = express();
const {isAdmin} = require("../middleware/authMiddleware");
const {AddBus, UpdateBus, DeleteBus} = require("../controllers/adminController");

router.post("/addbus", isAdmin, AddBus);
router.post("/updatebus/:registrationNumber", isAdmin, UpdateBus);
router.post("/deletebus/:registrationNumber", isAdmin, DeleteBus);

module.exports = router;

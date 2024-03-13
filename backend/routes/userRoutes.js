const express = require("express");
const router = express();
const {isLoggedIn} = require("../middleware/authMiddleware");
const {GetBus, BookSeats, AvailiableSeats, GetAllBuses, BookedTickets, CancelTicket } = require("../controllers/userController");


router.post("/getbusdetails", isLoggedIn, GetBus);
router.get("/getbusdetails", GetAllBuses); 
router.get("/bookedtickets", isLoggedIn, BookedTickets);
router.post("/cancelticket", isLoggedIn, CancelTicket); 
router.post("/findseat", isLoggedIn, AvailiableSeats);
router.post("/bookseat", isLoggedIn, BookSeats);


module.exports = router;
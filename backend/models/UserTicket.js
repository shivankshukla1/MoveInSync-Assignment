const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  ticketCount: {
    type: Number,
    required: true,
  },
  dateOfTravel: {
    type: String,
    required: true,
  },
  ticketId: {
    type: Number,
    required: true,
  },
  
});

const UserTicket = mongoose.model('UserTicket', ticketSchema);

module.exports = UserTicket;

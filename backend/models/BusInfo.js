const mongoose = require('mongoose');

const busInfoSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
  },
  daysOfOperation: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  busName: {
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
  startStop: {
    type: String,
    required: true,
  },
  endStop: {
    type: String,
    required: true,
  },
});

const BusInfo = mongoose.model('BusInfo', busInfoSchema);

module.exports = BusInfo;

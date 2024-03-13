const BusInfo = require('../models/BusInfo');
const BusRoutes = require('../models/BusRoutes');
const UserTicket = require('../models/UserTicket');
const UserInfo = require("../models/userInfo");
const moment = require('moment');


const GetBus = async (req, res) => {
    try {
        const { source, destination, dateOfTravel } = req.body;

        if (moment(dateOfTravel).isBefore(moment(), 'day')) {
            return res.status(400).json({ error: 'Invalid date. Cannot retrieve buses for a past date.' });
        }

        const dayOfWeek = moment(dateOfTravel).day();

        const dayMask = 1 << (6 - dayOfWeek);
        const matchingRoutes = await BusRoutes.find({
            source,
            destination,       
        });

        const registrationNumbers = matchingRoutes.map(route => route.registrationNumber);
        
        const matchingBuses = await BusInfo.find({
            registrationNumber: { $in: registrationNumbers },
            daysOfOperation: { $bitsAllSet: dayMask },
        });
        
        const response = matchingBuses.map(bus => ({
            registrationNumber: bus.registrationNumber,
            startTime: matchingRoutes.find(route => route.registrationNumber === bus.registrationNumber).startTime,
            endTime: matchingRoutes.find(route => route.registrationNumber === bus.registrationNumber).endTime,
            busName: bus.busName,
        }));

        return res.json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




const getAvailableSeats = async (registrationNumber, source, destination, dateOfTravel) => {
    try {
        const busInfo = await BusInfo.findOne({ registrationNumber});
        if (!busInfo) {
            return {error:"Invalid Registration Number"};
        }

        const busRoute = await BusRoutes.findOne({
            registrationNumber,
            source,
            destination,
        });
        if (!busRoute) {
            return {"error":"Invalid Route Details!!!"};
        }

        const travelDate = new Date(dateOfTravel);
        const dayOfOperation = busInfo.daysOfOperation;
        const dayOfWeek = travelDate.getDay();
        const dayMask = 1 << dayOfWeek;
        if ((dayOfOperation & dayMask) === 0) {
            return {"error":"Bus does not operate on the selected day"};
        }

        const totalSeats = busInfo.totalSeats;

        const bookedTickets = await UserTicket.find({
            registrationNumber,
            dateOfTravel
        });
        
        

        const totalBookedSeats = bookedTickets.reduce((total, ticket) => total + ticket.ticketCount, 0);

        const tempSeats = bookedTickets.filter((ticket) => {
            const condition1 = ticket.startTime >= busRoute.endTime;
            const condition2 = ticket.endTime <= busRoute.startTime;
            return condition1 || condition2;
        }).reduce((total, ticket) => total + ticket.ticketCount, 0);

        const availableSeats = totalSeats - totalBookedSeats + tempSeats;
        
        const percent = 100 - (availableSeats/totalSeats)*100;
        let color = "green";

        if(percent > 60 && percent <= 90){
            color = "yellow";
        }else if(percent > 90){
            color = "red";
        }
        


        return {availableSeats, color};
    } catch (error) {
        return {"error":"Error calculating available seats"};
    }
};


const AvailiableSeats = async (req, res) => {
    try {
        const {
            registrationNumber,
            source,
            destination,
            dateOfTravel,
        } = req.body;
        const busInfo = await BusInfo.findOne({ registrationNumber});
        if (!busInfo) {
            return res.json({error:"Invalid Registration Number"});
        }

        const availableSeats = await getAvailableSeats(registrationNumber, source, destination, dateOfTravel);
        return res.status(200).json( availableSeats );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const BookSeats = async (req, res) => {
    try {
        const {
            registrationNumber,
            source,
            destination,
            dateOfTravel,
            ticketCount
        } = req.body;
        
        const busInfo = await BusInfo.findOne({ registrationNumber});
        if (!busInfo) {
            return res.json({error:"Invalid Registration Number"});
        }

        const availableSeats = await getAvailableSeats(registrationNumber, source, destination, dateOfTravel);
        
        const busRoute = await BusRoutes.findOne({
            registrationNumber,
            source,
            destination
        });
        
        if (!busRoute) {
            return {"error":"Invalid Route Details!!!"};
        }


        if (availableSeats < ticketCount) {
            return res.status(400).json({ message: 'Not enough Seats Available' });
        }
        let ticketId = Math.floor(100000 + Math.random() * 900000).toString();
        
        let isUsed = await UserTicket.findOne({ticketId});
        while(isUsed){
            ticketId = Math.floor(100000 + Math.random() * 900000).toString();
            isUsed = await UserTicket.findOne({ticketId});
        }



        const newUserTicket = new UserTicket({
            email: req.body.email,
            registrationNumber,
            source,
            destination,
            startTime: busRoute.startTime,
            endTime: busRoute.endTime,
            ticketCount,
            dateOfTravel,
            ticketId,
        });

        await newUserTicket.save();
        
        return res.status(200).json({ message: 'Tickets booked successfully', ticketId:ticketId});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const GetAllBuses = async (req, res) => {
    try {
        const allBuses = await BusInfo.find();
        res.json(allBuses);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
}
};

const BookedTickets = async (req, res) => {
    const email  = req.body.email;

    if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
    }

    try {
        const userTickets = await UserTicket.find({ email });
        res.json(userTickets);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const CancelTicket = async (req, res) => {
    const { email, ticketId } = req.body;

    if (!email || !ticketId) {
        return res.status(400).json({ error: 'Email and ticketId are required' });
    }

    try {
        // Check if the user exists
        const userExists = await UserInfo.findOne({ email });

        if (!userExists) {
        return res.status(404).json({ error: 'User does not exist' });
        }

        // Check if the ticket with the given ticketId exists
        const ticketExists = await UserTicket.findOne({ email, ticketId });

        if (!ticketExists) {
        return res.status(404).json({ error: 'Invalid ticketId' });
        }

        // Delete the ticket
        await UserTicket.findOneAndDelete({ email, ticketId });

        return res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
  


module.exports = { GetBus, BookSeats , AvailiableSeats, GetAllBuses, BookedTickets, CancelTicket };
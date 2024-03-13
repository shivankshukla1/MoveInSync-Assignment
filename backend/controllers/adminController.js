const BusInfo = require('../models/BusInfo');
const BusRoutes = require('../models/BusRoutes');

const AddBus = async (req, res) => {
    try {
        const {
        busName,
        registrationNumber,
        route,  
        distance,
        time,
        totalSeats,
        daysOfOperation,
        } = req.body;

        const existingBus = await BusInfo.findOne({ registrationNumber });
        // return res.status(400).json({ message: 'Bus with the same registration number already exists' });

        if (existingBus) {
        return res.status(400).json({ message: 'Bus with the same registration number already exists' });
        }
        let n = route.length;
        const newBusInfo = new BusInfo({
        busName,
        registrationNumber,
        totalSeats,
        daysOfOperation,
        startTime:time[0],
        startStop:route[0],
        endTime:time[n - 1],
        endStop:route[n - 1],
        });
        await newBusInfo.save();

        for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const newBusRoute = new BusRoutes({
            registrationNumber,
            source: route[i],
            destination: route[j],
            distance: distance[j] - distance[i],
            startTime: time[i],
            endTime: time[j],
            });
            await newBusRoute.save();
        }
        }

        return res.status(200).json({ message: 'Bus added successfully'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error:error });
    }
};



const UpdateBus = async (req, res) => {
    try {
        const {
        busName,
        route,
        numberOfStops,
        distance,
        time,
        totalSeats,
        daysOfOperation,
        } = req.body;

        let registrationNumber = req.params.registrationNumber;

        // Check if Bus with the registration number exists
        const existingBus = await BusInfo.findOne({ registrationNumber });
        if (!existingBus) {
        return res.status(404).json({ message: 'No buses found with this registration number' });
        }

        // Delete existing entries with the registration number
        await BusInfo.deleteOne({ registrationNumber });
        await BusRoutes.deleteMany({ registrationNumber });

        
        // Add BusInfo
        const newRegistrationNumber = req.body.registrationNumber;
        console.log(newRegistrationNumber, "this is the new  one");
        registrationNumber = req.body.registrationNumber;
        const newBusInfo = new BusInfo({
        busName,
        registrationNumber,
        totalSeats,
        daysOfOperation,
        startTime:time[0],
        startStop:route[0],
        endTime:time[time.length - 1],
        endStop:route[route.lenth - 1],
        });
        await newBusInfo.save();

        // Add BusRoutes
        const n = numberOfStops;
        for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const newBusRoute = new BusRoutes({
            registrationNumber,
            source: route[i],
            destination: route[j],
            distance: distance[j] - distance[i],
            startTime: time[i],
            endTime: time[j],
            });
            await newBusRoute.save();
        }
        }

        return res.status(200).json({ message: 'Bus updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error:error});
    }
};



const DeleteBus = async (req, res) => {
    try {
        
        const registrationNumber = req.params.registrationNumber;

        const existingBus = await BusInfo.findOne({ registrationNumber });
        if (!existingBus) {
        return res.status(404).json({ message: 'No buses found with this registration number' });
        }

        // Delete existing entries with the registration number
        await BusInfo.deleteOne({ registrationNumber });
        await BusRoutes.deleteMany({ registrationNumber });

        return res.status(200).json({ message: 'Deleted Bus successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error:error });
    }
};


module.exports = { AddBus, UpdateBus, DeleteBus };
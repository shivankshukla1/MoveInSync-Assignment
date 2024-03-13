# MoveInSync Assignment [Bus Booking System (backend)]

## Table of Contents

- [MoveInSync Assignment \[Bus Booking System (backend)\]](#moveinsync-assignment-bus-booking-system-backend)
  - [Table of Contents](#table-of-contents)
  - [DB Schema Diagram](#db-schema-diagram)
  - [Manual Installation](#manual-installation)
  - [Commands](#commands)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
    - [API Endpoints](#api-endpoints)



## DB Schema Diagram

![Schema](./screenshots/schema.png)

## Manual Installation

Clone the repo:

```bash
git clone https://github.com/shivankshukla1/MoveInSync-Assignment.git
cd MoveInSync
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
# open .env to modify the environment variables
```


## Commands

Running in development:

```bash
nodemon app.js
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash

# MongoDB URL
MONGO_URL = mongodb+srv://shivank:r86qIG7SRAW3aya3@busbooking.gwnrbl3.mongodb.net/?retryWrites=true&w=majority&appName=BusBooking

# JWT secret token
JWT_SECRET = thisistherealsecreat

#User Name for nodemailer
MAIL_USERNAME = shivankshukla2001@gmail.com

#Password for nodemailer
MAIL_PASSWORD = hnfdnqxewvxzvtee

```

## Project Structure

```

controller\       # Controllers of APIs
middleware\       # Custom express middlewares
models\           # Mongoose models
routes\           # Routes for APIs
screenshots\      # Screenshots for readme
app.js            # Application entry point

```

### API Endpoints

List of available API:

**Auth routes**:

`POST /register` - User Registration\
`POST /login` - User Login\
`POST /adminlogin` - Admin Login\
`POST /userverification` - User Verification\
`POST /forgotpassword` - User Forgot Password\
`POST /updatepassword` - Update User Password

**User routes**:\
`POST /getbusdetails` - Get Bus Details (Requires Authentication)\
`GET /getbusdetails` - Get All Buses\
`GET /bookedtickets` - Get Booked Tickets (Requires Authentication)\
`POST /cancelticket` - Cancel Ticket (Requires Authentication)\
`POST /findseat` - Find Available Seats (Requires Authentication)\
`POST /bookseat` - Book Seats (Requires Authentication)


**Admin routes**:\
`POST /addbus` - Add Bus (Admin Only)\
`POST /updatebus/:registrationNumber` - Update Bus (Admin Only)\
`POST /deletebus/:registrationNumber` - Delete Bus (Admin Only)

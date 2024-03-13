# MoveInSync Assignment [Bus Booking System (backend)]

#### Turtorial Video Link - https://drive.google.com/drive/folders/166BTht6kxv8elEgmRq7U8t31nrmun_f0?usp=sharing

## Table of Contents

- [MoveInSync Assignment \[Bus Booking System (backend)\]](#moveinsync-assignment-bus-booking-system-backend)
      - [Turtorial Video Link - https://drive.google.com/drive/folders/166BTht6kxv8elEgmRq7U8t31nrmun\_f0?usp=sharing](#turtorial-video-link---httpsdrivegooglecomdrivefolders166btht6kxv8elegmrq7u8t31nrmun_f0uspsharing)
  - [Table of Contents](#table-of-contents)
  - [Manual Installation](#manual-installation)
  - [Commands](#commands)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
    - [API Endpoints](#api-endpoints)



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
1. **User Registration (`POST /register`):**
   - **Input Format:**
     ```
     Name: User Name
     Email: user@example.com
     Password: user_password
     ```
   - Creates a new user account with the provided name, email, and password.

2. **User Login (`POST /login`):**
   - **Input Format:**
     ```
     Email: user@example.com
     Password: user_password
     ```
   - Authenticates the user with the provided email and password.

3. **Admin Login (`POST /adminlogin`):**
   - **Input Format:**
     ```
     Email: admin@example.com
     Password: admin_password
     ```
   - Authenticates the admin with the provided email and password.

4. **User Verification (`POST /userverification`):**
   - **Input Format:**
     ```
     Email: user@example.com
     OTP: 123456
     ```
   - Verifies the user by confirming the OTP sent to their email during registration.

5. **Forgot Password (`POST /forgotpassword`):**
   - **Input Format:**
     ```
     Email: user@example.com
     ```
   - Sends an OTP to the user's email for resetting the password.

6. **Update Password (`POST /updatepassword`):**
   - **Input Format:**
     ```
     Email: user@example.com
     OTP: 123456
     New Password: new_user_password
     ```
   - Updates the user's password after successful OTP verification.


**Admin routes**:

1. **Add Bus (`POST /addbus`):**
   - **Admin Only:** Yes
   - **Input Format:**
     ```
     {
       "busName": "Bus Name",
       "registrationNumber": "Bus Registration Number",
       "totalSeats": 40,
       "daysOfOperation": [1, 1, 1, 1, 1, 1, 1],
       "startTime": "08:00 AM",
       "endTime": "10:00 PM"
     }
     ```
   - Adds a new bus to the system with the provided details.

2. **Update Bus (`POST /updatebus/:registrationNumber`):**
   - **Admin Only:** Yes
   - **Input Format:**
     ```
     {
       "busName": "Updated Bus Name",
       "totalSeats": 50,
       "daysOfOperation": [1, 0, 1, 1, 0, 1, 1],
       "startTime": "09:00 AM",
       "endTime": "11:00 PM"
     }
     ```
   - Updates the details of a specific bus identified by its registration number.

3. **Delete Bus (`POST /deletebus/:registrationNumber`):**
   - **Admin Only:** Yes
   - **Input Format:**
     ```
     {
       "confirmation": true
     }
     ```
   - Deletes a specific bus identified by its registration number. Requires confirmation.




**User routes**:

1. **Get Bus Details (`POST /getbusdetails`):**
   - **Authentication Required (`isLoggedIn`):** Yes
   - **Input Format:**
     ```
     {
       "source": "Source City",
       "destination": "Destination City",
       "dateOfTravel": "YYYY-MM-DD"
     }
     ```
   - Retrieves bus details based on the source, destination, and date of travel.

2. **Get All Buses (`GET /getbusdetails`):**
   - **Authentication Required (`isLoggedIn`):** No
   - Retrieves details of all available buses.

3. **Get Booked Tickets (`GET /bookedtickets`):**
   - **Authentication Required (`isLoggedIn`):** Yes
   - **Input Format:**
     ```
     {
       "email": "user@example.com"
     }
     ```
   - Retrieves booked tickets for a specific user.

4. **Cancel Ticket (`POST /cancelticket`):**
   - **Authentication Required (`isLoggedIn`):** Yes
   - **Input Format:**
     ```
     {
       "email": "user@example.com",
       "ticketId": "123456"
     }
     ```
   - Cancels a booked ticket for a specific user.

5. **Find Available Seats (`POST /findseat`):**
   - **Authentication Required (`isLoggedIn`):** Yes
   - **Input Format:**
     ```
     {
       "registrationNumber": "BusRegistrationNumber",
       "source": "Source City",
       "destination": "Destination City",
       "dateOfTravel": "YYYY-MM-DD"
     }
     ```
   - Finds available seats for a specific bus on a given route and date.

6. **Book Seats (`POST /bookseat`):**
   - **Authentication Required (`isLoggedIn`):** Yes
   - **Input Format:**
     ```
     {
       "registrationNumber": "BusRegistrationNumber",
       "source": "Source City",
       "destination": "Destination City",
       "dateOfTravel": "YYYY-MM-DD",
       "ticketCount": 2,
       "email": "user@example.com"
     }
     ```
   - Books seats for a specific bus on a given route and date.
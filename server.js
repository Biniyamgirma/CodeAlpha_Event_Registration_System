const express = require('express');
require('dotenv').config();
// basic import 
const app = express();

//constants
const port_number = process.env.PORT || 3000;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//users router

//auth router //.login //register //logout 
// //password reset 
app.use('/auth',null);

//user management router //get users details //get user by id //update user details 
// //delete user//search user by name //search user by email// serch user by phone number
app.use('/api/users',null)

//organizer management router //get organizer details //get organizer by id //update organizer details
// //delete organizer//search organizer by name// search organizer by contact number
app.use('/api/organizers',null);

//organizers sessions route //get session by id //create session
// //update session //delete session //map session to event
//map session to speaker
/// get sessions by event id
app.use('/api/organizers/sessions',null);

//events router //add events //get event by id //create event
//  //update event //delete event
app.use('/api/organizers/events',null)

// organizers tickets route //get ticket by id //create ticket
// //update ticket //delete ticket
// //get tickets by event id //get tickets by organizers id
app.use('/api/organizers/tickets',null);

//organizers discounts route //get discount by id //create discount
// //update discount //delete discount
// //get discounts by event id //get discounts by organizers id
app.use('/api/organizers/discounts',null);

//event for users route //get all events //get event by id 
//get events by date //get events by location //get events by category
app.use('/api/users/events',null);

//event categories route //get all categories //get category by id // only for admin
// //create category //update category //delete category
app.use('/api/events/categories',null);

//user tickets route //get all tickets //get ticket by id //get tickets by event id
app.use('/api/users/tickets',null);

// payment route //create payment //get payment by id
// //update payment //delete payment //get payments by user id
// //get payments by event id //get payments by ticket id
//pay for ticket
//refund payment
//total amount paid by user specific to event
//total amount paid by user specific to ticket
//total amount paid by user specific to organizer
//total amount paid by user specific to category
app.use('/api/payment',null);


//registration route //register user to event
//get registration by id //get registrations by user id
//get registrations by event id //get registrations by organizer id
app.use('api/registration',null);

//notifications route //get notification by id
//get notifications spacific to user
//get notifications spacific to event
//get notifications spacific to organizer
//get notifications spacific to category
//get notifications spacific to town 
//get notifications spacific to town and category
app.use('/api/notifications',null);

//get sponsors by id // create sponsor
//update sponsor //delete sponsor
//get sponsors by event id
//get sponsors by category id //get sponsors by town id
//get sponsors by event id
app.use('/api/sponsors',null);

//register to a session in an event
//get session by id
//
app.use('/api/users/sessions',null);
//test router
app.use('/test',require('./router/testRoute/testRoute'));




app.listen(port_number,()=>{
    console.log("server is running on port:",port_number);
})
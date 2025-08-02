const { json } = require('body-parser');
const express = require('express');
require('dotenv').config();
const app = express();
const {compare, hashPassword} = require('./password');
const port_number = process.env.PORT || 3000;
const {organizer,customer,ticket,event,eventRegistration} = require('./data');

app.use(json());

app.get('/',(req,res)=>{
    console.log('working...');
    res.end();
})




app.listen(port_number,()=>{
    console.log("server is running on port:",port_number);
})
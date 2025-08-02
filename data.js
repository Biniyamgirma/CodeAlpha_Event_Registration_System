const organizer = [
    {
        name:"Biniam",
        age:22,
        type :'hello',
        contact:"0986",
        password:"123"
    },
    {
       name:"Biniam",
        age:22,
        type:'hello',
        contact:"0978",
        password:"123"
    }
];

const customer = [
    {   id:"1",
        name:"alemu",
        age:12,
        password:"hello",
        contact:"0917"
    },
    {   id:"2",
        name:"akliku",
        age:12,
        password:"1234",
        contact:"0916"
    }
];
const event = [
    {
        event_id:"1",
        event_name:"football event",
        event_desc:" a football event in addis ababa staduim",
        location:"addis ababa",
        event_date:"12/12/2026",
        event_reg_date: new Date().toDateString,
        event_update:"null",
        event_status:"ongoing"
    },
     {
        event_id:"2",
        event_name:"chess tournament event",
        event_desc:" a chess tournament event in addis ababa legahr",
        location:"addis ababa",
        event_date:"12/12/2026",
        event_reg_date: new Date().toDateString,
        event_update:"null",
        event_status:"ongoing"
    }
]
const ticket = [
    {
        ticket_Id:"1",
        event_id:"1",
        ticket_desc:"this ticket is for vip only",
        ticket_type:"normal",
        ticket_price:"10000",
        createdDate: new Date().toDateString,
        updated:"12/13/2025"
    },
    {
        ticket_Id:"2",
        event_id:"2",
        ticket_desc:"this ticket is for vip only",
        ticket_type:"vip",
        ticket_price:"10000",
        createdDate: new Date().toDateString,
        updated:"12/13/2025"
    }
];

const eventRegistration = [
    {
        event_registration_id:"1",
        ticket_id:"2",
        name:"1",
        payment_status:"paid",
        number:"0"

    }
]

module.exports = {
    customer,
    organizer,
    eventRegistration,
    event,
    ticket
};
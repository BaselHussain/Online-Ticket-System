#! /usr/bin/env node
import inquirer from "inquirer";

class User{
    currentUserId=1;
id:number;
name:string;
email:string;
password:string;
isAdmin:boolean
constructor(name:string,email:string,password:string,isAdmin:boolean){
    this.id=this.currentUserId++;
    this.name=name;
    this.email=email;
    this.password=password;
    this.isAdmin=isAdmin
}
} 
class Event{
    currentEventId=1;
    id:number;
    title:string;
    date:Date;
    ticketStock:number;
    ticketPrice:number
    city:string;
    constructor(title:string,date:Date,ticketStock:number,city:string,ticketPrice:number){
        this.id=this.currentEventId++;
        this.title=title;
        this.date=new Date(date);
        this.city=city;
        this.ticketStock=ticketStock
        this.ticketPrice=ticketPrice
    }
}
class Ticket {
     currentTicketId = 1;
    id: number;
    eventId: number;
    userId: number;
    quantity: number;

    constructor(eventId: number, userId: number, quantity: number) {
        this.id = this.currentTicketId++;
        this.eventId = eventId;
        this.userId = userId;
        this.quantity = quantity;
    }
}
class onlineTicketSystem{
 private user:User[]=[];
 private events:Event[]=[];
 private tickets:Ticket[]=[];
 private loggedInUser:User|null=null
 private adminCredentials = { email: 'baselhussain4@gmail.com', password: 'basel' };
 async start() {
    console.log("Welcome to the Online Ticketing System!");
    while (true) {
        if (this.loggedInUser) {
            if (this.loggedInUser.isAdmin) {
                await this.adminMenu();
            } else {
                await this.userMenu();
            }
        } else {
            await this.mainMenu();
        }
    }
}
private async mainMenu(){
    const question=await inquirer.prompt([{
        name:"action",
        type:"list",
        message:"Choose an action",
        choices:["Sign Up","Login","Exit"]
    }])
    if(question.action==="Sign Up"){
        await this.signUp()
    }
    else if ( question.action=== 'Login') {
        await this.login();
    } else {
        process.exit();
    }
}
async signUp() {
    const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const userDetails = await inquirer.prompt([{
        name: "name",
        type: "input",
        message: "Please enter your name"
    }, {
        name: "email",
        type: "input",
        message: "Please enter your email",
        validate: (input) => {
            if (emailValidationRegex.test(input)) {
                return true;
            } else {
                return 'Please enter a valid email address';
            }
        
    }
    }, {
        name: "password",
        type: "password",
        message: "Please enter your password"
    }]);
    if (userDetails.email === this.adminCredentials.email) {
        console.log(`The email provided is associated with an admin account. Please log in instead.`);
        return;
    }
else{
    const existingUser=this.user.find(user=>user.email===userDetails.email)
    if(existingUser){
        console.log(`User with this email already exist please LogiIn instead`);
    }
else{const newUser = new User(userDetails.name, userDetails.email, userDetails.password, userDetails.admin);
    this.user.push(newUser);
    console.log(`User created: ${userDetails.name}`);
}
}
}
async login(){
    const loginDetails=await inquirer.prompt([{
        name:"email",
        type:"input",
        message:"Please enter your email"
    },{
        name:"password",
        type:"password",
        message:"Please enter your password"
    }])
    if (loginDetails.email === this.adminCredentials.email && loginDetails.password === this.adminCredentials.password) {
            this.loggedInUser = new User('Admin', loginDetails.email, loginDetails.password, true);
            console.log("Admin logged in successfully!");
        }
    else{const user=this.user.find(user=>user.email===loginDetails.email && user.password===loginDetails.password)
    if(user){
        this.loggedInUser=user
        console.log(`Welcome back! ${user.name}`);
    }else {
        console.log('Invalid credentials. Please try again.');
    } 
}
}
async adminMenu() {
    const question = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Choose an action',
        choices: ['Create Event', 'View Events',"Delete an Event", "Edit Event",'Logout']
    });
    if(question.action==="Create Event"){
        await this.createEvent()
    }else if(question.action==="View Events"){
        if(this.events.length===0){
            console.log(`No Events Available right now`);    
        }else{
            await this.viewEvent()
        }
    }else if(question.action==="Delete an Event"){
        if(this.events.length===0){
            console.log(`No Events to delete right now`);    
        }else{
            await this.deleteEvent()
        }
    }else if(question.action==="Edit Event"){
if(this.events.length===0){
            console.log(`No Events to delete right now`);    
        }else{
            await this.editEvent()
        }
    }
    else{
         this.loggedInUser=null
    }
}
async userMenu(){
const question=await inquirer.prompt([{
    name:"action",
    type:"list",
    message:"Choose an action",
    choices:["View my ticket","Buy a ticket","Cancel ticket","Logout"]
}])
if(question.action==="View my ticket"){
    await this.viewMyTicket()
}else if(question.action==="Buy a ticket"){
    await this.buyTicket()
}else if(question.action==="Cancel ticket"){
    await this.cancelTicket()
}
else{
    this.loggedInUser=null
}
}
async createEvent() {
    const dateTimeFormat = 'YYYY-MM-DDTHH:mm';
    const currentYear = new Date().getFullYear();

    const eventDetails = await inquirer.prompt([{
        name: "title",
        type: "input",
        message: "What is the title of the event?"
    }, {
        name: "date",
        type: "input",
        message: `What is the date and time of the event? (format: ${dateTimeFormat})`,
        validate: (input) => {
            const eventDate = new Date(input);
            const now = new Date();

            if (isNaN(eventDate.getTime())) {
                return `Please enter a valid date and time in the format: ${dateTimeFormat}`;
            }
            if (eventDate.getFullYear() !== currentYear) {
                return `The event date must be within the current year: ${currentYear}`;
            }
            if (eventDate < now) {
                return `The event date must be in the future.`;
            }
            return true;
        }
    }, {
        name: "city",
        type: "input",
        message: "Enter the city of the event"
    }, {
        name: "ticketStock",
        type: "input",
        message: "How many tickets are available?",
        validate: (input) => {
            const value = parseInt(input);
            if (isNaN(value) || value <= 0) {
                return 'Please enter a valid number greater than zero';
            }
            return true;
        }
    }, {
        name: "ticketCost",
        type: "input",
        message: "What is the cost of a ticket?",
        validate: (input) => {
            const value = parseFloat(input);
            if (isNaN(value) || value <= 0) {
                return 'Please enter a valid cost greater than zero';
            }
            return true;
        }
    }]);

    const newEvent = new Event(eventDetails.title, new Date(eventDetails.date), parseInt(eventDetails.ticketStock), eventDetails.city, parseFloat(eventDetails.ticketCost));
    this.events.push(newEvent);
    console.log(`Event created: ${newEvent.title}`);
}
async viewEvent() {
    const now = new Date();
    const upcomingEvents = this.events.filter(event => event.date > now);

    if (upcomingEvents.length === 0) {
        console.log(`No upcoming events available right now.`);
    } else {
        console.log(upcomingEvents);
    }
}
async deleteEvent(){
    const deleteEvent=await inquirer.prompt([{
        name:"delete",
        type:"list",
        message:"Which event you want to delete?",
        choices:this.events.map((event) => ({ name: event.title, value: event.id}))
    //({ name: event.title, value: event.id }): For each event, it creates an object with:
// name: event.title: The title of the event, which will be displayed in the list for the user to see.
// value: event.id: The id of the event, which will be returned when the user selects an event.
    }]);
    const indexFind=this.events.findIndex(event=>event.id===deleteEvent.delete)
    if (indexFind !== -1) {
        const deletedEvent = this.events.splice(indexFind, 1)[0];
        console.log(`${deletedEvent.title} Event has been deleted`);
    } else {
        console.log('Event not found');
    }
    
}
async editEvent() {
    const selectedEvent = await inquirer.prompt({
        type: 'list',
        name: 'eventId',
        message: 'Select an event to edit:',
        choices: this.events.map(event => ({ name: event.title, value: event.id }))
    });

    const event = this.events.find(event => event.id === selectedEvent.eventId);
    if (!event) {
        console.log('Event not found.');
        return;
    }

    const editOptions = await inquirer.prompt([{
        type: 'checkbox',
        name: 'options',
        message: 'Select options to edit:',
        choices: [
            { name: 'Title', value: 'title' },
            { name: 'Date', value: 'date' },
            { name: 'City', value: 'city' },
            { name: 'Ticket Stock', value: 'ticketStock' },
            { name: 'Ticket Price', value: 'ticketPrice' }
        ]
    }]);

    if (editOptions.options.length === 0) {
        console.log('No options selected for editing.');
        return;
    }

    const newData: any = {};
    for (const option of editOptions.options) {
        switch (option) {
            case 'title':
                newData.title = (await inquirer.prompt({ type: 'input', name: 'title', message: 'Enter new title:', default: event.title })).title;
                break;
            case 'date':
                newData.date = (await inquirer.prompt({ type: 'input', name: 'date', message: 'Enter new date and time (YYYY-MM-DDTHH:mm):', default: event.date.toISOString() })).date;
                break;
            case 'city':
                newData.city = (await inquirer.prompt({ type: 'input', name: 'city', message: 'Enter new city:', default: event.city })).city;
                break;
            case 'ticketStock':
                newData.ticketStock = (await inquirer.prompt({ type: 'input', name: 'ticketStock', message: 'Enter new ticket stock:', default: event.ticketStock })).ticketStock;
                break;
            case 'ticketPrice':
                newData.ticketPrice = (await inquirer.prompt({ type: 'input', name: 'ticketPrice', message: 'Enter new ticket price:', default: event.ticketPrice })).ticketPrice;
                break;
        }
    }

    Object.assign(event, newData);
    console.log('Event updated successfully.');
}
async buyTicket(){
    if(this.events.length===0){
        console.log(`Sorry there are not events scheduled`)
    }else{
    const eventSelection=await inquirer.prompt([{
        name:"eventId",
        type:"list",
        message:"For which event you want to buy tickets?",
        choices:this.events.map(event=>({
            name: `${event.title} - ${event.city} on ${event.date} price of ticket:${event.ticketPrice}`,
            value: event.id
        }))
    },{
        name: 'paymentMethod',
        type: 'list',
        message: 'Select a payment method',
        choices: ['Credit Card', 'PayPal', 'Bank Transfer']
    }]);
    let paymentInfo;
            if (eventSelection.paymentMethod === 'Credit Card') {
                paymentInfo = await inquirer.prompt([{
                    name: 'cardNumber',
                    type: 'input',
                    message: 'Enter your credit card number'
                }, {
                    name: 'expiryDate',
                    type: 'input',
                    message: 'Enter your credit card expiry date (MM/YY)'
                }, {
                    name: 'cvv',
                    type: 'input',
                    message: 'Enter your CVV'
                }]);
            } else if (eventSelection.paymentMethod === 'PayPal') {
                paymentInfo = await inquirer.prompt([{
                    name: 'email',
                    type: 'input',
                    message: 'Enter your PayPal email'
                }]);
            } else if (eventSelection.paymentMethod === 'Bank Transfer') {
                paymentInfo = await inquirer.prompt([{
                    name: 'accountNumber',
                    type: 'input',
                    message: 'Enter your bank account number'
                }, {
                    name: 'routingNumber',
                    type: 'input',
                    message: 'Enter your bank routing number'
                }]);
            }
    const ticketDetails=await inquirer.prompt([{
           type: 'input',
            name: 'quantity',
            message: 'Enter number of tickets'
    }]);
    
const event=this.events.find(event=>event.id===eventSelection.eventId)

if (event) {
    const totalCost = event.ticketPrice * Number(ticketDetails.quantity);
    if (event.ticketStock >= Number(ticketDetails.quantity)) {
        event.ticketStock -= Number(ticketDetails.quantity);
        const newTicket = new Ticket(eventSelection.eventId, this.loggedInUser!.id, Number(ticketDetails.quantity));
        this.tickets.push(newTicket);
        console.log(`Purchased ${newTicket.quantity} tickets for ${event.title}. Total cost: $${totalCost}. Payment method: ${eventSelection.paymentMethod}`);
    } else {
        console.log("Insufficient tickets");
    }
} else {
    console.log("Event not found");
}
}
}

async viewMyTicket(){
    if(this.tickets.length===0){
        console.log(`You don't have any ticket purchased.\nPlease first purchase any ticket for an event`)
    }else{
    const userTickets=this.tickets.filter(ticket=>ticket.userId===this.loggedInUser!.id)
    console.log('Your tickets:');
    userTickets.forEach(ticket => {
        const event = this.events.find(event => event.id === ticket.eventId);
        console.log(`Event: ${event?.title}, Quantity: ${ticket.quantity}`);
    });
}
}

async cancelTicket() {
    // Filter out tickets that belong to the currently logged-in user.
    const userTickets = this.tickets.filter(ticket => ticket.userId === this.loggedInUser!.id);
// If the user has no tickets, inform them and return.
    if (userTickets.length === 0) {
        console.log('You have no tickets to cancel.');
        return;
    }
  // Prompt the user to select an event for which they want to cancel tickets.
    const eventSelection = await inquirer.prompt([{
        name: 'eventId',
        type: 'list',
        message: 'Select the event for which you want to cancel tickets:',
        choices: userTickets.map(ticket => {
            // Find the event corresponding to each ticket.
            const event = this.events.find(event => event.id === ticket.eventId);
            // Return an object with event information to be displayed in the prompt.
            return {
                name: `${event!.title} - ${event!.city} on ${new Date(event!.date).toDateString()}`, // Ensure date is properly formatted
                value: event!.id
            };
        })
    }]);
// Find the user's tickets for the selected event.
    const userEventTickets = userTickets.find(ticket => ticket.eventId === eventSelection.eventId);
// If the user has tickets for the selected event.
    if (userEventTickets) {
        // Prompt the user to enter the number of tickets they want to cancel.
        const cancelQuantity = await inquirer.prompt([{
            name: 'quantity',
            type: 'input',
            message: `You have ${userEventTickets.quantity} ticket(s). How many do you want to cancel?`,
             // Validate that the entered quantity is a positive integer and does not exceed the number of tickets they have.
            validate: (value) => {
                const valid = !isNaN(parseFloat(value)) && Number.isInteger(parseFloat(value)) && Number(value) > 0 && Number(value) <= userEventTickets.quantity;
                return valid || 'Please enter a valid number of tickets';
            }
        }]);
// Find the event corresponding to the selected event ID.
        const event = this.events.find(event => event.id === eventSelection.eventId);
        // Convert the entered quantity to a number.
        const cancelCount = Number(cancelQuantity.quantity);
// If the event and the user's tickets for the event are found.
        if (event && userEventTickets) {
            // Reduce the number of tickets the user has for the event.
            userEventTickets.quantity -= cancelCount;
            // Increase the ticket stock for the event.
            event.ticketStock += cancelCount;
            // Inform the user that the tickets have been canceled.
            console.log(`Cancelled ${cancelCount} ticket(s) for ${event.title}.`);
 // If the user has canceled all their tickets for the event, remove the ticket entry.
            if (userEventTickets.quantity === 0) {
            //This code  checks if the user's tickets for the selected event have reached a quantity of 0. If so, it removes the user's ticket entry for that event from the this.tickets array. The filter method is used to create a new array that excludes the ticket with the specified id, thus updating the tickets array to no longer include the entry with zero quantity.
                this.tickets = this.tickets.filter(ticket => ticket.id !== userEventTickets!.id);
            }
        }
    }
}
}
const system = new onlineTicketSystem();
system.start();
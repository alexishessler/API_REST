// ********************
// *                  *
// *      SETUP       *
// *                  *
// ********************

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(3000, () => console.log(`Listening on port ${port}`));

// const requestIp = require('request-ip');
//
// const ipMiddleware = function(req, res, next) {
//     const clientIp = requestIp.getClientIp(req);
//     next();
// };
//
// app.use(requestIp.mw())










// ********************
// *                  *
// *  IDENTIFICATION  *
// *                  *
// ********************

var session = require('express-session')

app.use(session({
  secret: 'super secret API',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

var userCookie;

// var userIp;

var crypto = require('crypto');

var generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

var generate_ip = function(){
  var newip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)+"."+(Math.floor(Math.random() * 255) + 0)
  return newip;
};










// ********************
// *                  *
// *     EVENTS_DB    *
// *                  *
// ********************

const welcomeMessage = {
  Title: 'APIevents: your webservice to handle tons of events worldwide.',
  Instructions: {
    eventsList: 'GET | /api/events',
    eventCreation: 'POST | /api/events',
    eventDetails: 'GET | /api/events/<eventid>',
    eventDelete: 'DELETE | /api/events/<eventid>',
    eventsDashboard: 'GET| /api/dashboard',
  }
}


let eventsData = [];

// TYPE 1 EVENTS
for (var i = 0; i < 20; i++) {
  eventsData.push({
    name: 'Sortie au cinéma',
    id: generate_key(),
    referer: `http://www.${i}-eventwebsite.com`,
    ip: generate_ip(),
    createdAt: new Date(),
  })
}

// TYPE 2 EVENTS
for (var i = 20; i < 40; i++) {
  eventsData.push({
    name: 'Concert de musique',
    id: generate_key(),
    referer: `http://www.${i}-eventwebsite.com`,
    ip: generate_ip(),
    createdAt: new Date(),
  })
}

// TYPE 3 EVENTS
for (var i = 40; i < 60; i++) {
  eventsData.push({
    name: 'Street Art & Walk around',
    id: generate_key(),
    referer: `http://www.${i}-eventwebsite.com`,
    ip: generate_ip(),
    createdAt: new Date(),
  })
}

// TYPE 4 EVENTS
for (var i = 60; i < 80; i++) {
  eventsData.push({
    name: 'Coding courses',
    id: generate_key(),
    referer: `http://www.${i}-eventwebsite.com`,
    ip: generate_ip(),
    createdAt: new Date(),
  })
}

// TYPE 5 EVENTS
for (var i = 80; i < 100; i++) {
  eventsData.push({
    name: 'Trips & Languages',
    id: generate_key(),
    referer: `http://www.${i}-eventwebsite.com`,
    ip: generate_ip(),
    createdAt: new Date(),
  })
}










// ********************
// *                  *
// *      ROUTERS     *
// *                  *
// ********************

app.get('/', (req, res) => {
// Redirects the user to the api landing page
  res.redirect('/api');
});


app.get('/api', (req, res) => {
// Check if the user exists and has been saved
  if(userCookie != undefined){
    res.json(welcomeMessage);

  } else {
    // Handle user IP remote address
    // const ip = req.clientIp;
    // console.log(ip)

    // Handle user cookie id
    req.session.cookieId = generate_key();
    userCookie = req.session.cookieId;
    console.log(req.session)
    res.json(welcomeMessage);
  }
});


app.get('/api/events', (req, res) => {
// Check if the user exists and has been saved
  if(userCookie == undefined){
    res.redirect(200, '/api');
  } else {
    // lists all the events
    res.json({eventsData});
  }
});


app.get('/api/events/:id', (req, res) => {
// Check if the user exists and has been saved
  if(userCookie == undefined){
    res.redirect(200, '/api');
  } else {
    // Look for such an event
    const event = eventsData.find(e => e.id === req.params.id)
    if(!event){
      // if there is no event with the ID, send a 404 error
      res.status(404).send('The event with the given ID was not found')
      return;
    } else {
      // Show the requested event
      res.json({event});
    }
  }
});


app.post('/api/events', (req, res) => {
// Check if the user exists and has been saved
  if(userCookie == undefined){
    res.redirect(200, '/api');
  } else {
    // The event name input must be a 5 char string
    const schema = {
      name: Joi.string().min(5).required(),
      referer: Joi.string().uri().required()
    };

    const result = Joi.validate(req.body, schema);

    // Sends the appropriate error to the user
    if(result.error){
      res.status(404).send(result.error.details[0].message)
      // return ;
    } else {
      // store the data related to the post event in event
      const event = {
        id: userCookie,
        name: req.body.name,
        referer: req.body.referer,
        ip: generate_ip(),
        createdAt: new Date()
      };
      // push the new event into our fictive "database"
      eventsData.push(event)
      res.json({event});
    }
  }
});


app.delete('/api/events/:id', (req, res) => {
// Check if the user exists and has been saved
  if(userCookie == undefined){
    res.redirect(200, '/api');
  } else {
    // Look for such an event
    const event = eventsData.find(e => e.id === req.params.id)
    // If the event does not exist, it can't be deleted and an error is sent
    if(!event){
      res.status(404).send('The event with the given ID was not found')
      return;
    } else {
      // If all is good, the event is being spliced from our fictive "database"
      const index = eventsData.indexOf(event);
      eventsData.splice(eventsData, 1);
      res.json({event});
    }
  }
});


app.get('/api/dashboard', (req, res) => {
  if(userCookie == undefined){
    res.redirect(200, '/api');
  } else {
    // a new object that must store the events name and their occurences is set
    var eventsByName = {};
    // a new object that must store the events date and their occurences is set
    var eventsByTime = {};
    // we need to look up over our fictive data base to set the dashboard
    for (var i = 0; i < eventsData.length; i++) {
      // we set our new array ready and calculate the names occurences
      if (!eventsByName[eventsData[i].name]) {
        eventsByName[eventsData[i].name] = 0;
      }
      eventsByName[eventsData[i].name]++;
      // we intiate a new date without taking the seconds into account
      let date = new Date(eventsData[i].createdAt);
      let timeMinute = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'-'+date.getHours()+'-'+date.getMinutes();
      // we set our new array ready and calculate the time occurences
      // it will actually return 100 before the first post, since the events are all created the [TODAY]
      if (!eventsByTime[timeMinute]) {
        eventsByTime[timeMinute] = 0;
      }
      eventsByTime[timeMinute]++;
    }
    res.json(
      {
        eventsByName,
        eventsByTime
      }
    );
  }
});

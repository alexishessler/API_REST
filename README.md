# Welcome to the project API_REST


## Project purpose
The purpose of this project was to create a fictive REST API in order to simulate the rendering of social events worldwide. The targeted events are shaped into categories such as Trips & Language, Coding Courses, Street Art & Walk around, etc.


## Tech stack
The project was built using NodeJS with the framework Express.
There is no database connexion but it could be easily implemented throughout the routers.
The data is sent in JSON format.


## How to use
**Instructions to launch and test the project:**

```
git clone https://github.com/alexishessler/API_REST.git
cd API_REST
npm install
npm start
```

**To reach the following routers, you can use both your Internet browser or a tool such as *Postman*:**
-	eventsList: 'GET | `/api/events`
-	eventDetails: 'GET | `/api/events/<eventid>`
-	eventsDashboard: 'GET| `/api/dashboard`

In the case you were to use *Chrome*, I would advise you to use a JSON visualisation tool such as *JsonView* | [Resources](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc)

**To reach the following routers, you need to use a tool such as *Postman*:**
-	eventCreation: 'POST | `/api/events`
> In *Postman*, to post a new event, you will need to select `Body > Raw` and enable `JSON (application/json)`. Then, you will have to pass an object containing two elements. See the exemple below:
```
{
	"name": "XXXXXXX",
	"referer": "https://www.XXXXXX.com"
}
```
OR
```
{
	"name": "Music jam",
	"referer": "https://www.jamsessionsaresocool.com"
}
```
-	eventDelete: 'POST | `/api/events/<eventid>`

You can both locally download *Postman* or use it as a browser extension | [Resources](https://www.getpostman.com)



## Nota Bene
If you were to use the REST API for the first time after launching the project with `npm start`, and to access any routers, you will need to access the route `/api` to create a user session. You will be automatically redirected otherwise. Enjoy!

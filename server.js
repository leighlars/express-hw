// import {nanoid} from 'nanoid'

const express = require('express');
const { response } = require('express');
const app = express()

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Hiking Trails';

app.use(express.json());

app.get('/', (request, response) => {
  response.send("Let's go hiking!")
})

app.listen(app.get('port'), () => {
  console.log(`Howdy! Get trail data and go hiking. ${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})


app.locals.trails = [
  { name: 'Ice & Island Lakes (Combo)', location: "Silverton", difficulty: 'Hard', id: '1', distance: '8mi RT' },
  { name: 'Blue Lakes', location: "Ridgeway", difficulty: 'Hard', id: '2', distance: '10mi RT' },
  { name: 'Warner Point', location: "Black Canyon of the Gunninson NP", difficulty: 'Easy', id: '3', distance: '1.5mi RT' }
]

app.get('/api/v1/trails', (request, response) => {
  const trails = app.locals.trails
  response.status(200).json({ trails })
})

app.get('/api/v1/trails/:id', (request, response) => {
  const id = request.params.id
  const trail = app.locals.trails.find(trail => trail.id === id)
  if (!trail) {
    return response.sendStatus(404)
  }
  response.status(200).json(trail)
})

app.post('/api/v1/trails', (request, response) => {
  const id = Date.now();
  const {name, location, difficulty, distance} = request.body;

  for (let requiredParameter of ['name', 'location', 'difficulty', 'distance']) {
    if (!{ name, location, difficulty, distance }[requiredParameter]) {
     return response.status(422).send({
      error: `Expected format: {name: <String>, location: <String>, difficulty: <String>, distance: <String> } 
      You're missing a "${requiredParameter}" property.`,
     });
    }
  }

  app.locals.trails.push({ id, name, location, difficulty, distance })
  response.status(200).json({ id, name, location, difficulty, distance })
})


// not working
app.delete('/api/v1/trails', (request, response) => {
  const id = request.params.id
  const trails = app.locals.trails
  if (!id) {
    return response.status(404).send({
      error: `Trail entry with id "${Number(id)}" not found.`
    })
  } 

  trails = app.locals.trails.trails(trail => trail.id !== id)
  response.status(200).json({trails});
})

app.patch('/api/v1/trails', (request, response) => {
    const id = request.params.id;
    const foundTrail = app.locals.trails.find(trail => trail.id === id)

})



const express = require('express');
const { response } = require('express');
const app = express()

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Trails';

app.use(express.json());

app.get('/', (request, response) => {
  response.send("Let's go hiking!")
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})


app.locals.trails = [
  { name: 'Ice & Island Lakes (Combo)', location: "Silverton", difficulty: 'Hard', id: '1', distance: '8mi RT' },
  { name: 'Blue Lakes', location: "Ridgeway", difficulty: 'Hard', id: '2', distance: '10mi RT' },
  { name: 'Warner Point', location: "Black Canyon of the Gunninson NP", difficulty: 'Easy', id: '3', distance: '1.5mi RT' }
]

app.get('/api/v1/trails', (request, response) => {
  const trails = app.locals.trails
  response.json({ trails }).send(trails)
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
  const trail = request.body;

  for (let requiredParameter of ['name', 'location', 'difficulty', 'distance']) {
    if (!trail[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: {name: <String>, location: <String>, difficulty: <String>, distance: <String> } 
      You're missing a "${requiredParameter}" property.`
        });
    }
  }

  app.locals.trails.push({ id, name, location, difficulty, distance })
  response.status(201).json({ id, name, location, difficulty, distance })
})
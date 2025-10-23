const express = require('express');
const app = express();

// parse JSON body for POST
app.use(express.json());

// ----- Hardcoded data (for 3.1) -----
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

/**
 * 3.1: GET all persons
 * Response: JSON array
 */
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

/**
 * 3.2: GET /info
 * Response: HTML with count + date
 */
app.get('/info', (req, res) => {
  const count = persons.length;
  const time = new Date();
  res.send(`
    <p>Phonebook has information for ${count} people</p>
    <p>${time}</p>
  `);
});

/**
 * 3.3: GET person by id
 * - If not found: 404
 */
app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id);
  if (!person) return res.status(404).end();
  res.json(person);
});

/**
 * 3.4: DELETE by id
 * - Respond 204 No Content
 */
app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id);
  res.status(204).end();
});

/**
 * 3.5 + 3.6: POST new person
 * - Require name & number (400 if missing)
 * - Require unique name (409 conflict if duplicate)
 * - Create random id and return 201 with new resource
 */
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  // 3.6: validations
  if (!name || !number) {
    return res.status(400).json({ error: 'name and number are required' });
  }
  const exists = persons.some(p => p.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'name must be unique' });
  }

  // 3.5: generate id (simple)
  const id = String(Math.floor(Math.random() * 1e9));

  const newPerson = { id, name, number };
  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


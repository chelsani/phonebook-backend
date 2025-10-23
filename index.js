const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// API routes
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get('/api/persons', (req, res) => res.json(persons));

app.get('/info', (req, res) => {
  const count = persons.length;
  const time = new Date();
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id);
  if (!person) return res.status(404).end();
  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) return res.status(400).json({ error: 'name and number are required' });
  if (persons.some(p => p.name.toLowerCase() === name.toLowerCase()))
    return res.status(409).json({ error: 'name must be unique' });
  const id = String(Math.floor(Math.random() * 1e9));
  persons = persons.concat({ id, name, number });
  res.status(201).json({ id, name, number });
});

// Serve React build (already included above)
app.use(express.static('dist'));

// Catch-all: anything not starting with /api should serve index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // let API routes handle it or return 404
  }
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});


// Start server (Render uses PORT env) 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const app = express();
let morgan = require("morgan");
const cors = require("cors");

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Filip Arina",
    number: "222-555-333-666",
  },
];
let amountOfPeople = persons.length + 1;
let now = new Date();

morgan.token("type", function (req, res) {
  let stringPersons = JSON.stringify(persons);
  console.log("RECEIVED INFO: ", stringPersons, " |||||");
});

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`It's alive ${PORT}`);
});

app.get("/api/persons", (req, res) => {
  res.status(200).send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.status(200).send(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    number: body.number,
    name: body.name,
    date: now,
    id: generateId(),
  };

  persons = persons.concat(person);

  res.json(person);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${amountOfPeople} people</p> 
    <p>${now}<p>
    `
  );
});

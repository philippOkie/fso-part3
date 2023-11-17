const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

morgan.token("type", function (req, res) {
  let stringPersons = JSON.stringify();
  console.log("RECEIVED INFO: ", stringPersons, " |||||");
});

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

let persons = [];

let amountOfPeople = persons.length + 1;
let now = new Date();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (req, res) => {
  // res.status(200).send(persons);
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  // const id = Number(req.params.id);
  // const // person = persons.find((person) => person.id === id);

  // if (person) {
  //   res.status(200).send(person);
  // } else {
  //   res.status(404).end();
  // }

  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

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

  const person = new Person({
    number: body.number,
    name: body.name,
    date: now,
  });

  // persons = persons.concat(person);
  // res.json(person);
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${amountOfPeople} people</p> 
    <p>${now}<p>
    `
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT; // || 8080;
app.listen(PORT, () => {
  console.log(`It's alive ${PORT}`);
});

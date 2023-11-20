const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const { get } = require("mongoose");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use("/assets", express.static(path.join("dist", "assets")));

app.use(morgan("combined"));

let persons = [];
let now = new Date();

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
    amountOfPeople = persons.length;
    console.log(amountOfPeople);
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    number: body.number,
    name: body.name,
    date: now,
  });

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
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
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    const amountOfPeople = persons.length;
    console.log("amount of people: ", amountOfPeople);
    res.send(
      `
    <p>Phonebook has info for ${amountOfPeople} people</p> 
    <p>${now}<p>
    `
    );
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  console.log(req.params.id);
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.json({ message: "Person deleted successfully" });
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT; // || 8080;
app.listen(PORT, () => {
  console.log(`It's alive ${PORT}`);
});

const mongoose = require("mongoose");

if (process.argv.length < 2) {
  console.log(
    "prompt must look like this 'node mongo.js yourpassword yourname yournumber"
  );
  process.exit(1);
} else if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length === 3) {
  console.log(
    "YOU NEED TO SPECIFY THE PERSON FOR EX. 'node mongo.js yourpassword ANNA 040-1234556'"
  );
  process.exit(1);
} else if (process.argv.length === 4) {
  console.log(
    "YOU NEED TO SPECIFY THE PERSON'S NAME FOR EX. 'node mongo.js yourpassword ANNA 040-1234556'"
  );
  process.exit(1);
} else if (process.argv.length > 5) {
  console.log(
    "prompt must contain only 5 arguments (if the name contains whitespace characters, it must be enclosed in quotes: node mongo.js yourpassword 'Arto Vihavainen' 045-1232456 )"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

// person.save().then((result) => {
//   console.log(
//     `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
//   );
//   mongoose.connection.close();
// });

Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(person.name, person.number);
  });
  mongoose.connection.close();
});

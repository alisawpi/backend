const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Missing arguments')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]
const dbname = 'phonebook'

const url =
    `mongodb+srv://db_user1:${password}@cluster0.9cugm.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    phoneNumber: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    id: Math.round(Math.random() * (1000 - 10) + 10), //range (1000,10), first 10 ids reserved for manual insertion during testing
    name: newName,
    phoneNumber: newNumber
})

if (newName !== undefined && newNumber !== undefined) {
    person.save()
    .then(response => {
        console.log(`added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()})
    .catch(err => console.log(err))
   
} else {
    Person.find({}).then(result => {
    result.forEach(p => {
        console.log(p)
    })
    mongoose.connection.close()
    
})}
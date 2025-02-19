require('dotenv').config();
const mongoose = require('mongoose')




const url = process.env.MONGODB_URI
console.log('connecting to', url)

const phoneValidator = (number) => {
  const regex = /^\d{2,3}-\d{5,}$/;
  return regex.test(number);
};

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: phoneValidator,
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  });

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
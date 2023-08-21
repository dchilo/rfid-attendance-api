import mongoose from 'mongoose'

mongoose.connect('mongodb://127.0.0.1/rfiddb')
    .then(db => console.log('DB is connected'))
    .catch(error => console.log(error))
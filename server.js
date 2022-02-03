const express = require('express');
const app = express();
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const MongoClient = require('mongodb').MongoClient;

let db;

const mongodbUser = 'bogdan';
const mongodbPassword = '0209Citizen';
const mongodbDatabase = 'store';

MongoClient.connect('mongodb+srv://' + mongodbUser + ':' + mongodbPassword + '@store.8x5cl.mongodb.net/', (error, client) => {
    db = client.db(mongodbDatabase)
})

app.param('collectionName', (request, response, next, collectionName) => {
    request.collection = db.collection(collectionName)
    return next()
})

app.use(function (request, response, next) {
    console.log('Request IP: ' + request.url)
    console.log('Request date: ' + new Date())
    next()
})

app.use(express.static('public'))

app.get('/', (request, response, next) => {
    response.send('Welcome to express server!')
})

app.get('/collection/:collectionName', (request, response, next) => {
    request.collection.find({}).toArray((error, results) => {
        if (error) return next(error)
        response.send(results)
    })
})

app.post('/collection/:collectionName', (request, response, next) => {
    request.collection.insert(request.body, (error, results) => {
        if (error) return next(error)
        response.send(results)
    })
})

app.put('/collection/:collectionName/:id', (request, response, next) => {
    request.collection.update(
        { _id: new ObjectID(request.params.id) },
        { $set: request.body },
        { safe: true, multi: false },
        (error, result) => {
            if (error) return next(error)
            response.send(result.acknowledged == true ? {msg: 'success'} : {msg: 'error'})
        })
})
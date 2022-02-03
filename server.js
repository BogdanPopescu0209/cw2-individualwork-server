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
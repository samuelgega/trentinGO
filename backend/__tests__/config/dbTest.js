const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodb;

//Avvia il server MongoDB in memoria e connette Mongoose
const connect = async () => {
    mongodb = await MongoMemoryServer.create();
    const uri = mongodb.getUri();
    await mongoose.connect(uri);
};

//Disconnette Mongoose e spegne il server in memoria
const closeDatabase = async () => {
    await mongoose.disconnect();
    if (mongodb) {
        await mongodb.stop();
    }
};

//Svuota tutte le collezioni (utile per ripulire il DB tra un test e l'altro)
const clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

module.exports = { connect, closeDatabase, clearDatabase };
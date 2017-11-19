const MongoClient = require('mongodb').MongoClient;

module.exports = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.DB_URL, (err, database) => {
            if (err) reject(err);
            else resolve(database);
        });
    })
};
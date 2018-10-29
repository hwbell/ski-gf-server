
const { MongoClient, ObjectID } = require('mongodb');

const getData = (type, dbCollection, callback) => {
  MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
    if (err) {
      console.log('Unable to connect to MongoDb server')
    }

    const db = client.db(dbCollection); // different from video for V3
    console.log('Connected to MongoDB server');

    db.collection(dbCollection).find({ type }).toArray().then((docs) => {
      console.log(`Total: ${docs.length} records found`);
      console.log(docs[0]);
      client.close(); // different from video for V3
      return callback(docs)
    }, (err) => {
      console.log('Unable to fetch data', err);
    });

  });

}

let dbCollection = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';

data = getData('snow', dbCollection, (data) => {
  console.log(`Latest snow data: ${data[data.length-1].data}`)
  return data[0];
});

module.exports = {
  getData
}

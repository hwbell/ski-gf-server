
const { MongoClient, ObjectID } = require('mongodb');

const getData = (type, callback) => {
  MongoClient.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
    if (err) {
      console.log('Unable to connect to MongoDb server')
    }

    const db = client.db('SkiGfApp'); // different from video for V3
    console.log('Connected to MongoDB server');

    db.collection('SkiGfApp').find({ type }).toArray().then((docs) => {
      console.log(`Total: ${docs.length} records found`);
      console.log(docs[0]);
      client.close(); // different from video for V3
      return callback(docs)
    }, (err) => {
      console.log('Unable to fetch data', err);
    });

  });

}


data = getData('weather', (data) => {
  console.log(`Latest snow data: ${data[data.length-1].data}`)
  return data[0];
});

module.exports = {
  getData
}

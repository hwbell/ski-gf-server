
const { MongoClient, ObjectID } = require('mongodb');

let dbCollection = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';

const getData = (type, dbCollection, callback) => {
  MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
    if (err) {
      console.log('Unable to connect to MongoDb server')
    }

    let dbStr = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';
    const db = client.db(dbStr);

    db.collection(dbStr).find({ type }).toArray().then((docs) => {
      console.log(`Total: ${docs.length} records found`);
      console.log(docs[docs.length-1]);
      
      client.close(); // different from video for V3

      return callback(docs);
      
    }, (err) => {
      console.log('Unable to fetch data', err);
    });

  });

}

// to test
// data = getData('snow', dbCollection, (data) => {
//   //console.log(typeof(data[data.length-1].data))
//   console.log(`Latest snow data: ${data[data.length-1].data}`)

//   return data[data.length-1].data;
// });

module.exports = {
  getData
}

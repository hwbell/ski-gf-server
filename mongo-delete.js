const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDb server')
  }
  const db = client.db('SkiGfApp'); // different from video for V3
  console.log('Connected to MongoDB server');

  db.collection('SkiGfApp').deleteMany({type: 'snow'}).then((docs) => {
    console.log(`Total: ${docs.deletedCount || 0} records found and deleted!`);
    //console.log(JSON.stringify(docs, undefined, 2));
    
  }, (err) => {
    console.log('Unable to fetch data', err);
  });

  client.close(); // different from video for V3
});
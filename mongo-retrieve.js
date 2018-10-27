const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://@localhost:27017/SkiGfApp', (err, client) => {
  if (err) {
    console.log('Unable to connect to MongoDb server')
  }
  const db = client.db('SkiGfApp'); // different from video for V3
  console.log('Connected to MongoDB server');

  db.collection('SkiGfApp').find().toArray().then((docs) => {
    console.log(`Total: ${docs.length} users found`);
    console.log(JSON.stringify(docs, undefined, 2));
    
    
  }, (err) => {
    console.log('Unable to fetch data', err);
  });

  client.close(); // different from video for V3
});
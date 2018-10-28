const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/SkiGfApp', (err, client) => {
   if (err) {
       return console.log('Unable to connect to MongoDB server');
   } 
   console.log('Connected to MongoDB server');
   const db = client.db('SkiGfApp');
   
   db.collection('SkiGfApp').insertOne({
       type: 'snow',
       completed: false
   }, (err, result) => {
      if (err) {
          console.log('Unable to insert record to SkiGfApp');
      }
      console.log(JSON.stringify(result.ops, undefined, 2))
   });
   
   client.close();
});
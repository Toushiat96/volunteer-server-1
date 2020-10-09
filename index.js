const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;


const app = express()
require('dotenv').config()


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000



app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.0rza7.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});
client.connect(err => {
  const addcollection = client.db("volunteer").collection("addevent");
  // perform actions on the collection object
  
  app.post('/eventadd',(req,res)=>{
  const fakedata = req.body;
//   console.log(fakedata);
  addcollection.insertMany(fakedata)
    .then(result=>{
      res.send(result)
    })
  
  })
  
  app.get('/eventcollection', (req, res) => {
     addcollection.find({})
     .toArray((err, result) =>{
     
     res.send(result)
     })
  })
  app.get('/eventcollection/:id', (req, res) => {
    addcollection.find({id: req.params.id})
    .toArray((err , documents)=>{
      res.send(documents[0])
    })
  })
  
  
//   app.post('/addadmin',(req,res) => {
//     const adddata = req.body;
//     addcollection.insertOne(adddata)
//     .then(result=>{
//       res.send(result)

//     })
//   })
});

client.connect(err =>{
    const registercollection = client.db("volunteer").collection("registercollection");

   app.post('/addregister',(req,res) =>{
   
    const registerData = req.body;
    console.log(registercollection);
    registercollection.insertOne(registerData)
    .then(result=>{
      res.send(result)

    })
   
   })
   
   app.get('/readregister', (req, res) => {
   
  registercollection.find({email:req.query.email})
   .toArray((err, result) => {
       res.send(result)
   })
   })
   
   app.delete('/deleteitem/:id',(req,res) => {
    registercollection.deleteOne({id: req.params.id})
    .then((result)=>{
      console.log(result);
    })
    
  })
  
  app.get('/admingetregisterdata',(req, res) => {
     registercollection.find({})
     .toArray((err, result) => {
        res.send(result)
     })
  
  })
  app.post('/addadmin',(req,res) => {
    const adddata = req.body;
    registercollection.insertOne(adddata)
    .then(result=>{
      res.send(result)

    })
  })
  app.delete('/admindeleteitem/:id',(req,res) => {
    registercollection.deleteOne({id: req.params.id})
    .then((result)=>{
      console.log(result);
     
    })
  })

})


app.listen(port);
const express = require('express')
const bodyParser = require('body-parser') 
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wumse.mongodb.net/bazar?retryWrites=true&w=majority`;
const port = 4000

const password = 'name1234';

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("bazar").collection("shops");
  const orderCollection = client.db("bazar").collection("orders");
   console.log('add');
   app.post("/addProducts", (req,res)=>{
       const product = req.body;
       collection.insertOne(product)
       .then(result =>{
        //  console.log(result);
         res.send(result.insertedCount>0)
       })
   })

   app.get("/products",(req,res)=>{
     collection.find({})
     .toArray((err, documents)=>{
       res.send(documents);
     })
   })

   app.get("/product/:id",(req,res)=>{
    collection.find({_id:ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.post("/addOrder", (req,res)=>{
    const order = req.body;
    // console.log(order);
    orderCollection.insertOne(order)
    .then(result =>{
      // console.log(result);
      res.send(result.insertedCount>0)
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    // console.log(req.params.id)
    collection.deleteOne({_id:ObjectId(req.params.id)})
    .then((err, documents)=>{
      console.log(documents);
    })
    })
    app.get('/orderDetails',(req,res)=>{
      // console.log(req.query.email)
      orderCollection.find({email: req.query.email})
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })

});


app.listen(process.env.PORT || port)
  

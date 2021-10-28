const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId= require('mongodb').ObjectId;
const app= express();
const cors = require('cors')
const port =process.env.PORT ||  5000;


// pass :    uL76fuZKO32EH76P 
// geniusMechanic

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hes3p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        // console.log('connect to db');

        const database= client.db('carMechanic');
        const servicesCollection= database.collection('services');

        // get api 

        app.get('/services', async (req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });

        // get single service

        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};

            const service = await servicesCollection.findOne(query);
            console.log('geting specific service')
            res.json(service)

        })

        // put api update

        app.put('/services/:id', async (req, res)=>{
            const id = req.params.id;
            const updateService = req.body;
            const query = {_id: ObjectId(id)}
            const options={ upsert: true };

            const updateDoc = {
               $set:{ Name: updateService.Name,
               price: updateService.price
            }
            }
            const result = servicesCollection.updateOne(query, updateDoc, options)
            res.json(result)
        })


        // post api 

        app.post('/services', async(req, res)=>{
              
           const service = req.body ;


             const result = await servicesCollection.insertOne(service);
             console.log(result)
            console.log('hit the post api' , service)
            res.json(result)

        });

        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }finally{

        // await client.close()
    }
}
run().catch(console.dir);


app.get('/hello', (req, res)=>{
    res.send('hello this is heroku')
})

app.get('/', (req , res)=>{
    res.send('this is mongodb site  genius server')
})

app.listen(port, ()=>{
    console.log('runing port ', port)
})



/*
*one time 

1 .log in heroku 
2. install heroku software 

--------------
*every project 
1. git init 
2. git ignore
3. push every thing to git 
4. make sure you have process.env.port in front of port number 
5. make sure you have this script 'start': 'node index.js'  'start-dev': 'nodemon index.js'
6. hreoku login 
7.heroku create
8. git  push heroku main

------
*update 

1 .save everithing 
2. git add ., git commit -m "something "
3.git push heroku mail



*/
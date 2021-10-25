const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId= require('mongodb').ObjectId;
const app= express();
const cors = require('cors')
const port = 5000;


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

app.get('/', (req , res)=>{
    res.send('this is mongodb site  genius server')
})

app.listen(port, ()=>{
    console.log('runing port ', port)
})
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 8000

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lt2wcqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {

    const discountedMedicinesCollection = client.db('Ousodh_Chai').collection('discountedMedicines');
    const trendingMedicinesCollection = client.db('Ousodh_Chai').collection('TrendingMedicines');
    const babyFoodCollection = client.db('Ousodh_Chai').collection('babyFood');
    const advertiseCollection = client.db('Ousodh_Chai').collection('advertise');
    const CategoryCollection = client.db('Ousodh_Chai').collection('category_section');




    // Get discounted medicine data from db
    app.get('/discountedMedicines', async (req, res) => {
      const result = await discountedMedicinesCollection.find().toArray();
      res.send(result);
    });

    // get all trending medicines data
    app.get('/trendingMedicines', async (req, res) => {
      const result = await trendingMedicinesCollection.find().toArray();
      res.send(result);
    });

    // get all baby food data
    app.get('/babyFood', async (req, res) => {
      const result = await babyFoodCollection.find().toArray();
      res.send(result);
    });

    // get advertise slider data
    app.get('/advertise', async (req, res) => {
      const result = await advertiseCollection.find().toArray();
      res.send(result);
    });

    // get all category section data
    app.get('/category', async (req, res) => {
      const result = await CategoryCollection.find().toArray();
      res.send(result);
    });

    // Get single medicine data from db
    app.get('/discountedMedicines/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await discountedMedicinesCollection.findOne(query);
      res.send(result);
    })

    // Get category based data from db
    app.get('/category/:category', async (req, res) => {
      const category = req.params.category;
      const result = await CategoryCollection.find({category}).toArray();
      res.send(result);
    })











    // auth related api
    // app.post('/jwt', async (req, res) => {
    //   const user = req.body
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: '365d',
    //   })
    //   res
    //     .cookie('token', token, {
    //       httpOnly: true,
    //       secure: process.env.NODE_ENV === 'production',
    //       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //     })
    //     .send({ success: true })
    // })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
        console.log('Logout successful')
      } catch (err) {
        res.status(500).send(err)
      }
    })

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from OushodhChai Server..')
})

app.listen(port, () => {
  console.log(`OushodhChai is running on port ${port}`)
})

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
  origin: ['http://localhost:5173', 'http://localhost:8000', 'https://oushodh-chai.web.app'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Verify Token Middleware
// const verifyToken = async (req, res, next) => {
//   const token = req.cookies?.token
//   console.log(token)
//   if (!token) {
//     return res.status(401).send({ message: 'unauthorized access' })
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       console.log(err)
//       return res.status(401).send({ message: 'unauthorized access' })
//     }
//     req.user = decoded
//     next()
//   })
// }

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
    const cartCollection = client.db('Ousodh_Chai').collection('cart');
    const userCollection = client.db('Ousodh_Chai').collection('users');
    const category2Collection = client.db('Ousodh_Chai').collection('category');


    // Get all of data 
    app.get('/allData', async (req, res) => {
      const data1 = await discountedMedicinesCollection.find().toArray();
      const data2 = await trendingMedicinesCollection.find().toArray();
      const data3 = await babyFoodCollection.find().toArray();
      const data4 = await CategoryCollection.find().toArray();

      const result = [
        data1, data2, data3, data4
      ]
      res.send(result)
    })

    // get all data category collection
    app.get('/allData/:category', async (req, res) => {
      const category = req.params.category;
      const data1 = await discountedMedicinesCollection.find({ category }).toArray();
      const data2 = await trendingMedicinesCollection.find({ category }).toArray();
      const data3 = await babyFoodCollection.find({ category }).toArray();
      const data4 = await CategoryCollection.find({ category }).toArray();

      const result = [
        data1, data2, data3, data4
      ]
      res.send(result)
    })

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

    // get category 2 list section data
    app.get('/categories', async (req, res) => {
      const result = await category2Collection.find().toArray();
      res.send(result);
    });

    // Get single category 2 data from db
    app.get('/categories/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await category2Collection.findOne(query);
      res.send(result);
    })

    // get cart data
    app.get('/cart', async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });

    // get users from db
    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    // Get single medicine data from db
    app.get('/discountedMedicines/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await discountedMedicinesCollection.findOne(query);
      res.send(result);
    })
    // Get single trending medicine data from db
    app.get('/trendingMedicines/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await trendingMedicinesCollection.findOne(query);
      res.send(result);
    })
    // Get single baby food data from db
    app.get('/babyFood/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await babyFoodCollection.findOne(query);
      res.send(result);
    })

    // Get category based data from db
    app.get('/category/:category', async (req, res) => {
      const category = req.params.category;
      const result = await CategoryCollection.find({ category }).toArray();
      res.send(result);
    })

    // get single user based on email
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.find({ email }).toArray();
      res.send(result)
    })

    // add to cart using post method
    app.post('/cart', async (req, res) => {
      const addToCart = req.body;
      const result = await cartCollection.insertOne(addToCart);
      res.send(result)
    })

    // add user using post method
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'User already exist', insertedId: null })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    // Delete single cart data from db
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }
      const result = await cartCollection.deleteOne(query)
      res.send(result);
    })

    app.delete('/cart/deleteAll', async (req, res) => {
      await db.cartCollection.deleteMany({})
      res.send('All data deleted');
    });

    // Update user role 
    app.patch('/users/update/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email }
      const updateDoc = {
        $set: { ...user }
      }
      const result = await userCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // Update user role 
    app.patch('/categories/:id', async (req, res) => {
      const id = req.params.id;
      const updateCategoryData = req.body;
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...updateCategoryData
        }
      }
      const result = await category2Collection.updateOne(query, updateDoc, options)
      res.send(result);
    })

    // Delete single category data
    app.delete('/categories/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await category2Collection.deleteOne(query)
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

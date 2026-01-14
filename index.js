// const express = require('express')
// const app = express()
// require('dotenv').config()
// const admin = require("firebase-admin");
// const port = process.env.PORT || 3000
// const cors = require('cors')
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString(
//     'utf-8'
// )

// const serviceAccount = JSON.parse(decoded)
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// })



// app.use(
//   cors({
//     origin: [
//       'http://localhost:5173',
//       'http://localhost:5174',
//     ],
//     credentials: true,
//     optionSuccessStatus: 200,
//   })
// )
// app.use(express.json())

// // jwt middlewares

// const verifyJWT = async (req, res, next) => {
//   const token = req?.headers?.authorization?.split(' ')[1]
//   console.log(token)
//   if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
//   try {
//     const decoded = await admin.auth().verifyIdToken(token)
//     req.tokenEmail = decoded.email
//     console.log(decoded)
//     next()
//   } catch (err) {
//     console.log(err)
//     return res.status(401).send({ message: 'Unauthorized Access!', err })
//   }
// }


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(process.env.MONGODB_URI, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });



// async function run() {
//   try {
   
   
//       //   if (!client.topology?.isConnected()) {
//       //       await client.connect()
//       //   }


//       //  const db = client.db('MegaMart_db')
//       //   const ProductsCollection = db.collection('products')
//       //  app.post('/products',async (req,res)=>{
//       //  const ProductsData= req.body
//       //  const result=await ProductsCollection.insertOne(ProductsData)
//       //  res.send(result)
//       //   console.log(result)
//       //  })


//             await client.connect();
//     console.log("✅ MongoDB Connected");

//     const db = client.db('MegaMart_db')
//     const ProductsCollection = db.collection('products')

//     // Route inside run() — keep your style
//     app.post('/products', async (req, res) => {
//       try {
//         const ProductsData = req.body
//         const result = await ProductsCollection.insertOne(ProductsData)
//         res.send(result)
//         console.log(result)
//       } catch (error) {
//         res.status(500).send({ error: error.message })
//       }
//     })













//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {


//   }
// }
// run().catch(console.dir);













































































// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// app.get('/', (req, res) => {
//     res.send('MegaMart server is  running')
// })




const express = require('express')
const app = express()
require('dotenv').config()
const admin = require("firebase-admin");
const port = process.env.PORT || 3000
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8')
const serviceAccount = JSON.parse(decoded)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}))
app.use(express.json())

// JWT middleware
const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1]
  if (!token) return res.status(401).send({ message: 'Unauthorized Access!' })
  try {
    const decoded = await admin.auth().verifyIdToken(token)
    req.tokenEmail = decoded.email
    next()
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized Access!', err })
  }
}

// MongoClient
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect once
    await client.connect();
    console.log(" MongoDB Connected");

    const db = client.db('MegaMart_db')
    const ProductsCollection = db.collection('products')

  
    app.post('/products', async (req, res) => {
      try {
        const ProductsData = req.body
        const result = await ProductsCollection.insertOne(ProductsData)
        res.send(result)
        console.log(result)
      } catch (error) {
        res.status(500).send({ error: error.message })
      }
    }) 



    // products get 
    app.get('/products',async(req,res)=>{
        const result= await ProductsCollection.find().toArray()
        res.send(result)
    })







    // Ping test
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment successfully!");
  } catch (error) {
    console.error(error)
  }
 
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('MegaMart server is running')
})

app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});

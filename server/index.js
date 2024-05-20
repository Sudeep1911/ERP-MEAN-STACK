import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors middleware
import authRoutes from './routes/authRoutes.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Allow requests from all origins
app.use(cors());

const mongoURL = process.env.MONGO_URL;

// Connect to MongoDB
MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db(); // Get the database instance
    // You can perform database operations using the db object
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the server');
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

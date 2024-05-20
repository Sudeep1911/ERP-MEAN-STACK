import { MongoClient } from 'mongodb';

const mongoURL = "mongodb+srv://sudeepkarthigeyan20:4x9FWJOzHb0XjxFz@cluster0.27rp79d.mongodb.net/";
const DATABASE_NAME = "ERP";

const client = new MongoClient(mongoURL);

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const COLLECTION_NAME = "Login";
    await client.connect();
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    
    // Check if user exists
    const user = await collection.findOne({ username });
 
    if (!user) {
      return res.json({ message: 'User not found' });
    }
    // Check if password is correct
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return res.json({ message: 'Invalid password' });
    }
    // Return success message if username and password match
    return res.json({ message: 'Login successful', id: user.id,role:user.role });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const employees = async (req, res) => {
  try {
    const COLLECTION_NAME = "Employees";
    await client.connect();
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    
    // Check if user exists
    const employees = await collection.find({}).toArray();
    return res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const stock = async (req, res) => {
  try {
    const COLLECTION_NAME = "Warehouses";
    await client.connect();
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);
    
    // Check if user exists
    const employees = await collection.find({}).toArray();
    return res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const profile = async (req, res) => {
  const { id } = req.body; // Change 'userid' to 'id' to match the request body
  
  try {
    const COLLECTION_NAME1 = "Employees";
    const COLLECTION_NAME2 = "Login";
    await client.connect();
    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME1);
    
    // Check if user exists
    const user = await collection.findOne({ id: id }); // Use 'id' to query the database
    if (!user) {
      return res.json({ message: 'User not found' });
    }
    const collection2 = database.collection(COLLECTION_NAME2);
    const user2 = await collection2.findOne({ id: id });
    return res.json({ message: 'Retrieval successful', userdetails: user,logindetails:user2 });
  } catch (error) {
    return res.json({ message: 'Internal server error' });
  }
};
const updateprofile=async(req,res)=>{
  const { userDetails, loginDetails } = req.body;

  try {
    const database = client.db(DATABASE_NAME);
    const COLLECTION_NAME1 = "Employees";
    const COLLECTION_NAME2 = "Login";
    const collection = database.collection(COLLECTION_NAME1);
    const collection2 = database.collection(COLLECTION_NAME2);

    const userUpdateResult = await collection.updateOne(
      { id: userDetails.id },
      {
        $set: {
          name: userDetails.name,
          position: userDetails.position,
          warehouse: userDetails.warehouse,
          email: userDetails.email,
          salary: userDetails.salary
        }
      }
    );

    const loginUpdateResult = await collection2.updateOne(
      { id: loginDetails.id },
      {
        $set: {
          username: loginDetails.username,
          password: loginDetails.password,
          role:userDetails.position
        }
      }
    );

    if (userUpdateResult.modifiedCount === 0 && loginUpdateResult.modifiedCount === 0) {
      return res.json({ message: 'No changes made to the profile' });
    }

    res.json({ message: 'Update successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
const deleteemployee =async(req,res)=>{
  const { id } = req.body;
  try{
    const database = client.db(DATABASE_NAME);
    const COLLECTION_NAME1 = "Employees";
    const COLLECTION_NAME2 = "Login";
    const collection = database.collection(COLLECTION_NAME1);
    const collection2 = database.collection(COLLECTION_NAME2);
    await collection.deleteOne({ id: id });

    // Delete corresponding login details from Login collection
    await collection2.deleteOne({ id: id });

    res.json({ message: "Employee deleted successfully" });
  }catch{
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error" });
  };
};
const addemployee=async(req,res)=>{
  const { name, position, warehouse, email, phone, address, salary, username, password } = req.body;
  const database = client.db(DATABASE_NAME);
  const COLLECTION_NAME1 = "Employees";
  const COLLECTION_NAME2 = "Login";
  const collection = database.collection(COLLECTION_NAME1);
  const collection2 = database.collection(COLLECTION_NAME2);

  const maxEmployeeId = await collection.find().sort({ id: -1 }).limit(1).toArray();
  const nextEmployeeId = maxEmployeeId.length > 0 ? maxEmployeeId[0].id + 1 : 1;

  // Add employee details to the 'Employees' collection with the new ID
  await collection.insertOne({
    id: nextEmployeeId,
    name,
    position,
    warehouse,
    email,
    phone,
    address,
    salary
  });

  // Find the maximum ID value in the 'Login' collection
  const maxLoginId = await collection2.find().sort({ id: -1 }).limit(1).toArray();
  const nextLoginId = maxLoginId.length > 0 ? maxLoginId[0].id + 1 : 1;

  // Add login details to the 'Login' collection with the new ID
  await collection2.insertOne({
    id: nextLoginId,
    username,
    password,
    role:position
  });
  res.json({message:"Successfully added"});
}

export { login,employees,stock,profile,updateprofile,deleteemployee,addemployee};

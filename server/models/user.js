import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      }
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema, 'Login');

export default User;
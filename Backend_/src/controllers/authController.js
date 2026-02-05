import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async (req, res) => {
    try {
        const { username,email,password,role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role 
        });

        await UserStack.create({
        userId: user._id,
        balance: 100,
  });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        
         // Generate JWT
       const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

        res.status(200).json({ message: 'Login successful', token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance, }});
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { registerUser, loginUser };
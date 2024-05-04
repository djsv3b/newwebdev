const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const User = require('./user-model');

app.use(cors());
app.use(express.json());


// MongoDB connection with Mongoose (Direct URI included as per your preference)
const uri = "mongodb+srv://djsv3b:ikYwFEMcqQ7T5ngj@cluster0.5uujixz.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
// Sign up route
app.post('/sign-up', async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hash
    });

    const result = await newUser.save();
    const token = jwt.sign(
      { username: result.username, userId: result._id },
      'secret_string', // Replace with your secret or process.env.SECRET
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created and logged in',
      token: token,
      userId: result._id
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { username: user.username, userId: user._id },
      'secret_string', // Note: It's better to use an environment variable here
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Add a post route
app.post('/api/posts/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPost = {
      id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the post
      content: content,
      done: false
    };
    user.posts.push(newPost);

    const updatedUser = await user.save();
    res.status(201).json({ message: 'Post added', post: newPost });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: err });
  }
});

// Get posts route
app.get('/api/posts/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.posts);
  } catch (err) {
    console.error('Error finding user:', err);
    res.status(500).json({ error: err });
  }
});

app.delete('/api/posts/:userId/:postId', async (req, res) => {
  const { userId, postId } = req.params;
  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Remove the post from the posts array
      user.posts = user.posts.filter(post => post._id.toString() !== postId);
      await user.save();
      res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Failed to delete post', error: err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
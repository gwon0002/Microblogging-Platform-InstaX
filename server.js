const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = 4131;
const contacts = [];
let nextId = 1;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const generateContactLog = () => {
  let content = `
    <table class="contact-table">
      <tr>
        <th>Username</th>
        <th>Uploaded Date</th>
        <th>Content</th>
        <th>Delete</th>
      </tr>`;
};

app.use("/resources", express.static('resources'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Set static directory for CSS, JS, images, etc.
app.use('/css', express.static(path.join(__dirname, 'resources', 'css')));
app.use('/js', express.static(path.join(__dirname, 'resources', 'js')));
app.use('/images', express.static(path.join(__dirname, 'resources', 'images')));
app.set("views", "templates");
app.set('view engine', 'pug');

// Middleware for HTTP Basic Authentication
const authMiddleware = basicAuth({
  users: {'admin': 'password'},
  challenge: true,
  unauthorizedResponse: 'Unauthorized Access!',
});

app.get(['/', '/main'], (req, res) => {
  // Render mainpage.pug
  res.render('mainpage', {contacts});
});

// Add an endpoint to get a specific post by index
app.get('/getContact', (req, res) => {
  const { index } = req.query;
  const contact = contacts[index];
  res.json(contact);
});

const POSTS_PER_PAGE = 10;

app.get(['/main', '/page/:page'], (req, res) => {
  const page = req.params.page || 1;
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedContacts = contacts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(contacts.length / POSTS_PER_PAGE);

  res.render('mainpage', {
    contacts: paginatedContacts,
    currentPage: parseInt(page),
    totalPages: totalPages
  });
});

// Endpoint to update a contact's content
app.post('/updateContact', (req, res) => {
  const { index, newContent } = req.body;
  if(newContent !== null && newContent !== '') 
  {
    contacts[index].content = newContent;
    res.json({ success: true });
  } 
  else 
  {
    res.json({success: false, error: 'Invalid content'});
  }
});

// Handle the 'Like' action
app.post('/like', (req, res) => {
  const { index } = req.body; // Get the index of the liked post from the request
  
  // Increment the like count for the specific post
  if(contacts[index]) 
  {
    contacts[index].likes = (contacts[index].likes || 0) + 1;
  }
  // Send back the updated likes count for that post
  res.json({ likes: contacts[index] ? `${contacts[index].likes} Likes` : '0 Likes' });
});

app.get('/post', (req, res) => {
  // Render post.pug
  res.render('post');
});

// Function to handle editing a contact
const handleEditContact = (req, res) => {
  const{index, newContent} = req.body;
  if(newContent !== null && newContent !== '') 
  {
    contacts[index].content = newContent;
    res.json({success: true});
  } 
  else 
  {
    res.json({success: false, error: 'Invalid content'});
  }
};

// Endpoint to delete a contact by index
app.post('/deleteContact', (req, res) => {
  const { index } = req.body;
  if(index >= 0 && index < contacts.length) 
  {
    contacts.splice(index, 1); // Remove the contact from the array
    res.json({ success: true });
  } 
  else 
  {
    res.json({ success: false, error: 'Invalid index' });
  }
});

// Server-side code to handle editing a contact
app.post('/editPost', (req, res) => {
  const { index, newContent } = req.body;
  if(newContent !== null && newContent !== '') 
  {
    contacts[index].content = newContent;
    res.json({ success: true });
  } 
  else 
  {
    res.json({ success: false, error: 'Invalid content' });
  }
});

// Your route handling the profile page
app.get('/admin/profile', (req, res) => {
  const filteredContacts = contacts.filter(contact => contact.username === req.session.username);
  res.render('profile', { contacts: filteredContacts, username: req.session.username });
});

app.post('/post', (req, res) => {
  const form_data = req.body;
  const username = form_data.username; // Extract username from form data
  const content = form_data.content; // Extract content from form data

  const currentDate = new Date(); // Get current date and time
  const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`; // Format date as desired
  const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`; // Format time as desired

  // Construct a new contact object with the extracted data
  const newContact = {
    username: username,
    date: formattedDate,
    time: formattedTime,
    content: content
  };

  contacts.push(newContact); // Add the new contact to the contacts array
  // Redirect to the contactlog page after adding the new contact
  res.redirect('/main');
});

app.post("/login", (req, res) => {
  // Validate username and password (add your authentication logic here)
  // For example, assuming username and password are correct
  const username = req.body.username;

  // Set the username in the session
  req.session.username = username;

  // Redirect to the profile page after successful login
  res.redirect("/admin/profile");
});

// Assuming you have a route for logout
app.post('/logout', (req, res) => {
  // Clear the session
  req.session.destroy(err => {
    if(err) 
    {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } 
    else 
    {
      // Redirect to the profile page or any other desired page after logout
      res.redirect('/login');
    }
  });
});

app.get('/admin/salelog', authMiddleware, async (req, res) => {
  try 
  {
    const recentSales = await data.getRecentSales();
    res.json(recentSales);
  } 
  catch(error) 
  {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Store uploaded files in the 'public/uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get('/admin/profile', (req, res) => {
  const filteredContacts = contacts.filter(contact => contact.username === 'username');
  console.log(filteredContacts); // Log the contacts array to the console
  res.render('profile', { contacts: filteredContacts });
});

app.post('/uploadProfilePic', upload.single('profilePic'), (req, res) => {
  res.redirect('/admin/profile');
});

app.get("/login", (req, res) => {
if(req.session.username || req.session.password)
{
  res.render("logout",{username:req.session.username})
}
else
{
  res.render("login",{username:req.session.username})
}
});

app.post("/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  req.session.username = username;
  req.session.password = password;

  res.render("profile", { username: username });
});

// Handle 404 - Page Not Found
app.use((req, res) => {
  res.status(404).render('404');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

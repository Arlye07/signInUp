const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const helmet = require('helmet');

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/login', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define el esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    name: String, // El nombre de usuario se almacena sin hashear
    email: { type: String, unique: true }, // El correo electrónico debe ser único
    password: String // La contraseña se almacena hasheada
});

const User = mongoose.model('User', userSchema);

// Convertir datos a formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de helmet para CSP
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        imgSrc: ["'self'", "http://localhost:"],
        // Agrega más directivas según sea necesario
      },
    })
);

// Configuración de ejs
app.set('view engine', 'ejs');

// Archivos estáticos
app.use(express.static("public"));

// Rutas
app.get("/", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

// Registro de usuario
app.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hashea la contraseña
        const user = new User({
            name: req.body.username, // Almacena el nombre sin hashear
            email: req.body.email, // Almacena el correo electrónico
            password: hashedPassword // Almacena la contraseña hasheada
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering new user' });
    }
});

// Inicio de sesión
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port:${port}`);
});

///////////////////

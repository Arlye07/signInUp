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
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// Convertir datos a formato JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuración de helmet para CSP
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"], // Permitir scripts en línea y desde cdnjs
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"], // Permitir imágenes desde orígenes seguros
            connectSrc: ["'self'", "http://localhost:5000/"], // Permitir conexiones a tu API
            fontSrc: ["'self'","https://cdnjs.cloudflare.com", "https://fonts.gstatic.com"], // Permitir fuentes desde Google Fonts
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        },
    })
);
  

// Configuración de ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/')); // Asegúrate de que el directorio de vistas esté correctamente configurado

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// Rutas
app.get("/", (req, res) => {
    res.render('index'); // Renderizar la página combinada de registro e inicio de sesión
});

app.get("/signup", (req, res) => {
    res.render('signup'); // Renderizar la página de registro independiente
});

app.get("/login", (req, res) => {
    res.render('login'); // Renderizar la página de inicio de sesión independiente
});

// Registro de usuario
app.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const newUser = await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error registering new user' });
    }
});

// Inicio de sesión
app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port:${port}`);
});

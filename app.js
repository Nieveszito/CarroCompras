const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const app = express();




app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 


// Middleware para gestionar sesiones
app.use(session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: true
}));



// Página principal
app.get('/', (req, res) => {
    res.render('index'); 
});

//Pagina de inicio
app.get('/inicio', (req, res) => {
    res.render('inicio', { errorMessage: null }); 
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sillones',
    database: 'carrito'
});

app.post('/inicio', (req, res) => {
    const { identifier, password } = req.body;
    const sql = `SELECT * FROM usuario WHERE nombre_U = ? AND contra_U = ?`;
    connection.query(sql, [identifier, password], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            req.session.user = result[0].id; 
            res.redirect('/productos');
        } else {
            res.render('inicio', { errorMessage: "Nombre o contraseña incorrectos, intenta registrarte GG" });
        }
    });
});

app.get('/general', (req, res) => {
    res.render('general', { message: '' });
});
app.get('/carrito', (req, res) => {
    // Obtener el carrito desde la sesión
    const cart = req.session.cart || [];
    
    // Calcular el total
    const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    
    // Pasar cart y total a la vista
    res.render('carrito', { cart, total });
});
app.get('/productos', (req, res) => {
    res.render('productos', { message: '' });
});
app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM producto'; // Consulta para obtener los productos
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los productos:', err);
            return res.status(500).send('Error al obtener los productos.');
        }

        // Renderiza la vista 'productos' y envía los datos obtenidos
        res.render('productos', { productos: results });
    });
});

app.get('/productos/:category', (req, res) => {
    const category = req.params.category;
    const sql = `SELECT * FROM producto WHERE Categoría_Producto_id_catProd = ?`;

    connection.query(sql, [category], (err, results) => {
        if (err) {
            console.error('Error al obtener los productos:', err);
            return res.status(500).json({ error: 'Error al obtener los productos.' });
        }

        console.log('Datos obtenidos:', results); // Verificar datos
        res.json(results);
    });
});


// GET /crearcuenta: Renderizar la vista para crear una cuenta
app.get('/crearcuenta', (req, res) => {
    res.render('crearcuenta', { message: '' }); // Renderiza la vista crearcuenta.ejs
});

app.post('/crearcuenta', (req, res) => {
    const { email, nombre, password } = req.body;

    // Validación básica
    if (!email || !nombre || !password) {
        return res.render('crearcuenta', { message: 'Todos los campos son obligatorios' });
    }

    const sql = `INSERT INTO usuario (correo_U, nombre_U, contra_U, Rol_U_id_rolU) VALUES (?, ?, ?, 1)`;
    connection.query(sql, [email, nombre, password], (err, result) => {
        if (err) {
            console.error('Error al crear usuario:', err);
            return res.render('crearcuenta', { message: 'Error al crear cuenta. Intenta de nuevo.' });
        }

        res.redirect('/inicio'); // Redirige al inicio de sesión
    });
});



app.get('/ventas', (req, res) => {
    res.render('ventas', { message: '' });
});



// Conexión a la base de datos
connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});






// Instalar express-session para manejar sesiones




// Ruta para agregar un producto al carrito
// Ruta para agregar un producto al carrito
app.post('/agregar-al-carrito', (req, res) => {
    const { id, name, price, quantity } = req.body;
    
    // Inicializar el carrito si no existe en la sesión
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Buscar si el producto ya existe en el carrito
    const existingProductIndex = req.session.cart.findIndex(item => item.id === id);
    if (existingProductIndex > -1) {
        // Si ya existe, aumentar la cantidad
        req.session.cart[existingProductIndex].quantity += quantity;
    } else {
        // Si no existe, agregarlo al carrito
        const product = { id, name, price, quantity };
        req.session.cart.push(product);
    }

    // Responder con éxito
    res.json({ success: true, cart: req.session.cart });
});

  

// Ruta para mostrar el carrito



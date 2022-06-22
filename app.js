// modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
app.use(bodyParser.urlencoded({
    extended: true
}));
const port = 4000;
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./DB/register.db');
app.set('view engine', 'ejs');
const nodemailer = require('nodemailer');
app.use(cookieParser());
const timeEXp = 1000 * 60 * 60 * 24;
app.use(sessions({ 
secret: "rfghf66a76ythggi87au7td",
saveUninitialized:true,
cookie: { maxAge: timeEXp },
resave: false }));

// Rutas ----------------------------------------->
app.get('/', (req, res) => {
    res.render('index')
});
app.get('/', (req, res) => {
    session=req.session;
    if(sessions.userId){

    res.render('index')
}else{
    res.send("Debes iniciar sesión");
}

});


app.get('/registrook', (req, res) => {
    res.render('registrook')
});
app.get('/registro', (req, res) => {
    res.render('registro')
});

// File Statics ------------>

app.use(express.static(__dirname + '/public'));

app.post('/registro', (req, res) => {
    let name = req.body.nombre;
    let lastName = req.body.apellido;
    let residencia = req.body.residencia;
    let document = req.body.documento;
    let num_id = req.body.num_id;
    let email = req.body.email;
    let password = req.body.password;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    db.run(`INSERT INTO Registro(name, lastName, residencia, document, num_id,email,password) 
    VALUES(?, ?, ?, ?, ?, ?,?)`,
        [name, lastName, residencia, document, num_id, email, hash],
        function (error) {
            if (!error) {
                console.log('Insert OK');
                return res.render('registrook');
            } else {
                console.log('insert error', error.code);
                if (error.code == "SQLITE_CONSTRAINT") {
                    return res.send('El usuario ya existe');
                }
                return res.send('Error desconocido');
            }
        }
    );

    // Envio de correo de registro
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'alertfemc@gmail.com',
            pass: 'xcvjrfbcpbtcsznd'
        }
    });

    // send email
    transporter.sendMail({
        from: 'alertfemc@gmail.com',
        to: email,
        subject: 'Test Email Subjects',
        html: '<h1>REGRISTRO EXITOSO</h1><h2>GRACIAS POR EXISTIR 737</H2><img src="https://res.cloudinary.com/click-alert-fem/image/upload/v1654792461/samples/logos/LOGOO_tvefoj.jpg">'
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    })
});


app.post('/logicalogin', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //se pasa una variable sencilla a la vista
    db.get("SELECT password FROM Registro WHERE email=$email", {
        $email: email
    }, (error, rows) => {
        console.log("wwww", rows.password);
        if (bcrypt.compareSync(password, rows.password)) {
            return res.send("logueado exitosamente");
        }
        return res.send('usuario y contraseña incorrecta');
    })

});





app.get('/login', (req, res) => {
    //se pasa una variable sencilla a la vista
    res.render('login');
})




// Servidor ---------------------------------->
app.listen(port, () => {
    console.log('Server running uvu');
});

// ------------------------------>


app.post('/login', (req, res) => {
    let document = req.body.document;
    let password = req.body.password;
    res.send(`Ingrese su documento: ${document} Ingrese su contraseña: ${password}`);
});
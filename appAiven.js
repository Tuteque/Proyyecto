const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const Usuario = require('./models/users_sql');  // Usar el modelo Sequelize
const methodOverride = require('method-override');
const multer = require('multer');
const sequelize = require('./database'); // Asegúrate de importar Sequelize
const app = express();
const PORT = 3000;

app.set('views', 'html2');
app.set('view engine', 'ejs'); // Usa EJS como motor de plantillas

// Middleware
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configurar multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });


// Conexión a la base de datos
sequelize.sync().then(() => {
  console.log('Conexión a la base de datos exitosa');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.log('Error al conectar a la base de datos:', err);
});

// Rutas
app.get('/', (req, res) => {
  Usuario.findAll()
    .then(users => {
      res.render('main', { users });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/crear', (req, res) => {
  res.render('crear');
});

app.get('/editar/:id', (req, res) => {
  const { id } = req.params;

  // Buscar el usuario en la base de datos
  Usuario.findByPk(id)
    .then(user => {
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.render('modifica', { user });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error al cargar el usuario');
    });
});

app.post('/', upload.single('image'), (req, res) => {
  const { nombre, apellido, edad, email, fecha, nacionalidad, sexo } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const newUser = {
    nombre,
    apellido,
    edad,
    email,
    fecha,
    nacionalidad,
    sexo,
    imagePath
  };

  Usuario.create(newUser)
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/editar/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, edad, email, fecha, nacionalidad, sexo } = req.body;
  
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const updatedUser = {
    nombre,
    apellido,
    edad,
    email,
    fecha,
    nacionalidad,
    sexo,
    imagePath
  };

  // Actualizar el usuario
  Usuario.update(updatedUser, { where: { id } })
    .then(([affectedRows]) => {
      if (affectedRows === 0) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.redirect('/');
    })
    .catch(err => {
      console.log("Error al actualizar el usuario:", err);
      res.status(500).send('Error al actualizar el usuario');
    });
});

app.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Eliminar el usuario
  Usuario.destroy({ where: { id } })
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error al eliminar el usuario');
    });
});

// Páginas adicionales
app.get('/p2', (req, res) => {
  const num1 = 1;
  const num2 = 2;
  res.render('p2', { num1, num2 });
});

app.get('/p3', (req, res) => {
  const nombre = [
    { Title: 'nombre 1', snippet: 'alvaro' },
    { Title: 'nombre 2', snippet: 'german' },
    { Title: 'nombre 3', snippet: 'juan' },
  ];
  const apellido = [
    { Title: 'apellido 1', snippet: 'chustas' },
    { Title: 'apellido 2', snippet: 'campaña' },
    { Title: 'apellido 3', snippet: 'pacheco' },
  ];
  res.render('p3', { nombre, apellido });
});

app.get('/imagenes', (req, res) => {
  res.render('imagenes');
});

// Página de error 404
app.use((req, res) => {
  res.status(404).render('404');
});


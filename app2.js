const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const User = require ('./models/users')
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const multer = require('multer')
const app = express()
const db = 'mongodb+srv://salomon:1234@Aramburu.8rqy4.mongodb.net/UsersDB'
const PORT = 3000
app.set('view engine','ejs');
app.set('views','html2')
mongoose.connect(db)
  .then((resultado) => app.listen(PORT))
  .catch((error) => console.log(error))



app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'))
app.use('/uploads',express.static('uploads'))
app.use(express.urlencoded({extended: true}));

//definir carpeta fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, filename)
  }
})

const upload = multer({ storage })

app.get('/', function (req, res) {
  User.find()
  .then((resultado) => {
      res.render('main',{users:resultado});
  })
  .catch((error) =>{
    console.log(error);
  })
})

app.get('/p2', function (req, res) {
  var num1 = 1;
  var num2 = 2;
  res.render('p2',{num1,num2})
})

app.get('/p3', function (req, res) {
  const nombre = [
    {Title: 'nombre 1',snippet:'alvaro'},
    {Title: 'nombre 2',snippet:'german'},
    {Title: 'nombre 3',snippet:'juan'},
  ];
  const apellido = [
    {Title: 'apellido 1',snippet:'chustas'},
    {Title: 'apellido 2',snippet:'campaña'},
    {Title: 'apellido 3',snippet:'pacheco'},
  ];
  res.render('p3',{nombre ,apellido})
})

app.get('/crear', function (req, res) {
  res.render('crear')
})

app.get('/imagenes', function (req, res) {
  res.render('imagenes')
})
app.get('/todos-los-usuarios',(req, res) => {
  User.find()
  .then((resultado) => {
      res.send(resultado);
  })
  .catch((error) =>{
    console.log(error);
  })
})
app.get('/buscar-un-usuario',(req, res) => {
  User.findById('6733a0eeca7adc7eec5750ea')
  .then((resultado) => {
      res.send(resultado);
  })
  .catch((error) =>{
    console.log(error);
  })

})
//POST
app.post('/',upload.single('image'),((req,res) => {
  const {nombre, apellido, edad, email, fecha, nacionalidad, sexo } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  //const blog = new Blog(req.body)

  const newUser = new User ({
    nombre,
    apellido,
    edad,
    email,
    fecha,
    nacionalidad,
    sexo,
    imagePath
  })
  newUser.save()
  .then((resultado) => {
    res.redirect('/')
  })
  .catch((error)=>{
    console.log(error)
  })
}))


// Ruta para cargar el formulario de edición de un usuario
app.get('/editar/:id', (req, res) => {
  const { id } = req.params;  // Obtener el ID del usuario desde la URL
  
  // Verificar si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('Usuario no encontrado');
  }

  // Buscar el usuario en la base de datos
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      // Cargar la vista de edición con los datos del usuario
      res.render('modifica', { user, Title: 'Editar Usuario' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error al cargar el usuario');
    });
});
// Ruta POST para actualizar un usuario
app.post('/editar/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, nacionalidad, sexo, edad } = req.body;  // Obtener los nuevos datos del formulario
  
  // Verificar si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('Usuario no encontrado');
  }

  // Buscar el usuario en la base de datos y actualizar
  User.findByIdAndUpdate(id, { nombre, apellido, nacionalidad, sexo, edad }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.redirect('/');  // Redirigir a la lista de usuarios o a la página deseada
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error al actualizar el usuario');
    });
});





// Ruta DELETE para eliminar un usuario
app.delete('/:id', (req, res) => {
  const id = req.params.id;

  // Verificar si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('');
  }

  // Eliminar el usuario
  User.findByIdAndDelete(id)
    .then((resultado) => {
      res.redirect('/');  // Redirigir a la lista de usuarios después de eliminar
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Error al eliminar el usuario');
    });
});




app.use((req,res) => {
  res.status(404).render('404')
})


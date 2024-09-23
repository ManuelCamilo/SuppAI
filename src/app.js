import express from 'express';
import dotenv from 'dotenv';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import productsRouter from './routers/products.router.js'
dotenv.config();

const app = express();

// ruta absoluta...  -> dependerá que el nombre de 'src' siempre sea el mismo... 
// al usar una ruta absoluta, independientemente del nombre de la carpeta accederá a public...
// calculando en tiempo de ejecución las rutas necesarias para llegar a public.
// app.use(express.static('../src/public'))
// función utilitaria '__dirname' en utils.js

// Middleware para procesar JSON
app.use(express.json());

// configuración  carpeta public con ruta absoluta, si el nombre de la carpeta cambia a 'algo', ingresara a public de todas formas.
app.use (express.static(__dirname+'/public'))

// configuración del motor de plantillas. se instala npm i express-handlebars. - Las 3 líneas - 
app.engine('handlebars', handlebars.engine());  // configuración por defecto utiliza '.handlebars' en la extensión... se podría cambiar otra extensión...
// la carpeta en donde estará el main DEBE llamarse main.handlebars. DEBE llamarse layouts, por la configuración por defecto. 
app.set('views', __dirname+'/views'); //las vistas -> en la carpeta 'views'. se le agrega __dirname para el calculo de la ruta dinamicamente. 
app.set('view engine', 'handlebars');

//ruta products
app.use('/products', productsRouter)

app.get('/', (req, res) => res.send('todo ok'))

app.listen(8080, () => console.log('server up'))
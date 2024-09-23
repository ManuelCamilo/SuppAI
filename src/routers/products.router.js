import { Router } from "express";
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from "openai";
import fs from 'fs';
import path from "path";
import __dirname from "../utils.js";

const router = Router();

const filePath = path.join(__dirname, '/data/products.json');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.get('/', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('error al leer el archivo json', err);
            return res.status(500).send('Error al leer los productos');
        }
        const productos = JSON.parse(data);

        res.render('productos', {productos});
    });
});

router.get('/:id', (req, res) => {
    const productoId = req.params.id // Se obtiene el ID del producto desde la URL.
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON', err);
            return res.status(500).send('Error al leer los productos');
        }
        const productos = JSON.parse(data); //parsea la data a json.
        const producto = productos.find(p => p.id == productoId); // se guarda en producto, el producto con el ID, traído desde params, encontrado con el find.
        
        if (producto) {
            res.render('productoDetalle', {producto})
        } else {
            res.status(404).send('Producto no encontrado')
        }
    })
})

router.post('/soporte-ia', async (req, res) => {
    const { message, producto } = req.body;  // Capturamos el mensaje del usuario

    try {
        const prompt = `El usuario está preguntando sobre el siguiente producto:
        - Nombre del producto: ${producto.nombre}
        
        
        Tu rol es ser un asistente de soporte técnico de Ultrix. Ayudarás al usuario con cualquier pregunta sobre el producto "${producto.nombre}" de manera profesional, clara y concisa. Responderás como lo haría un profesional del área técnica, sin exagerar, y mantendrás un tono neutral y educado en todo momento. 
    
        No es necesario saludar al usuario en cada respuesta. En lugar de repetidos "¡Hola!" o "¡Estoy aquí para ayudarte!", concéntrate en proporcionar respuestas precisas y útiles a las consultas.

        Pregunta del usuario: ${message}`;
        
        
        // Enviar la pregunta a OpenAI y obtener la respuesta
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',  
            messages: [
                { role: 'system', content: 'Eres un asistente de soporte técnico de Ultrix. Mantén un tono profesional y responde a las preguntas del usuario sobre los productos con claridad y precisión. Evita frases entusiastas o exageradas.' },
                { role: 'user', content: prompt },
            ],
        });

        const iaResponse = completion.choices[0].message.content.trim();  // Tomamos la respuesta de OpenAI

        res.json({ response: iaResponse });  // Enviar la respuesta de la IA al cliente
    } catch (error) {
        console.error('Error con OpenAI:', error);
        res.status(500).send('Error al procesar la solicitud de IA');
    }
});



// primer argumento: nombre de la plantilla que debe existir en carpeta views.
// como segundo argumento: OBJETO, que se enviará a la plantilla.
// router.get('/', (req, res) => {
//     res.render('productos', {
//         nombre: 'Manu'
//     })
// })

export default router;
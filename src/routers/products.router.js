import { Router } from "express";
import fs from 'fs';
import path from "path";
import __dirname from "../utils.js";
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const filePath = path.join(__dirname, '/data/products.json');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
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
    const { message } = req.body;  // Capturamos el mensaje del usuario

    try {
        // Enviar la pregunta a OpenAI y obtener la respuesta
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',  
            messages: [
                { role: 'system', content: 'Eres un asistente de soporte técnico.' },
                { role: 'user', content: message },
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
import express from 'express';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Initialize dotenv
dotenv.config();

// Initialize Express
const app = express();
const port = 3000;

// Hugging Face Inference setup
const ACCESS_TOKEN = process.env.HUGGINGFACE_TOKEN;
const hfInference = new HfInference(ACCESS_TOKEN);

// set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.get('/get-caption', async (req, res) => {
    const imageUrl = req.query.imageUrl;
    console.log(imageUrl)
    
    if (!imageUrl) {
        return res.status(400).send('No image URL provided');
    }

    try {
        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();

        // Use imageToText function to get caption
        const result = await hfInference.imageToText({
            data: imageBlob,
            model: 'nlpconnect/vit-gpt2-image-captioning'
        });

        res.json({caption: result.generated_text});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing the image');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
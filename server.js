const express = require('express');
const next = require('next');
const multer = require('multer');
const {spawn} = require("child_process");
const path = require("path");
const cors = require("cors")
const admin = require("firebase-admin")
require('dotenv').config()
const serviceAccount = JSON.parse(process.env.NEXT_GOOGLE_APPLICATION_CREDENTIALS_JSON);
console.log(process.env.NEXT_GOOGLE_APPLICATION_CREDENTIALS_JSON)
console.log(JSON.parse(process.env.NEXT_GOOGLE_APPLICATION_CREDENTIALS_JSON))

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const upload = multer();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Or provide path to your service account key file
  });
}

app.prepare().then(() => {
  const corsOptions = {
    origin: 'https://happykids-jobs-projects-945cf969.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  const server = express();

  server.use(express.json());
  server.use(cors(corsOptions))

  server.delete('/user/:id', async (req, res) => {
    const {id} = req.params;
    try {
      await admin.auth().deleteUser(id);
    } catch (error) {
      console.log(error)
    }

    return res.json({message: "success"})
  })

  server.post('/rate/word_pronunciation', upload.single('audio'), (req, res) => {
    const referenceText = req.body.referenceText;
    const audioBuffer = req.file.buffer;
  
    const pythonProcess = spawn('python', ['analyzer.py', referenceText]);
  
    pythonProcess.stdin.write(audioBuffer);
    pythonProcess.stdin.end();
  
    pythonProcess.stdout.on('data', (data) => {
      // const result = JSON.parse(data);
      console.log("Hey", data.toString())
      // return res.json(data.toString());
      res.json(data.toString())
    })
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
      res.status(500).send("Error processing audio")
    })
  })

    // Example custom route
    server.get('/', (req, res) => {
      return app.render(req, res, '/', req.query);
    });

  // Handling all other routes
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

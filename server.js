const express = require('express');
const next = require('next');
const multer = require('multer');
const {spawn} = require("child_process");
const path = require("path");
const cors = require("cors")

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const upload = multer();


app.use(cors({
  origin: 'https://happykids-five.vercel.app', // Replace with your frontend URL
}));

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  // Example custom route
  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });

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

import multer from "multer";
import { spawn } from "child_process";

// Configure multer for handling file uploads
const upload = multer();

export const POST = async (req) => {
  // Multer for handling file upload in serverless
  const formData = await new Promise((resolve, reject) => {
    upload.single("audio")(req, {}, (err) => {
      if (err) reject(err);
      else resolve(req);
    });
  });

  console.log(formData)
  const { referenceText } = formData.body;
  const audioBuffer = formData.file.buffer;

  // Execute Python script for pronunciation analysis
  const pythonProcess = spawn("python", ["analyzer.py", referenceText]);

  pythonProcess.stdin.write(audioBuffer);
  pythonProcess.stdin.end();

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on("data", (data) => {
      resolve(new Response(data.toString(), { status: 200 }));
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
      reject(new Response("Error processing audio", { status: 500 }));
    });
  });
};

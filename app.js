const express = require("express");
const axios = require("axios");
const path = require("path"); // Import the path module
const app = express();
const port = 3000;
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  dest: "uploads/", // Directory to save uploaded files
  fileFilter: (req, file, cb) => {
    // Accept only .txt and .pdf files
    const allowedTypes = ["text/plain", "application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .txt and .pdf files are allowed"));
    }
    cb(null, true);
  },
});

app.use(express.static("public")); // Serve static files from "public" folder

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
/*
app.post("/predict", async (req, res) => {
  const resumeText = req.body.resume;

  try {
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      resume: resumeText,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error in prediction service:", error.message);
    res.status(500).json({ error: "Error in prediction service" });
  }
});
*/
// Handle file upload and call Flask API
app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  const filePath = path.join(__dirname, file.path);

  // Read the uploaded file
  if (file.mimetype === "text/plain") {
    // For .txt files, read the content
    fs.readFile(filePath, "utf-8", async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error reading file");
      }

      // Send the content to the Flask API
      try {
        const response = await axios.post("http://127.0.0.1:5000/predict", {
          resume: data,
        });

        // Send the Flask API response back to the frontend
        res.json({ job_category: response.data.job_category });
      } catch (error) {
        console.error("Error calling Flask API:", error.message);
        res.status(500).send("Error calling prediction service");
      } finally {
        // Delete the temporary file
        fs.unlinkSync(filePath);
      }
    });
  } else if (file.mimetype === "application/pdf") {
    // For .pdf files, you can use a library like `pdf-parse` to extract content
    const pdfParse = require("pdf-parse");
    const pdfBuffer = fs.readFileSync(filePath);

    pdfParse(pdfBuffer)
      .then(async (data) => {
        try {
          const response = await axios.post("http://127.0.0.1:5000/predict", {
            resume: data.text, // Extracted text content from PDF
          });

          // Send the Flask API response back to the frontend
          res.json({ job_category: response.data.job_category });
        } catch (error) {
          console.error("Error calling Flask API:", error.message);
          res.status(500).send("Error calling prediction service");
        } finally {
          // Delete the temporary file
          fs.unlinkSync(filePath);
        }
      })
      .catch((err) => {
        console.error("Error processing PDF:", err.message);
        res.status(500).send("Error processing PDF file");
      });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

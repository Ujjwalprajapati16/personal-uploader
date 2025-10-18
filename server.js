import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

// ===== MULTER: Limit file size to 10 MB =====
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ===== Cloudinary Config =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== EJS Setup =====
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.render("index", { uploaded: null, deleted: null, error: null });
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const folder = req.body.folder || "personal_uploads";

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath);

    const fileName = req.file.originalname;
    const fileUrl = result.secure_url;

    // Log the upload
    fs.appendFileSync("uploads_log.txt", `${fileName} (${folder}) => ${fileUrl}\n`);

    res.render("index", { uploaded: { name: fileName, url: fileUrl }, deleted: null, error: null });
  } catch (err) {
    console.error(err);
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "❌ File too large! Maximum size is 10MB."
        : "⚠️ Upload failed.";
    res.render("index", { uploaded: null, deleted: null, error: msg });
  }
});

// ===== DELETE BY CLOUDINARY URL =====
app.post("/delete", async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) return res.render("index", { uploaded: null, deleted: null, error: "No URL provided." });

    // Extract public_id from URL
    const parts = fileUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/"); // after /upload/vXXXX/
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove file extension

    await cloudinary.uploader.destroy(publicId);

    res.render("index", { uploaded: null, deleted: fileUrl, error: null });
  } catch (err) {
    console.error(err);
    res.render("index", { uploaded: null, deleted: null, error: "Failed to delete file." });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

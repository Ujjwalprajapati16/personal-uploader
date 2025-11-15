# 🌩️ Personal Cloudinary Uploader

A simple Node.js + Express application to upload and delete files from Cloudinary with a clean UI using EJS.

---

## 🚀 Features

- Upload any file up to **10MB**
- Choose upload folder:  
  - `personal_uploads`  
  - `documents`  
  - `images`  
  - `videos`
- Delete Cloudinary files using their URL
- Automatic temp file cleanup
- Upload logs stored in `uploads_log.txt`
- Clean and responsive UI

---

## 📂 Project Structure

```
├── public/
├── views/
│   └── index.ejs
├── uploads/
├── uploads_log.txt    # Upload logs
├── .env
├── server.js          # Main server file
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Install Dependencies

```bash
npm install
```
### 2️⃣ Create .env File
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these values from your Cloudinary dashboard.

### ▶️ Running the Server
```bash
npm start
```

Server will run at:
```bash
http://localhost:3000
```

### 🖼️ Upload Flow

- Select a file (max 10MB)

- Choose a folder

- Click Upload

- Get file URL + preview link

- Uploaded files are logged in:

- uploads_log.txt

### 🗑️ Delete File from Cloudinary

- Paste the Cloudinary file URL

- Click Delete File

- The backend extracts the public_id and deletes it
---
### 🧠 How Deletion Works

A Cloudinary URL looks like:

```bash
https://res.cloudinary.com/<cloud>/image/upload/v123456/myfolder/file.jpg
```

Your backend extracts the public_id:
```bash
myfolder/file
```

Then calls:
```bash
cloudinary.uploader.destroy(publicId);
```
---
### 🛠️ Tech Stack

- Node.js

- Express.js

- Multer

- Cloudinary SDK

- EJS Template Engine

- Vanilla CSS
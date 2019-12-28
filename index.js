const dotenv = require('dotenv');
const express = require('express');
const cloudinary = require('cloudinary');
const formData = require('express-form-data');

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(formData.parse({ autoClean: true }));

app.post('/upload', async (req, res) => {
  try {
    const [first] = Object.values(req.files);
    const response = await cloudinary.v2.uploader.upload(first.path, {
      eager: [
        {
          quality: 'auto'
        }
      ],
      eager_async: true,
      eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL
    });
    res.json(response).status(201);
  } catch (e) {
    res.send('Error').status(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`);
});

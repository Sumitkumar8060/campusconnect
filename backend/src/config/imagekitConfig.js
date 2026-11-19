// config/imagekitConfig.js

// We import the official ImageKit Node.js SDK.
// Install it with: npm install imagekit
const ImageKit = require('imagekit');

// We create ONE ImageKit instance and reuse it across the app.
// All credentials come from environment variables — NEVER hardcode them.
// Make sure these are set in your .env file:
//   IMAGEKIT_PUBLIC_KEY=your_public_key
//   IMAGEKIT_PRIVATE_KEY=your_private_key
//   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = imagekit;
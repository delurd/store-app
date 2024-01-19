import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export default cloudinary



// RES
// {
//     asset_id: 'be307111c0bc6ab0c273b524ce7f22aa',
//     public_id: 'muddc771s4j1kdemxqti',
//     version: 1705669311,
//     version_id: '9effcf5c14255dd8be2585d3971ec0c3',
//     signature: '803562617459665c9bd112184a1c41761debf8b0',
//     width: 1000,
//     height: 1000,
//     format: 'png',
//     resource_type: 'image',
//     created_at: '2024-01-19T13:01:51Z',
//     tags: [],
//     bytes: 67057,
//     type: 'upload',
//     etag: 'c6635064ba3a2cbb422cd1829eaaaeeb',
//     placeholder: false,
//     url: 'http://res.cloudinary.com/storein/image/upload/v1705669311/muddc771s4j1kdemxqti.png',
//     secure_url: 'https://res.cloudinary.com/storein/image/upload/v1705669311/muddc771s4j1kdemxqti.png',
//     folder: '',
//     api_key: '376323598964324'
//   }
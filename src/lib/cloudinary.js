import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**

 * @param {string} imageBase64 
 * @param {string} folder 
 * @returns {Promise<string>} 
 
 */

export async function uploadImage(imageBase64, folder = "canchas") {
  try {
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: folder,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return result.secure_url; 
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    throw new Error("Error al subir la imagen");
  }
}

/**
  @param {string} imageUrl 
  @returns {Promise<void>}
 */

export async function deleteImage(imageUrl) {
  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1].split(".")[0]; // "abc"
    const folder = parts[parts.length - 2]; // "canchas"
    const publicId = `${folder}/${fileName}`; // "canchas/abc"
  

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error eliminando imagen de Cloudinary:", error);
  }
}

export default cloudinary;

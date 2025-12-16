const cloudinary = require("cloudinary").v2;

exports.uploadImage = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    options.resource_type = "auto";

    // ✅ Try tempFilePath first, fallback to Buffer (file.data)
    return await cloudinary.uploader.upload(
      file.tempFilePath || `data:${file.mimetype};base64,${file.data.toString("base64")}`,
      options
    );

  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};

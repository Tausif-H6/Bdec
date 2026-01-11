// utils/imageUtils.js
const fs = require("fs-extra");
const path = require("path");

class ImageUtils {
  // Generate URL for uploaded image
  static generateImageUrl(filename, req) {
    if (!filename) return null;

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}/uploads/products/${filename}`;
  }

  // Save base64 image
  static async saveBase64Image(base64String, productId) {
    if (!base64String) return null;

    try {
      // Extract image data from base64 string
      const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 string");
      }

      const imageType = matches[1];
      const imageData = matches[2];
      const buffer = Buffer.from(imageData, "base64");

      // Determine file extension
      const ext = imageType.split("/")[1] || "png";
      const filename = `product-${productId}-${Date.now()}.${ext}`;
      const filepath = path.join(__dirname, "../uploads/products", filename);

      // Save file
      await fs.writeFile(filepath, buffer);

      return {
        filename,
        filepath,
        mimeType: imageType,
      };
    } catch (error) {
      console.error("Error saving base64 image:", error);
      return null;
    }
  }

  // Delete image file
  static async deleteImage(filename) {
    if (!filename) return;

    try {
      const filepath = path.join(__dirname, "../uploads/products", filename);
      if (await fs.pathExists(filepath)) {
        await fs.remove(filepath);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  // Extract filename from URL
  static extractFilenameFromUrl(url) {
    if (!url) return null;
    const parts = url.split("/");
    return parts[parts.length - 1];
  }

  // Get image info from strImageLoc
  static parseImageLoc(imageLoc) {
    if (!imageLoc) return null;

    // Check if it's a URL
    if (imageLoc.startsWith("http")) {
      const filename = this.extractFilenameFromUrl(imageLoc);
      return {
        type: "url",
        filename: filename,
        url: imageLoc,
      };
    }

    // Check if it's a base64 string
    if (imageLoc.startsWith("data:image")) {
      return {
        type: "base64",
        data: imageLoc,
      };
    }

    // Assume it's a filename
    return {
      type: "filename",
      filename: imageLoc,
    };
  }
}

module.exports = ImageUtils;

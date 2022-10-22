"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
async function UploadImage(image) {
    const clientId = process.env.IMGUR_ID;
    const formData = new FormData();
    formData.append('image', image);
}
exports.default = UploadImage;
//# sourceMappingURL=uploadImage.js.map
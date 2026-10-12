import fs from "fs";

export const validate = (schema) => (req, res, next) => {
  try {
    const dataToValidate = { ...req.body };

    // Yeh automaticly multer ke fieldname (jaise "image") ko utha kar object mein dal dega
    if (req.file) {
      dataToValidate[req.file.fieldname] = req.file; 
    }

    req.body = schema.parse(dataToValidate);
    next();
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};
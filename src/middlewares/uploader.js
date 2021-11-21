import multer from 'multer';

const filename = (req, file, next) => {
  let lastIndexof = file.originalname.lastIndexOf("."); // we get the last index from . (.jpg/.png)
  let ext = file.originalname.substring(lastIndexof); // extension
  next(null, `img-${Date.now()}${ext}`);
};

const destination = (req, file, next) => {
  next(null, `${__dirname}/../uploads`);
};

const upload = multer({
  storage: multer.diskStorage({ destination, filename })
});

export default upload;
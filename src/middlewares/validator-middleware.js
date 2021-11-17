import {validationResult} from 'express-validator';

//create and export registration validation function
const validationMiddleware = (req,res,next) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.json({
      errors: errors.array()  
    });
  }
  next();
};
export default validationMiddleware;
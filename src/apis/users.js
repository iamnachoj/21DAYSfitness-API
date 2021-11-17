import {User} from '../models'
import {Router} from 'express';
import {validationResult} from 'express-validator';
import {RegisterValidations} from '../validators'

const router = Router();

/**
 * @description To create a new user account 
 * @access Public
 * @api /users/api/register
 * @type POST
 */
router.post('/api/register', RegisterValidations, async(req,res) => {
   let errors = validationResult(req);
   return res.json({
     errors: errors.array()  
   })
});

export default router;  
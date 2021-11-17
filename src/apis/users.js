import {User} from '../models';
import {Router} from 'express';
import {RegisterValidations} from '../validators';
import Validator from '../middlewares/validator-middleware';

const router = Router();

/**
 * @description To create a new user account 
 * @access Public
 * @api /users/api/register
 * @type POST
 */
router.post('/api/register', RegisterValidations, Validator, async(req,res) => {
   
});

export default router;  
import {Router} from 'express';
import {userAuth} from '../middlewares/auth-guard';
import uploader from '../middlewares/uploader';
const router = Router();

/**
 * @description To create profile of the authenticated User
 * @access Private 
 * @api /profile/api/create-profile
 * @type POST <multipart-form> request
 */

router.post('/api/create-profile', userAuth , uploader.single('avatar'), async (req,res) => {
 console.log(req.body);
 console.log(req.file)
 return res.status(201).json({
   message: 'TESTING'
 })
});
export default router;


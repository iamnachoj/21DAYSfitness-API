import {Router} from 'express';
import {Profile} from '../models';
import {userAuth} from '../middlewares/auth-guard';
import uploader from '../middlewares/uploader';
import consolaGlobalInstance from 'consola';
import {DOMAIN} from '../constants';
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
 try{
  let {body, file, user } = req;
  let path = DOMAIN + file.path.split('uploads')[1];
  let profile = new Profile({
    social: body,
    account: user._id,
    avatar: path
  });
  console.log('User profile: ', profile);
  res.json({
    message: "Testing correct"
  })
 }catch(err){
   consola.error(err)
 }
});
export default router;


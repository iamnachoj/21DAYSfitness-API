import {Router} from 'express';
import {Profile, User} from '../models';
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
  await profile.save();
  consola.success("sucessfully saved: " + profile)
  res.status(201).json({
    success: true,
    message: "Profile updated successfully"
  });
 }catch(err){
   consola.error(err);
   res.status(400).json({
    success: false,
    message: "Unable to update profile"
  });
 }
 
});

/**
 * @description To get the authenticated user's profile
 * @access Private 
 * @api /profile/api/my-profile
 * @type GET
 */

router.get('/api/my-profile', userAuth, async(req, res) =>{
  try {
    //the populate method allows to get information related to that specific field selected.
    //in this case, 'account', has many objects associated. We are taking name, email, username, challenges and createdAt from it
    let profile = await Profile.findOne({account: req.user._id }).populate('account', 'name email username challenges createdAt'); 
    if(!profile){
      return res.status(404).json({
        success: false,
        message: 'Profile is not available'
      });
    }
    return res.status(200).json({
      success: true,
      profile
    });
  }catch(err){
    return res.status(400).json({
      success: false,
      message: 'Unable to get the profile'
    });
  }
});

/**
 * @description To update the authenticated user's profile
 * @access Private 
 * @api /profile/api/update-profile
 * @type PUT <multipart-form> request
 */
 router.put('/api/update-profile', userAuth, uploader.single('avatar'), async(req, res) =>{
   try{
    let {body, file, user } = req;
    let path = DOMAIN + file.path.split('uploads')[1];
    let profile = await Profile.findOneAndUpdate({account: user._id }, {social: body, avatar: path}, {new: true});
    return res.status(200).json({
      success: true,
      message: 'Your profile has been updated successfully',
      profile
    });
   }catch(err){
    return res.status(400).json({
      success: false,
      message: 'Unable to get the profile'
    });
   }
 });

 /**
 * @description To get the user's profile with the username
 * @access Public 
 * @api /profile/api/update-profile
 * @type GET 
 */

 router.get('/api/profile-user/:username', async (req,res) => {
  try{
   let {username} = req.params;
   let user = await User.findOne({username});
   if(!user){
     return res.status(404).json({
       success: false,
       message: 'User not found.'
     });
   }
   let profile = await Profile.findOne({account: user._id});
   return res.status(200).json({
     success: true,
     profile: {
       ... profile.toObject(),
       account: user.getUserInfo()
     }
     
   })
  }catch(err){
    consola.error(err)
     return res.status(400).json({
       success: false,
       message: 'Oops. Something went wrong.'
     });
  }
 });

export default router;


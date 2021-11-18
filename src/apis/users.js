import {User} from '../models';
import {Router} from 'express';
import {join} from 'path';
import {randomBytes} from 'crypto';
import {AuthenticateValidations, RegisterValidations} from '../validators';
import Validator from '../middlewares/validator-middleware';
import sendMail from '../functions/email-sender';
import {DOMAIN} from '../constants/index'
import {userAuth} from '../middlewares/auth-guard';

const router = Router();

/**
 * @description To create a new user account 
 * @access Public
 * @api /users/api/register
 * @type POST
 */
router.post('/api/register', RegisterValidations, Validator, async(req,res) => {
  try {
    let {username, email} = req.body;
    // check if username is taken or not
    let user = await User.findOne({username});
    if(user){
      return res.status(400).json({
        success: false,
        message: 'That username is already taken'
      });
    }
    // check if email is taken or not
    user = await User.findOne({email});
    if(user){
      return res.status(400).json({
        success: false,
        message: 'That email is already registered. Did you forget the password? try resetting it'
      });
    }
    user = new User({
     ... req.body,
     verificationCode: randomBytes(20).toString('hex')
    });
    await user.save();
    //Once user is created, we send the email to the user with a verification link
    let html = `
    <div>
      <h1>hello ${username}</h1>
      <p>Please click the following link to verify your account</p>
      <a href="${DOMAIN}/users/verify-now/${user.verificationCode}">link to verify account. </a>
    </div>`
    await sendMail(user.email, 'Verify account', 'please verify your account', html )
    //...and the success response.
    return res.status(201).json({
      success: true,
      message: "Hurray! your account is created. Please, verify your email address."
    });
  } catch (err){
    return res.status(500).json({
      success: false,
      message: "An error occurred."
    });
  }
});

/**
 * @description To verify a new user's account via email
 * @access Public <only via email>
 * @api /users/verify-now/:verificationCode
 * @type GET
 */
router.get('/verify-now/:verificationCode', async (req, res) => {
  try {
    let {verificationCode} = req.params;
    let user = await User.findOne({verificationCode});
    if(!user){
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Invalid verification code.'
      });
    }
    user.verified = true;
    user.verificationCode = undefined;
    await user.save();
    return res.sendFile(join(__dirname, '../templates/verification-success.html'));
  }catch(err){
    consola.error(err)
     return res.sendFile(join(__dirname, '../templates/errors.html'))
  }
});

/**
 * @description To authenticate an user and get auth token (login)
 * @access Public
 * @api /users/api/authenticate
 * @type POST
 */
router.post('/api/authenticate', AuthenticateValidations , Validator, async(req,res) => {
  try{
    let {username, password } = req.body;
    let user = await User.findOne({username});
    if(!user){
      return res.status(404).json({
        success: false,
        message: "Username not found."
      });
    }
    if(!await user.comparePassword(password)){
      return res.status(401).json({
        success: false,
        message: "Incorrect Password"
      });
    }
    let token = await user.generateJWT();
    return res.status(200).json({
      success: true,
      user: user.getUserInfo(),
      token: `Bearer ${token}`,
      message: "Hurray! you are now logged in."
    });
  }catch(err){
    consola.error(err)
    return res.status(500).json({
      success: false,
      message: "An error occurred."
    });
  }
})

/**
 * @description To get the authenticate user's profile
 * @access Private
 * @api /users/api/authenticate
 * @type GET
 */
router.get('/api/authenticate',userAuth, async (req,res) => {
  return res.status(200).json({
   user: req.user
  })
})
export default router;  
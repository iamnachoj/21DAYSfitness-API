import {User} from '../models';
import {Router} from 'express';
import {join} from 'path';
import {randomBytes} from 'crypto';
import {AuthenticateValidations, RegisterValidations, ResetPassword} from '../validators';
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
    await sendMail(user.email, 'Verify account', 'please verify your account', html );
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
 * @access Private <only via email>
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
     return res.sendFile(join(__dirname, '../templates/errors.html'));
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
});

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
});

/**
 * @description To initiate the password reset process
 * @access Public 
 * @api /users/api/reset-password
 * @type PUT
 */
router.put('/api/reset-password', ResetPassword, Validator, async(req,res) => {
  try {
    let {email} = req.body;
    let user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        success:false,
        message: 'this email is not registered as an user.',
      });
    }
    user.generatePasswordReset();
    await user.save();
    let html = `
    <div>
      <h1>hello ${user.username}</h1>
      <p>Please click the following link to reset your password.</p>
      <p><b>Ignore this email</b> if you have not requested a password reset, .</p>
      <a href="${DOMAIN}/users/reset-password-now/${user.resetPasswordToken}">link to password reset process. </a>
    </div>`
    await sendMail(user.email, 'Reset Password', 'please reset your password', html );
    return res.status(200).json({
      success:true,
      message: 'Check the mailbox: you can reset the password in the new email we just sent',
    });
    } catch (err){
      consola.error(err)
      return res.status(500).json({
        success: false,
        message: "An error occurred."
      });
  } 
});


/**
 * @description to render reset password page
 * @access Private <only via email>
 * @api /users/reset-password-now/:resetPasswordToken
 * @type GET
 */
router.get('/reset-password-now/:resetPasswordToken', async(req,res)=> {
  try {
   let {resetPasswordToken} = req.params;
   let user = await User.findOne({resetPasswordToken, resetPasswordExpiresIn: { $gt: Date.now() }});
   if(!user){
     return res.status(401).json({
       success: false,
       message: "Password reset token is invalid or has expired."
     })
   }
   return res.sendFile(join(__dirname, '../templates/password-reset.html'));
  } catch (err){
    return res.sendFile(join(__dirname, '../templates/errors.html'));
  }
});

/**
 * @description to reset the password
 * @access Private <only via email>
 * @api /users/reset-password-now
 * @type POST
 */
router.post('/api/reset-password-now', async(req,res) => {
   try{
    let {resetPasswordToken, password} = req.body;
    let user = await User.findOne({
      resetPasswordToken, 
      resetPasswordExpiresIn: { $gt: Date.now() },
    });
    if(!user){
      return res.status(401).json({
        success: false,
        message: "Password reset token is invalid or has expired."
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresIn = undefined;
    await user.save();
    //send notification email about the password reset successful process
    let html = `
    <div>
      <h1>hello ${user.username}</h1>
      <p>Your password has been succesfuly changed!</p>
      <p>Please, contact us if this password reset has not been done by you.</p>
    </div>`
    await sendMail(user.email, 'Password successfuly changed', 'Your password has been changed', html );
    return res.status(200).json({
      success: true,
      message: 'Your password reset request has been successfuly completed.'
    });
   }catch(err){
     consola.error(err)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    })
   }
});

/**
 * @description endpoint that enables creating a new password
 * @access Private 
 * @api /users/reset-password-success
 * @type GET
 */
router.get('/')

export default router;  
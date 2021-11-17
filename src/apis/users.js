import {User} from '../models';
import {Router} from 'express';
import {randomBytes} from 'crypto';
import {RegisterValidations} from '../validators';
import Validator from '../middlewares/validator-middleware';
import sendMail from '../functions/email-sender';
import {DOMAIN} from '../constants/index'

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

export default router;  
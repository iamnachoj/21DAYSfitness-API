import {Schema, model} from 'mongoose';
import {compare, hash} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import {SECRET} from '../constants'
import {randomBytes} from 'crypto'
import {pick} from 'lodash'
import { check } from 'express-validator';

const UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationCode: {
      type: String,
      required: false
    },
    resetPasswordToken: {
      type: String,
      required: false
    },
    resetPasswordExpiresIn:{
      type: Date,
      required: false
    },
    challenges: {
      type: Array,
      default: [
        [
          {
            "day": "1",
            "completed": false,
            "routine": {}
          },
          {
            "day": "2",
            "completed": false,
            "routine": {}
          },
          {
            "day": "3",
            "completed": false,
            "routine": {}
          },
          {
            "day": "4",
            "completed": false,
            "routine": {}
          },
          {
            "day": "5",
            "completed": false,
            "routine": {}
          },
          {
            "day": "6",
            "completed": false,
            "routine": {}
          },
          {
            "day": "7",
            "completed": false,
            "routine": {}
          },
          {
            "day": "8",
            "completed": false,
            "routine": {}
          },
          {
            "day": "9",
            "completed": false,
            "routine": {}
          },
          {
            "day": "10",
            "completed": false,
            "routine": {}
          },
          {
            "day": "11",
            "completed": false,
            "routine": {}
          },
          {
            "day": "12",
            "completed": false,
            "routine": {}
          },
          {
            "day": "13",
            "completed": false,
            "routine": {}
          },
          {
            "day": "14",
            "completed": false,
            "routine": {}
          },
          {
            "day": "15",
            "completed": false,
            "routine": {}
          },
          {
            "day": "16",
            "completed": false,
            "routine": {}
          },
          {
            "day": "17",
            "completed": false,
            "routine": {}
          },
          {
            "day": "18",
            "completed": false,
            "routine": {}
          },
          {
            "day": "19",
            "completed": false,
            "routine": {}
          },
          {
            "day": "20",
            "completed": false,
            "routine": {}
          },
          {
            "day": "21",
            "completed": false,
            "routine": {}
          }
        ]
      ]
    }
  },
  {timestamps:true}
);

UserSchema.pre('save', async function(next){
  let user = this;
  if(!user.isModified('password')) return next();
  user.password = await hash(user.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return await compare(password, this.password);
};

UserSchema.methods.generateJWT = async function(){
  let payload = {
    username: this.username,
    email: this.email,
    name: this.name,
    id: this._id
  }
  return await sign(payload, SECRET, {expiresIn: '1 day'});
};

UserSchema.methods.generatePasswordReset = function(){
  this.resetPasswordExpiresIn = Date.now() + 36000000;
  this.resetPasswordToken = randomBytes(20).toString('hex');
};

UserSchema.methods.getUserInfo = function() {
  return pick(this, ['_id', 'username', 'email', 'name', 'verified', 'challenges' ])
};

const User = model('users', UserSchema);
export default User;
import {check} from 'express-validator';
import { isLength } from 'lodash';

const name = check('name', 'Name is required.').not().isEmpty();
const username = check('username', 'Username is required.').not().isEmpty();
const email = check('email', 'please provide a valid email address').isEmail();
const password = check('password', 'Password is required. Minimum 6 characters').isLength({min: 6})

export const RegisterValidations = [password, name, username, email];
export const AuthenticateValidations = [username, password]
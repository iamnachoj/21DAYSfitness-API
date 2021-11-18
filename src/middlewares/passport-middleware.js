import passport from 'passport';
import {User} from '../models';
import {SECRET as secretOrKey} from '../constants';
import {Strategy, ExtractJwt} from 'passport-jwt';

const opts = {
  secretOrKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Authorization in header
};

passport.use(
  new Strategy(opts, async ({id}, done) => {
    try{
      let user = await User.findById(id);
      if(!user){
        throw new Error('User not found.')
      }
      return done(null, user.getUserInfo());
    }catch (err){
       consola.error(err)
       done(null, false)
    }
  })
);
import {Schema, model} from 'mongoose';

const ProfileSchema = new Schema({
    account: { // this will refer to the User Schema, with type object id and ref: to users.
      ref: 'users',
      type: Schema.Types.ObjectId
    },
    avatar: {
      type: String,
      required: false
    },
    social : {
      facebook: {
        type: String,
        required: false
      },
      instagram: {
        type: String,
        required: false
      }

    }
}, {timestamps : true})

const Profile = model('profiles', ProfileSchema);
export default Profile;
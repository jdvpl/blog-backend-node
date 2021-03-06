const {Schema,model}= require('mongoose');
const bcrypt=require('bcryptjs');

const UserSchema=Schema({
  firstName:{
    type:String,
    required:[true,'First name is required'],
    trim:true
  },
  lastName:{
    type:String,
    required:[true,'Lastname is required'],
    trim:true
  },
  profilePhoto:{
    type:String,
    default:'https://res.cloudinary.com/jdvpl/image/upload/v1656359029/man-g761407816_1280_r08dyd.png'
  },
  email:{
    type:String,
    required:[true,'Email is required'],
    unique:[true,'Email already exists']
  },
  bio:{
    type:String,
  },
  password:{
    type:String,
    required:[true,'Password is required'],
    trim:true
  },
  postCount:{
    type:Number,
    default:0
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
  isAdmin:{
    type:Boolean,
    default:false,
  },
  role:{
    type:String,
    enum:['ADMIN','GUEST','BLOGGER'],
  },
  isFollowing:{
    type:Boolean,
    default:false
  },
  isUnFollowing:{
    type:Boolean,
    default:false
  },
  isAccountVerified:{
    type:Boolean,
    default:false
  },
  accountVerificationToken:{
    type:String,
  },
  accountVerificationTokenExpires:{
    type:Date,
  },
  viewedBy:{
    type:[
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },

  followers:{
    type:[
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  following:{
    type:[
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  passwordChangedAt:{
    type:Date,
  },
  passwordResetToken:{
    type:String,
  },
  passwordResetExpires:{
    type:Date,
  },
  active:{
    type:Boolean,
    default:false
  },
},
{
  toJSON:{
    virtuals:true,
  },
  toObject:{
    virtuals:true
  },
  timestamps:true
}
)

UserSchema.pre('save',async function(next) {
  if(!this.isModified('password')){
    next();
  }
  const salt= await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);
})



UserSchema.methods.toJSON=function(){
  const {__v,password,_id,...user}=this.toObject();
  user.id=_id;
  return user
}

module.exports=model('User',UserSchema);
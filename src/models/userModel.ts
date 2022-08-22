import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
const validator = require('validator');
// type verifyPasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

export type UserDocument = Document & {
  name: string;
  email: string;
  googleId?: string;
  password: string | undefined;
  confirmPassword?: string | undefined;
  isAdmin: boolean | undefined;
  // verifyPassword: verifyPasswordFunction;
  photos?: string;
  friends: [];
};

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is a required field'],
    },
    email: {
      type: String,
      required: [true, 'Email is a required field'],
      validate: [validator.isEmail, 'Please enter a valid email'],
      unique:true,
      lowercase:true
    },
    googleId: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    confirmPassword: {
      type: String,
    },
    isAdmin: { type: Boolean, default: false, select: false },
    photos: { type: String, default: 'user.png' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const SALT_WORK_FACTOR = 10;
  if (!this.password) return next();
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

  const hash = await bcrypt.hash(this.password, salt); // Property 'password' does not exist on type 'Document<any>'.

  this.password = hash; // Property 'password' does not exist on type 'Document<any>'.

  next();
});

// const verifyPassword: verifyPasswordFunction = function (this: UserDocument, candidatePassword, cb) {

//   bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
//       cb(err, isMatch);
//   });
// };

// userSchema.methods.verifyPassword = verifyPassword;

const User = mongoose.model('User', userSchema);

export default User;

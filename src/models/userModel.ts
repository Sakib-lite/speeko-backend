import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// type verifyPasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

export type UserDocument = Document & {
  name: string;
  email: string;
  googleId?: string;
  password: string ;
  confirmPassword?: string | undefined;
  isAdmin: boolean | undefined;
  // verifyPassword: verifyPasswordFunction;
  photos?: string;
};

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: [true, 'Name is a required field'],
  },
  email: { type: String, required: [true, 'Email is a required field'] },
  googleId: {
    type: String,
  },
  password: {
    type: String,
    select: process.env.NODE_ENV === 'development',
  },
  confirmPassword: {
    type: String,
  },
  isAdmin: { type: Boolean, default: false, select: false },
  photos: { type: String, default: 'user.png' },
});

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

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  email:{ type: String, required: true, unique: true },
  password:{ type: String, required: true },
  verifyOtp:{ type: String, default: "" },
  verifyOtpExpire:{ type: Date, default: 0 },
  isAccountVerified:{ type: Boolean, default: false },
  resetOtp:{ type: String, default: "" },
  resetOtpExpire:{ type: Date, default: 0 },
})

const userModel = mongoose.models.users || mongoose.model('users', userSchema);

export default userModel;
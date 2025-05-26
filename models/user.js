const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'partner', 'admin'],
    default: 'client'
  },
  otpCode: {
    type: String,
    select: false
  },
  otpExpire: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP
UserSchema.methods.generateOTP = function() {
  // Generate a 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP
  const salt = bcrypt.genSaltSync(10);
  this.otpCode = bcrypt.hashSync(otp, salt);

  // Set expire time - 10 minutes
  this.otpExpire = Date.now() + 10 * 60 * 1000;

  return otp;
};

// Verify OTP
UserSchema.methods.verifyOTP = async function(enteredOTP) {
  if (Date.now() > this.otpExpire) {
    return false;
  }
  return await bcrypt.compare(enteredOTP, this.otpCode);
};

module.exports = mongoose.model('User', UserSchema);
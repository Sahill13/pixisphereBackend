const User = require('../models/user');

// Generate and send OTP to user
exports.generateAndSendOTP = async (userId) => {
  try {
    const user = await User.findById(userId).select('+otpCode +otpExpire');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate OTP
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });
    
    // In a real application, you would send this OTP via SMS or email
    // For this mock implementation, we'll just return it
    return otp;
  } catch (error) {
    console.error('OTP Generation Error:', error);
    throw error;
  }
};

// Verify OTP
exports.verifyOTP = async (userId, otp) => {
  try {
    const user = await User.findById(userId).select('+otpCode +otpExpire');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValid = await user.verifyOTP(otp);
    
    if (isValid) {
      // Clear OTP after successful verification
      user.otpCode = undefined;
      user.otpExpire = undefined;
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('OTP Verification Error:', error);
    throw error;
  }
};
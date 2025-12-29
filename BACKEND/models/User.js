// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   fullname: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     unique: true,
//   },
//   phone: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//    default: 'Krutanic@123',
//   },
//   status: {
//     type: String,
//     default: 'active',
//   },
//   otp: {
//     type: String,
//   },
//   otpExpires: {
//     type: Date,
//   },
//   // pdfUrl: {
//   //   type: String, 
//   // },
// });

// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: 'Krutanic@123',
  },
  status: {
    type: String,
    default: 'active',
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  pdfUrl: {
    type: String, 
  },
  jobResume: {
    type: String,
  },
// components 
  atschecker: {
    type: Boolean,
    default: false,
  },
  jobboard: {
    type: Boolean,
    default: false,
  },
  myjob: {
    type: Boolean,
    default: false,
  },
  mockinterview: {
    type: Boolean,
    default: false,
  },
  exercise: {
    type: Boolean,
    default: false,
  }
},
);

module.exports = mongoose.model('User', userSchema);
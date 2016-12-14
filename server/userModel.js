var mongoose = require('mongoose');

// define user schema
var userSchema = mongoose.Schema()
userSchema.add({
  token: String, // facebook token
  id: String, // facebook id
  name: String, // facebook display name
  phoneNumber: String, // user phone number
  buddyName: String,  // accountability buddy name
  buddyPhone: String,  // accountability buddy phone number
  goal: String,  // user goal
  responses: Array,  // user response history
  grade: Number,  // user grade (0-100)
  harassUser: Boolean,  // flag for if user should be harassed
  harassBuddy: Boolean,  // flag for if user's buddy should be harassed
  friends: [userSchema] //array of users who chose this user as their buddy
});

module.exports = mongoose.model('user', userSchema);

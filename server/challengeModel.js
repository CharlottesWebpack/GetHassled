var mongoose = require('mongoose');

var challengeSchema = mongoose.Schema({
  challengeGoal: String,
  challenger1: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  challenger2: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
});

module.exports = mongoose.model('Challenge', challengeSchema);

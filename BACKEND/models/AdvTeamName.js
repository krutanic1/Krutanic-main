const mongoose = require('mongoose');

const advTeamSchema = new mongoose.Schema({
  teamname: { type: String, unique: true, uppercase: true, required: true,},
  target:[{ currentMonth: { type: String }, targetValue: { type: String } , payments: { type: String }, }],
});

module.exports = mongoose.model('AdvTeamName', advTeamSchema);

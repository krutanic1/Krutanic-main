const mongoose = require('mongoose');

const MarketingTeamNameSchema = new mongoose.Schema({
  teamname: { type: String, unique: true, uppercase: true, required: true,},
});

module.exports = mongoose.model('MarketingTeamName', MarketingTeamNameSchema);
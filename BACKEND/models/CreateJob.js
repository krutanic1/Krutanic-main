const mongoose = require("mongoose");

const CreateJobSchema = new mongoose.Schema({
    title: { type: String },
    company: { type: String },
    expiryDate: { type: String },
    description: { type: String },
},
{
    timestamps: true,
}
);

const CreateJob = mongoose.model("CreateJob", CreateJobSchema);

module.exports = CreateJob;

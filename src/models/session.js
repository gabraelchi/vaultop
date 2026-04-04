import mongoose from "mongoose"

const MaterialSchema = new mongoose.Schema({
name: String,
issued: Number,
used: Number,
balance: Number
})

const SessionSchema = new mongoose.Schema({

/* CORE */
machineId: {
type: String,
required: true
},

operator: {
type: String,
required: true
},

material: {
type: String,
required: true
},

kg: {
type: Number,
required: true
},

/* OUTPUT */
expectedOutput: Number,
actualOutput: Number,

/* PERFORMANCE */
efficiency: Number,
margin: Number,

/* MATERIAL BREAKDOWN (FROM SHEET) */
materials: [MaterialSchema],

/* WASTE */
waste: {
type: Number,
default: 0
},

/* EXTRA OUTPUT DETAILS */
outputDetails: {
units: Number,
length: Number
},

/* SESSION STATE */
status: {
type: String,
enum: ["idle","running","completed"],
default: "idle"
},

/* REMARKS */
remarks: String,

/* TIME */
startTime: Date,
endTime: Date

},{
timestamps: true
})

export default mongoose.models.Session ||
mongoose.model("Session", SessionSchema)
import mongoose from "mongoose"

const ProductionSchema = new mongoose.Schema({

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

  expectedOutput: {
    type: Number,
    default: 0
  },

  actualOutput: {
    type: Number,
    default: 0
  },

  waste: {
    type: Number,
    default: 0
  },

  efficiency: {
    type: Number,
    default: 0
  },

  margin: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    default: "running"
  },

  remarks: {
    type: String,
    default: ""
  },

  startTime: Date,
  endTime: Date

}, { timestamps: true })

export default mongoose.models.Production ||
mongoose.model("Production", ProductionSchema)
import mongoose from "mongoose"
import { unique } from "next/dist/build/utils"

const OperatorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  machineCode: { type: String, required: true, unique : true },
  pinHash: { type: String, required: true },
  role: {
      type: String,
      enum: ["operator", "supervisor", "admin"],
      default: "operator"
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)
export default mongoose.models.Operator ||
  mongoose.model("Operator", OperatorSchema)
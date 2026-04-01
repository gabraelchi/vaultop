import mongoose from "mongoose"

const ProductionSchema = new mongoose.Schema(
  {
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator" },
    machineCode: String,
    quantity: Number,
    shift: String
  },
  { timestamps: true }
)

export default mongoose.models.Production ||
  mongoose.model("Production", ProductionSchema)
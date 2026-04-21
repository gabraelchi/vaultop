import mongoose from "mongoose"

const CompanySchema = new mongoose.Schema({
  companyId: {
    type: String,
    unique: true,
    required: true
  },

  companyName: {
    type: String,
    required: true
  }

}, { timestamps: true })

export default mongoose.models.Company || mongoose.model("Company", CompanySchema)
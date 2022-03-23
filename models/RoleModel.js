import mongoose from "mongoose";

const Role = new mongoose.Schema({
    value: {type: String, default: 'USER', unique: true},
})

export default mongoose.model('Role', Role)
// import { timeStamp } from "console";
import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true});

export default mongoose.models.User || mongoose.model("User",UserSchema);
import mongoose from "mongoose";

const MessageSchema=new mongoose.Schema({
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    question:{
        type:String,
        required:true,
        
    },
    answer:{
        type:String,
        required:true
    }
},{timestamps:true});

export default mongoose.models.Message || mongoose.model("Message",MessageSchema);
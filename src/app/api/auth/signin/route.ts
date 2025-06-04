
import User from "../../../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import dbConnect from "../../../../../lib/db";

export async function POST(req:Request){
    try{

        await dbConnect()
        const {email,password}=await req.json();
        if(!email || !password){
            return NextResponse.json({message:"email or password required"},{status:400});
        }
        const userExist=await User.findOne({email});
        if(!userExist){
            return NextResponse.json({message:"User doesn't exist"},{status:404});
        }
        
        const isMatched=await bcrypt.compare(password,userExist.password);
        if(!isMatched){
            return NextResponse.json({message:"Incorrect Password"},{status:404});
        }
        return NextResponse.json({message:"login successful"},{status:200})

    }
    catch(error){
        return NextResponse.json({message:error},{status:500})

    }
}
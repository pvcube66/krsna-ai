import Chat from "../../../../../models/Chat";
import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const response = await Chat.findOne({ userId });
    return NextResponse.json({ message: response }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

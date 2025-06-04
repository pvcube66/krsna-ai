import { NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import Chat from "../../../../../models/Chat";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "UserId is required" }, { status: 400 });
    }

    const newChat = await Chat.create({ userId: userId, messages: [] });
    return NextResponse.json({ chat: newChat }, { status: 201 });
  } catch (error) {
    console.error("Create Chat error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

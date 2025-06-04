import dbConnect from "../../../../../lib/db";
import Chat from "../../../../../models/Chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { chatId } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { message: "chatId is required" },
        { status: 400 }
      );
    }

    const response = await Chat.findById(chatId);

    if (!response) {
      return NextResponse.json(
        { message: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ messages: response.messages }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal Server Error", error: err },
      { status: 500 }
    );
  }
}

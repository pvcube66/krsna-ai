import Chat from "../../../../../models/Chat";
import { NextResponse } from "next/server";
import axios from "axios";
import dbConnect from "../../../../../lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { userId, question, chatId } = await req.json();

    if (!userId || !chatId || !question) {
      return NextResponse.json({ message: "Important fields missing" }, { status: 400 });
    }

    const systemPrompt =process.env.SYSTEM_PROMPT;

    // Combine system prompt and question into a single text field
    const combinedPrompt = `${systemPrompt}\n\n${question}`;

    const geminiRequestBody = {
      contents: [
        {
          parts: [
            { text: combinedPrompt }
          ],
        },
      ],
    };

    // Ensure environment variables are defined
    if (!process.env.GEMINI_URL || !process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_URL or GEMINI_API_KEY in environment variables");
    }

    // Construct URL correctly with ? for query parameter
    const apiUrl = `${process.env.GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`;
    console.log("Constructed API URL:", apiUrl); // Log URL for debugging

    // Log request body for debugging
    console.log("Gemini API request body:", geminiRequestBody);

    // Make the API call
    const response = await axios.post(apiUrl, geminiRequestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log response for debugging
    console.log("Gemini API response:", response.data);

    // Extract answer, with fallback
    const answerText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer from AI";

    const currentChat = await Chat.findById(chatId);
    if (!currentChat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    currentChat.messages.push({
      question,
      answer: answerText,
    });

    await currentChat.save();

    return NextResponse.json({ message: answerText }, { status: 200 });
  } catch (err) {
    console.error("Error in chat route:", err);
    // Check if error is from Axios and include detailed error info
    if (axios.isAxiosError(err)) {
      console.error("Gemini API error details:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
        code: err.code,
        rawResponse: err.response, // Log raw response for deeper insight
      });
      return NextResponse.json(
        {
          message: "Gemini API error",
          error: {
            status: err.response?.status,
            data: err.response?.data || "No error data provided by API",
            message: err.message,
            code: err.code,
          },
        },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}   
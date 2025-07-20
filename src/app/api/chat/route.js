/*import { NextResponse } from 'next/server';
import { HuggingFaceAPI } from '../../../lib/huggingface';

export async function POST(request) {
  try {
    const { messages, model = 'microsoft/DialoGPT-medium' } = await request.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json({ message: 'Hugging Face API key not configured' }, { status: 500 });
    }

    const hfAPI = new HuggingFaceAPI(process.env.HUGGINGFACE_API_KEY);
    const response = await hfAPI.chat(messages, model);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Error generating response' }, { status: 500 });
  }
}}*/
'use server';

import { validateToken } from '@/lib/auth';
import {
  uploadPodcast,
  transcribePodcast,
  summarisePodcast,
  generatePodcastImage,
} from '@/lib/data/chat/apps/podcast';
import { getChat } from '@/lib/data/chat';

export async function onGuessDrawing(drawingData: string) {
  const token = await validateToken();
  if (!token) {
    throw new Error('No token found');
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8787'
      : 'https://assistant.nicholasgriffin.workers.dev';

  const base64Data = drawingData.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64Data, 'base64');
  const blob = new Blob([binaryData], { type: 'image/png' });

  const formData = new FormData();
  formData.append('drawing', blob, 'drawing.png');

  const res = await fetch(`${baseUrl}/apps/guess-drawing`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'NGWeb',
    },
    body: formData,
  });

  if (!res.ok) {
    console.error('Failed to submit for guess drawing', res);
    throw new Error('Failed to submit for guess drawing');
  }

  const data = await res.json();
  return data;
}

export async function onGenerateDrawing(drawingData: string) {
  const token = await validateToken();
  if (!token) {
    throw new Error('No token found');
  }

  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8787'
      : 'https://assistant.nicholasgriffin.workers.dev';

  const base64Data = drawingData.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64Data, 'base64');
  const blob = new Blob([binaryData], { type: 'image/png' });

  const formData = new FormData();
  formData.append('drawing', blob, 'drawing.png');

  const res = await fetch(`${baseUrl}/apps/drawing`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'NGWeb',
    },
    body: formData,
  });

  if (!res.ok) {
    console.error('Failed to submit drawing', res);
    throw new Error('Failed to submit drawing');
  }

  const data = await res.json();
  return data;
}

export async function onUploadPodcast(audioUrl) {
  const token = await validateToken();
  if (!token) {
    throw new Error('No token found');
  }

  const response = await uploadPodcast({
    token,
    audioUrl,
  });

  if (!response) {
    throw new Error('No response from the model');
  }

  return response;
}

export async function onTranscribePodcast(
  chatId: string,
  prompt: string,
  numberOfSpeakers: number
) {
  const token = await validateToken();
  if (!token) {
    throw new Error('No token found');
  }

  const response = await transcribePodcast({
    token,
    chatId,
    prompt,
    numberOfSpeakers,
  });

  if (!response) {
    throw new Error('No response from the model');
  }

  return response;
}

export async function onGetChat(chatId: string) {
  const token = await validateToken();
  if (!token) {
    console.error('No token found');
    return [];
  }

  const chatMessages = await getChat({ token, id: chatId });
  return Array.isArray(chatMessages) ? chatMessages : [];
}

export async function onSummarisePodcast(
  chatId: string,
  speakers: Record<string, string>
) {
  const token = await validateToken();
  if (!token) {
    throw new Error('No token found');
  }

  const response = await summarisePodcast({
    token,
    chatId,
    speakers,
  });

  if (!response) {
    throw new Error('No response from the model');
  }

  return response;
}

export async function onGeneratePodcastImage(chatId: string) {
  const token = await validateToken();
  if (!token) {
    throw new Error('No token found');
  }

  const response = await generatePodcastImage({
    token,
    chatId,
  });

  if (!response) {
    throw new Error('No response from the model');
  }

  return response;
}

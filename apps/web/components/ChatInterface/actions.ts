'use server';

import { validateToken } from '@/lib/auth';
import {
  uploadPodcast,
  transcribePodcast,
  summarisePodcast,
  generatePodcastImage,
} from '@/lib/data/chat/apps/podcast';
import { getChat } from '@/lib/data/chat';

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

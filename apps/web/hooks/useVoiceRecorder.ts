import { useState, useRef } from "react";

interface UseVoiceRecorderProps {
	onTranscribe: (audioBlob: Blob) => Promise<string>;
}

export function useVoiceRecorder({ onTranscribe }: UseVoiceRecorderProps) {
	const [isRecording, setIsRecording] = useState(false);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (e) => {
				chunksRef.current.push(e.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
				setIsTranscribing(true);
				try {
					const transcription = await onTranscribe(audioBlob);
					// Handle transcription if needed
				} finally {
					setIsTranscribing(false);
				}
			};

			mediaRecorder.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Error starting recording:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
			setIsRecording(false);
		}
	};

	return {
		isRecording,
		isTranscribing,
		startRecording,
		stopRecording,
	};
}

---
title: "Anyone Can Draw"
date: "2024-12-01T21:51"
tags: [ai, cloudflare, cloudflare-ai]
description: "Anyone can draw" is quite an old statement, some people agree with it and some don't, but it got me thinking, wouldn't it be cool if there was an app where you could draw something and then AI would guess what you drew and even generate a picture at the end? That would truly make it so that anyone can draw. And that's what this blog post is about.
image: /uploads/anyone-can-draw/guesses.png
imageAlt: A screenshot of the app displaying the user's drawing alongside the guesses that the AI has made.
hideFeaturedImage: true
---

To get started, I needed to create a new interface where a user could draw on a canvas. It would need a few features:

- A canvas for drawing
- Options to select your brush size and colour
- Options to select if you want a brush or fill tool
- An undo and redo button
- A button to clear the canvas
- A button to submit the drawing

Thankfully, this isn't as complex as it might sound, first we need to create a canvas element:

```typescript
export function Canvas({
  canvasRef,
  isFillMode,
  currentColor,
  lineWidth,
  saveToHistory,
  onDrawingComplete,
}: CanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  ...

  return (
    <div className="relative w-full aspect-square">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="absolute top-0 left-0 w-full h-full border border-gray-200 rounded-lg cursor-crosshair bg-[#f9fafb] shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
```

This will render a canvas that will call a series of functions when the user interacts with it, for example, when the user clicks down on the canvas, the `startDrawing` function will be called.

```typescript
const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (isFillMode) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      floodFill(imageData, Math.round(x), Math.round(y), currentColor);
      ctx.putImageData(imageData, 0, 0);
      saveToHistory();
      return;
    }

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentColor;
    ctx.moveTo(x, y);
};
```

This will start the drawing process, then when the user moves their mouse, the `draw` function will be called.

```typescript
const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastX(x);
    setLastY(y);
};
```

This will draw a line from the last point to the current point on the canvas. Releasing the mouse or leaving the canvas will call the `handleMouseUp` function.

```typescript
  const handleMouseUp = () => {
    setIsDrawing(false);
    saveToHistory();
    onDrawingComplete?.();
};
```

This will stop the drawing process and save the drawing to the history. With that and a few other elements, we have an interface like this:

![A screenshot of the drawing interface](/uploads/anyone-can-draw/drawing.png)

(I didn't want to bore you with too much code, you can find the rest of the code for [this component here](https://github.com/nicholasgriffintn/website/tree/main/apps/web/components/DrawingCanvas).)

## Generating a painting from the drawing

The next step that I wanted to work on was to generate a painting from the drawing, this was the part that I did before I figured making a game would be a cool idea.

To do this, I made a new route in my Assistant API that would upload the drawing to R2, generate a description for it, generate a painting from the description, upload the painting to R2, and then return the URL of the painting.

First step is the upload the drawing:

```typescript
const arrayBuffer = await request.drawing.arrayBuffer();
	const length = arrayBuffer.byteLength;

	const drawingId = Math.random().toString(36);
	const drawingImageKey = `drawings/${drawingId}/image.png`;

	let drawingUrl;
	try {
		drawingUrl = await env.ASSETS_BUCKET.put(drawingImageKey, arrayBuffer, {
			contentType: 'image/png',
			contentLength: length,
		});
	} catch (error) {
		console.error(error);
		throw new AppError('Error uploading drawing', 400);
	}
```

Then we use the [`@cf/llava-hf/llava-1.5-7b-hf`](https://developers.cloudflare.com/workers-ai/models/llava-1.5-7b-hf/) model on Cloudflare AI to generate a description for the drawing:

```typescript
const descriptionRequest = await env.AI.run(
		'@cf/llava-hf/llava-1.5-7b-hf',
		{
			prompt: `You are an advanced image analysis AI capable of providing accurate and concise descriptions of visual content. Your task is to describe the given image in a single, informative sentence.

Instructions:
1. Carefully analyze the image content.
2. Identify key elements, shapes, objects, or patterns present in the image.
3. Pay special attention to distinguishable features, even if the image appears mostly dark or monochromatic.
4. Formulate a single sentence that accurately describes the main elements of the image.

Your final output should be a single sentence describing the image.

Example output structure:

[A single sentence describing the main elements of the image]`,
			image: [...new Uint8Array(arrayBuffer)],
		},
		{
			gateway: {
				id: gatewayId,
				skipCache: false,
				cacheTtl: 3360,
				metadata: {
					email: user?.email,
				},
			},
		}
	);
```

From that, we use [@cf/runwayml/stable-diffusion-v1-5-img2img](https://developers.cloudflare.com/workers-ai/models/stable-diffusion-v1-5-img2img/) to generate a painting from that description and the originally provided drawing:

```typescript
const painting = await env.AI.run(
		'@cf/runwayml/stable-diffusion-v1-5-img2img',
		{
			prompt: descriptionRequest?.description || 'Convert this drawing into a painting.',
			image: [...new Uint8Array(arrayBuffer)],
			guidance: 8,
			strength: 0.85,
			num_inference_steps: 50,
		},
		{
			gateway: {
				id: gatewayId,
				skipCache: false,
				cacheTtl: 3360,
				metadata: {
					email: user?.email,
				},
			},
		}
	);
```

These are possibly not the best two models, however, they are the ones available directly through Cloudflare AI, so it was easier to get started with, in the future, I plan to add functionality to let users choose which model to use.

But with that, we then just output the uploaded drawing and painting to the user:

![A screenshot of the app displaying the user's drawing alongside the guesses that the AI has made](/uploads/anyone-can-draw/generation.png)

Pretty cool, right? You can find the [rest of the code for this here](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/apps/drawing.ts).

## Building the game

I probably could have (and maybe should have) stopped there, but I was having a lot of fun and had a thought about those guessing games that you play during ice breakers.

Each user gets a turn to draw something and then the rest of the users have to guess what the drawing is, it's a bit of fun and I thought, what if you could do the same but with AI?

So to start that off, I made another new [route that will guess the drawing](https://github.com/nicholasgriffintn/assistant/blob/main/src/services/apps/guess-drawing.ts). This is pretty similar, however, this time we just have a slightly different prompt.

```typescript
const guessRequest = await env.AI.run(
		'@cf/llava-hf/llava-1.5-7b-hf',
		{
			prompt: `You will be provided with a description of an image. Your task is to guess what the image depicts using only one word. Follow these steps:

1. Carefully review the image provided.

2. Based on the image, think about the most likely object, animal, place, food, activity, or concept that the image represents.

3. Choose a single word that best describes or identifies the main subject of the image.

4. Provide your guess as a single word response. Do not include any explanations, punctuation, or additional text.

IMPORTANT: Do not use any of these previously guessed words: ${Array.from(usedGuesses).join(', ')}

Your response should contain only one word, which represents your best guess for the image described. Ensure that your answer is concise and accurately reflects the main subject of the image.`,
			image: [...new Uint8Array(arrayBuffer)],
		},
		{
			gateway: {
				id: gatewayId,
				skipCache: false,
				cacheTtl: 3360,
				metadata: {
					email: user?.email,
				},
			},
		}
	);
```

Then it was just a case of building in the UI and logic for the game.

### Game State Management

To start, I thought of the features that I wanted the game to have:

- A countdown timer for each turn (this will be 2 minutes to start)
- Real-time guesses from the AI
- Success and failure messages
- A log of all the guesses

To track that, I made a quick hook to manage the state of the game:

```typescript
export function useGameState(
  onGuess?: (drawingData: string) => Promise<any>,
  clearCanvas?: () => void
) {
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    targetWord: '',
    timeRemaining: GAME_DURATION,
    guesses: [],
    hasWon: false,
  });

  const timerRef = useRef<NodeJS.Timeout>();
  const guessTimeoutRef = useRef<NodeJS.Timeout>();
```

When the user starts the game, the `startGame` function will be called:

```typescript
const startGame = () => {
    const randomWord =
      GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
    if (!randomWord) return;

    clearCanvas?.();

    setGameState({
      isActive: true,
      targetWord: randomWord,
      timeRemaining: GAME_DURATION,
      guesses: [],
      hasWon: false,
      statusMessage: undefined,
    });
  };
```

Then as the AI sends guesses, the `handleGuess` function will be called:

```typescript
const handleGuess = async (drawingData: string) => {
    if (!gameState.isActive || !onGuess) return;

    try {
      const response = await onGuess(drawingData);
      const guess = response?.response?.content?.toLowerCase() || '';

      setGameState((prev) => {
        const newGuesses = [...prev.guesses, { guess, timestamp: Date.now() }];

        const hasWon = guess.includes(prev.targetWord.toLowerCase());
        if (hasWon) {
          const timeSpent = GAME_DURATION - prev.timeRemaining;
          endGame();
          return {
            ...prev,
            guesses: newGuesses,
            hasWon,
            statusMessage: {
              type: 'success',
              message: `Congratulations! The AI guessed "${prev.targetWord}" in ${timeSpent} seconds!`,
            },
          };
        }

        return { ...prev, guesses: newGuesses, hasWon };
      });
    } catch (error) {
      console.error('Error getting AI guess:', error);
    }
  };
```

If time runs out and the AI hasn't guessed the word, we will end the game and display a failure message.

```typescript
const endGame = () => {
    setGameState((prev) => ({ ...prev, isActive: false }));
    if (timerRef.current) clearInterval(timerRef.current);
    if (guessTimeoutRef.current) clearTimeout(guessTimeoutRef.current);
};

useEffect(() => {
    if (gameState.isActive && gameState.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            endGame();
            return {
              ...prev,
              timeRemaining: 0,
              statusMessage: {
                type: 'failure',
                message: `Time's up! The word was "${prev.targetWord}". Better luck next time!`,
              },
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isActive]);
```

### The word list

We needed a list of words that the user would be given to draw from, I did a bit of googling for Pictionary words and after a few likes [this is the list I ended up with](https://github.com/nicholasgriffintn/website/blob/main/apps/web/components/DrawingCanvas/constants.ts#L30).

There's a mix of common and uncommon words, some are even quite abstract, I think that's what makes it fun, in the future, we might want to source this from users, maybe store it in a database rather than in code, but for now, this works.

### The UI

Then we just needed to link it together, in the previous component, I added a new section to the right of the canvas that will display a start button.

When the user clicks the start button, we will start the game and display the countdown timer, the AI's guesses will be displayed as they come in.

Here's a look at the final result:

![A screenshot of the app displaying the user's drawing alongside the guesses that the AI has made](/uploads/anyone-can-draw/guesses.png)

And then depending on if the AI guessed the word or not, we will display a success or failure message.

![A screenshot of the app displaying the success or failure message](/uploads/anyone-can-draw/end.png)

## Next steps

I'm quite happy with this all in all, but there are a few improvements that I'd like to make as well as opportunities to use some other tech.

- Add the ability to choose which model to use (this will make it easy for me to test new ones)
- Store a history of games and drawings in the database
- Add in some sort of multiplayer functionality ([I'd like to check our Durable Objects](https://developers.cloudflare.com/durable-objects/)).
- Add a leaderboard
- Track scores
- Create stages so the person who draws is changed each round.
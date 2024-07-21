"use client";

import { useState } from "react";
import Typed from "react-typed";
import { animateScroll as scroll } from "react-scroll";

export function Hero() {
	const [hasScrolled] = useState(false);
	const [showScroller, setShowScroller] = useState(false);
	const [typedInitialComplete, setTypedInitialComplete] = useState(0);
	const [typedStrings, setTypedStrings] = useState([
		"<p>I'm a <strong>Senior Software Engineer</strong>.</p>",
		"<p>I'm a <strong>Blogger</strong>.</p>",
		"<p>I'm a <strong>Technology Enthusiast</strong>.</p>",
		"<p>Okay...</p>",
		"<p>I'm really just a bit of a <strong>Nerd</strong>.</p>",
		"<p>I live in the <strong>UK</strong>.</p><small>I'm currently based in <strong>London</strong>.</p>",
		"<p>I spend most of my time doing new stuff on the <strong>web</strong>.</p>",
		"<p>Mostly <strong>front end</strong>, but I do dabble in a bit of <strong>back end</strong>.</p>",
		"<p>When I run out of stuff on the web, I often end up staying up late during binge-watching sessions.</p>",
		'<p>My dogs are complete idiots:</p><br><img height="261px" width="348px" src="/uploads/dogs.png" id="hero_dogs_image" alt="My Shih Tzu\'s" />',
		"<p>But probably not as bad as some of my <strong>code</strong>...</p>",
		"<p>We've all been through those days.</p>",
		"<p>My most used language is <strong>JavaScript</strong>.</p>",
		"<p>I work a lot with <strong>Node.JS</strong>, <strong>React</strong> and <strong>Next.js</strong></p><br><p>But also with <strong>Redis</strong>, <strong>Postgres</strong> and various <strong>AWS</strong> services.</p>",
		"<p>And that's about the sum of it.</p><br><p>Feel free to scroll below to find out more about me about maybe read some of my posts.</p>",
	]);

	/* useEffect(() => {
    if (typedInitialComplete === 1) {
      setTimeout(() => {
        setTypedStrings([
          '<p> </p>',
          '<p>Are you still reading this?</p>',
          '<p>Did you not see the icon?</p>',
          '<p>Seriously... Just scroll your mouse down!</p>',
        ]);
      }, 6000);
    } else if (typedInitialComplete === 2) {
      setTimeout(() => {
        setTypedStrings([
          '<p> </p>',
          '<p>Fine, be like that.</p>',
          "<p>I'll just do it for you.</p>",
        ]);
      }, 3000);
    } else if (typedInitialComplete === 3) {
      setTypedStrings(['<p>...</p>']);
      scroll.scrollTo(800, {
        duration: 750,
        delay: 0,
        smooth: true,
        offset: 50,
      });
    } else if (typedInitialComplete === 4) {
      setTimeout(() => {
        setTypedStrings([
          '<p>...</p>',
          '<p>Was that so hard?</p>',
          '<p>Oh wait...</p>',
          "<p>You can't see this..</p>",
          "<p>I could put anything here right now and you wouldn't have a clue...</p>",
          '<p>Watermelons!</p>',
          '<p>Blueberries!</p>',
          '<p>Pineapples!</p>',
          "<p>Wasn't that fun?</p>",
          '<p>I should probably revert this just in case you come back..</p>',
          "<p>Right, let's see, what can I put here?...</p>",
          '<p>I know!</p>',
          '<p>Web Developer, Blogger and Technology Enthusiast</p>',
        ]);
      }, 1000);
    }
  }, [typedInitialComplete]); */

	return (
		<section
			className="transition-all relative overflow-hidden w-full flex flex-col items-center bg-contain bg-center bg-[#010517] bg-gradient-to-r from-[#010517] to-[#030825]"
			style={
				!hasScrolled && typedInitialComplete === 0
					? { minHeight: "100vh", paddingTop: "204px" }
					: { minHeight: "800px", paddingTop: "64px" }
			}
		>
			<div className="w-full h-hull">
				<div className="stars" />
				<div className="stars1" />
				<div className="stars2" />
			</div>
			<div className="z-10 pt-8 container px-4 md:px-6 text-center space-y-6 flex flex-col items-center justify-center">
				<h1 className="text-4xl md:text-6xl font-bold text-primary-foreground">
					I'm Nicholas Griffin
				</h1>
				<p className="text-lg md:text-xl text-muted-foreground max-w-[640px]">
					<Typed
						strings={typedStrings}
						typeSpeed={10}
						backSpeed={0}
						backDelay={1500}
						startDelay={200}
						showCursor={false}
						smartBackspace={true}
						onComplete={() => {
							setTypedInitialComplete(typedInitialComplete + 1);
							setShowScroller(true);
						}}
					/>
				</p>
				{hasScrolled || showScroller ? (
					<div className="hero__scroll">
						<div
							className="hero__scroll__icon"
							onClick={() => {
								scroll.scrollTo(800, {
									duration: 750,
									delay: 0,
									smooth: true,
									offset: 50,
								});
							}}
							onKeyDown={() => {
								scroll.scrollTo(800, {
									duration: 750,
									delay: 0,
									smooth: true,
									offset: 50,
								});
							}}
						>
							<div className="hero__scroll__icon__marker" />
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
}

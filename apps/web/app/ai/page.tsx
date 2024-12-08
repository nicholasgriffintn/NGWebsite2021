import { PageLayout } from "@/components/PageLayout";
import { Link } from "@/components/Link";
import { InnerPage } from "@/components/InnerPage";

export const metadata = {
	title: "AI",
	description: "A collection of projects that I have worked on.",
};

export default async function Home() {
	return (
		<PageLayout>
			<InnerPage>
				<h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
					AI
				</h1>
				<div className="grid grid-cols-5 gap-4">
					<div className="col-span-5 md:col-span-3 lg:col-span-3 pt-5">
						<div className="text-primary-foreground lg:max-w-[100%] prose dark:prose-invert">
							<p>
								None of the content that I publish on this site was written by
								an AI tool.
							</p>
							<p>
								While I do use LLM models during my research for articles, and
								sometimes to generate an initial structure, I always completely
								write the published article myself.
							</p>
							<p>
								You can read my{" "}
								<Link href="/blog/my-thoughts-and-principles-around-the-use-of-ai">
									blog post
								</Link>{" "}
								for more of my thoughts on the use of AI in the industry.
							</p>
							<p>
								Also, if you'd like to generate your own AI manifesto, you
								should start with this{" "}
								<Link href="https://www.bydamo.la/p/ai-manifesto">page</Link>.
							</p>
						</div>
					</div>
				</div>
			</InnerPage>
		</PageLayout>
	);
}

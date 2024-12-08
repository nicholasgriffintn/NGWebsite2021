import Form from "next/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
	onSubmit,
	redirectUrl,
}: {
	onSubmit: any;
	redirectUrl: string;
}) {
	return (
		<Form action={onSubmit}>
			<Label htmlFor="token">Token</Label>
			<Input
				id="token"
				placeholder="Enter your token"
				name="token"
				aria-required="true"
			/>
			<input type="hidden" name="redirectUrl" value={redirectUrl} />
			<Button className="mt-5" type="submit">
				Submit
			</Button>
		</Form>
	);
}

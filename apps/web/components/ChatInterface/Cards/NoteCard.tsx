export function NoteCard({ data }: any) {
	if (!data) return null;

	if (!data.length) return null;

	return (
		<div className="rounded-lg">
			<h3 className="text-lg font-semibold mb-3">Found {data.length} notes</h3>
			<div className="space-y-3">
				{data.map((item) => (
					<div key={item.id} className="p-3 bg-black rounded border">
						{item.title && (
							<h4 className="text-white-700 mb-2">{item.title}</h4>
						)}
						{item.content && (
							<p className="text-white-700 mb-2">{item.content}</p>
						)}
						<div className="flex gap-3 text-sm text-white-500">
							<span>ID: {item.id}</span>
							<span>Score: {Math.round(item.score * 100)}%</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

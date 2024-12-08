export function NoteCard(data: any) {
  if (!data?.data) return null;

  const { count, matches } = data.data;

  return (
    <div className="rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Found {count} notes</h3>
      <div className="space-y-3">
        {matches.map((item) => (
          <div key={item.id} className="p-3 bg-black rounded border">
            {item.metadata?.text && (
              <p className="text-white-700 mb-2">{item.metadata.text}</p>
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

export function CreatedNoteCard(data: any) {
  if (!data?.data) return null;

  const { embedding } = data.data;

  if (!embedding?.length) return null;

  return (
    <div className="bg-black-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Created Note</h3>
      <div className="space-y-3">
        {embedding.map((item) => (
          <div key={item.id} className="p-3 bg-black rounded border">
            {item.metadata?.text && (
              <p className="text-white-700 mb-2">{item.metadata.text}</p>
            )}
            <div className="text-sm text-white-500">
              <span>ID: {item.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

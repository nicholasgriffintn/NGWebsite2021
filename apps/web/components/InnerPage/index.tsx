export function InnerPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="container pt-[59px] text-left">
      <div className="pt-20"></div>
      {children}
      <div className="pt-20"></div>
    </div>
  );
}

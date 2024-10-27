export function InnerPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="container pt-[59px] text-left">
      <div className="pt-5 md:pt-10"></div>
      {children}
      <div className="pt-5 md:pb-10"></div>
    </div>
  );
}

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

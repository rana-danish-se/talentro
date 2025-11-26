import Navbar from '@/components/Navbar';
import Footer from '@/components/Footor';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

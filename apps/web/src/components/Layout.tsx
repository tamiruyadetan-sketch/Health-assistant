import { Outlet } from 'react-router-dom';
import NavBar from '@/components/NavBar/NavBar';
import Footer from '@/components/Footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <NavBar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
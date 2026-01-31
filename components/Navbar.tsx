import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isTransparent = location.pathname === '/';
  const navigate = useNavigate();

  const navClass = isTransparent
    ? "bg-gray-200 dark:bg-surface-dark/80 backdrop-blur-md border-b border-[#e7f3e9] dark:border-[#2a4d31]"
    : "bg-surface-light dark:bg-surface-dark border-b border-[#e7f3e9] dark:border-[#2a4d31]";

  return (
    <header className={`sticky top-0 z-50 w-full ${navClass}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src="components/terraVision_LOGO-removebg.png" alt="TerraVision" className="h-20 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/map" className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/map' ? 'text-primary' : 'text-text-main dark:text-text-main'}`}>Interactive Map</Link>
          <Link to="/transform" className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/transform' ? 'text-primary' : 'text-text-main dark:text-text-main'}`}>AI Transformation</Link>
          <Link to="/dashboard" className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-text-main dark:text-text-main'}`}>Impact Dashboard</Link>
          <Link to="/login" className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/login' ? 'text-primary' : 'text-text-main dark:text-text-main'}`}>Login</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
           <div
             className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-gray-200 dark:bg-gray-700 cursor-pointer"
             role="button"
             tabIndex={0}
             onClick={() => navigate('/profile')}
             onKeyDown={(e) => { if ((e as React.KeyboardEvent).key === 'Enter') navigate('/profile'); }}
             aria-label="Open profile"
           >
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9-Nb3aRjGhOZIvN0KnPMSCH1Zq92I-mzZxS0U1KKqDca_jO2kceKq5myUjsXLytS3mDwBh_8JpgvEr5-6NYLgYbrLTOzglmiYqPQvebCV2LI7wmd61GQw_NzYgECi1g85NUmYby48JcdKPo9ikuUXWOibAvfk_bMHMxfugGKzUE8pdBSb1qocLpcEkNrYyQK12HeixNX7J6sf4CPtwSe1qAlTFPmP8z-lpkN3StUs9scGECNNA_6r-dywHEeiRfgosGIY8YTUeg" alt="User" className="h-full w-full object-cover" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
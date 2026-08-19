import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/useCategories';
import NavItem from '@/components/NavBar/NavItem';
import MobileNav from '@/components/NavBar/MobileNav';
import UtilityBar from '@/components/UtilityBar/UtilityBar';
import { CloseIcon, LogoIcon, MenuIcon } from '@/components/icons';
import { SkeletonNavItem } from '@/components/Skeleton';

export default function NavBar() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const closeDropdown = useCallback(() => setOpenCategory(null), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!openCategory) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
        triggerRefs.current.get(openCategory)?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openCategory, closeDropdown]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [mobileOpen]);

  const setTriggerRef = useCallback(
    (slug: string) => (el: HTMLButtonElement | null) => {
      triggerRefs.current.set(slug, el);
    },
    []
  );

  const navigateAway = useCallback(() => {
    closeDropdown();
    closeMobile();
  }, [closeDropdown, closeMobile]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" onClick={navigateAway} className="flex shrink-0 items-center gap-2">
            <LogoIcon className="h-8 w-8" />
            <span className="hidden text-base font-bold text-gray-900 dark:text-gray-100 sm:inline">
              Health Portal
            </span>
          </Link>

          <nav aria-label="Main" className="nav-scroll hidden flex-1 justify-center px-2 md:flex">
            <ul className="flex items-center gap-0.5">
              {isLoading || !categories
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonNavItem key={i} />)
                : categories.map((category) => (
                    <NavItem
                      key={category.slug}
                      category={category}
                      open={openCategory === category.slug}
                      onOpen={() => setOpenCategory(category.slug)}
                      onClose={closeDropdown}
                      onNavigate={navigateAway}
                      triggerRef={setTriggerRef(category.slug)}
                    />
                  ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <UtilityBar />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.menu')}
              className="icon-btn md:hidden"
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-nav">
        <MobileNav categories={categories} open={mobileOpen} onClose={closeMobile} />
      </div>
    </header>
  );
}
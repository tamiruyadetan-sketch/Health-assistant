import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import PageLoader from '@/components/PageLoader';

const DiseaseDetail = lazy(() => import('@/pages/DiseaseDetail'));
const CategoryList = lazy(() => import('@/pages/CategoryList'));
const About = lazy(() => import('@/pages/About'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { ready } = useTranslation();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/category/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <CategoryList />
              </Suspense>
            }
          />
          <Route
            path="/disease/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <DiseaseDetail />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
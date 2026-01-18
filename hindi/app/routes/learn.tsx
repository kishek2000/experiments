import { Outlet, Link, useLocation } from 'react-router';
import { PageContainer } from '~/components/layout';

export default function LearnLayout() {
  const location = useLocation();
  const isIndex = location.pathname === '/learn';

  return (
    <PageContainer>
      {!isIndex && (
        <Link
          to="/learn"
          className="inline-flex items-center gap-1 text-sm text-[--color-text-muted] hover:text-amber-400 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Phases
        </Link>
      )}
      <Outlet />
    </PageContainer>
  );
}

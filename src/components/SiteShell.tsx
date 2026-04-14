import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

type SiteShellProps = {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  const location = useLocation()

  return (
    <div className="site-shell">
      <div className="site-shell__orb site-shell__orb--one" aria-hidden="true" />
      <div className="site-shell__orb site-shell__orb--two" aria-hidden="true" />
      <div className="site-shell__orb site-shell__orb--three" aria-hidden="true" />

      <div className="site-shell__inner">
        <header className="topbar">
          <Link className="brand" to="/">
            <span className="brand__mark">C</span>
            <span className="brand__text">
              <span className="brand__title">ChamBTI</span>
              <span className="brand__subtitle">League of Legends champion finder</span>
            </span>
          </Link>

          <nav className="topbar__nav">
            <Link className="topbar__link" to="/">
              홈
            </Link>
            <Link className="topbar__link" to="/quiz">
              성향 테스트
            </Link>
            {location.pathname.startsWith('/result/') ? (
              <Link className="topbar__link" to={location.pathname}>
                결과 보기
              </Link>
            ) : null}
            <Link className="topbar__link topbar__link--primary" to="/quiz">
              테스트 시작
            </Link>
          </nav>
        </header>

        <main className="page">{children}</main>

        <footer className="site-footer">
          <p>
            This project is not affiliated with Riot Games. League of Legends and
            all related images are trademarks or registered trademarks of Riot
            Games, Inc.
          </p>
          <p>비상업적 팬 프로젝트이며 Riot Games 공식 서비스가 아닙니다.</p>
        </footer>
      </div>
    </div>
  )
}

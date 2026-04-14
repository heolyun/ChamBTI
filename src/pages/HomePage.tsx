import { Link } from 'react-router-dom'
import { useChampionCatalog } from '../hooks/useChampionCatalog'

export function HomePage() {
  const { catalog, isLoading } = useChampionCatalog()

  return (
    <section className="hero-card">
      <div className="hero-card__copy">
        <p className="eyebrow">League of Legends Champion Finder</p>
        <h1 className="hero-card__title">
          Cham<span>BTI</span>
        </h1>
        <p className="hero-card__lead">플레이 성향으로 찾는 나만의 챔피언 추천</p>
        <p className="hero-card__body">
          설문 몇 문항으로 교전 스타일, 기동성 선호, 난이도 취향을 분석하고
          지금 나와 잘 맞는 리그 오브 레전드 챔피언 Top 3를 추천해드립니다.
        </p>

        <div className="hero-card__actions">
          <Link className="button" to="/quiz">
            테스트 시작
          </Link>
        </div>

        <p className="micro-note">
          {isLoading || !catalog
            ? '공식 챔피언 데이터를 불러오는 중입니다.'
            : `공식 Riot Data Dragon ${catalog.version} 기준 전체 챔피언 ${catalog.champions.length}명을 추천 대상에 포함합니다.`}
        </p>
      </div>

      <div className="hero-card__visual">
        <div className="hero-card__metric-grid">
          <article className="metric">
            <p>Question Flow</p>
            <strong>10 Questions</strong>
          </article>
          <article className="metric">
            <p>Recommendation</p>
            <strong>Top 3 Champions</strong>
          </article>
          <article className="metric">
            <p>Catalog Scope</p>
            <strong>{catalog ? `${catalog.champions.length} Champions` : 'Loading...'}</strong>
          </article>
          <article className="metric">
            <p>Share Route</p>
            <strong>/result/:slug</strong>
          </article>
        </div>

        <div className="hero-card__preview">
          <div className="hero-card__preview-badge">
            <p>How It Feels</p>
            <strong>질문 응답 후 바로 추천, 공유 링크, 이미지 저장까지</strong>
          </div>
        </div>
      </div>
    </section>
  )
}

import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RecommendationCard } from '../components/RecommendationCard'
import {
  getChampionSplashUrl,
  getChampionSquareUrl,
} from '../data/champions'
import { useChampionCatalog } from '../hooks/useChampionCatalog'
import { useChampionDetails } from '../hooks/useChampionDetails'
import {
  buildGenericSharedResult,
  hydrateStoredResult,
} from '../utils/recommendation'
import { loadLastResult } from '../utils/storage'

export function ResultPage() {
  const { slug } = useParams()
  const cardRef = useRef<HTMLDivElement>(null)
  const [copyMessage, setCopyMessage] = useState('')
  const [captureMessage, setCaptureMessage] = useState('')
  const shareSlug = slug ?? ''
  const { catalog, isLoading, hasError } = useChampionCatalog()

  const storedResult = loadLastResult()
  const hydratedResult =
    catalog && shareSlug
      ? storedResult?.shareSlug === shareSlug
        ? hydrateStoredResult(storedResult, catalog.champions)
        : buildGenericSharedResult(catalog.champions, shareSlug)
      : null
  const detailIds = hydratedResult
    ? hydratedResult.recommendations.map((recommendation) => recommendation.champion.id)
    : []
  const details = useChampionDetails(detailIds, catalog?.version ?? null)

  if (!shareSlug) return null

  if (hasError) {
    return (
      <section className="result-card empty-state">
        <p className="eyebrow">Catalog Error</p>
        <h2>챔피언 데이터를 불러오지 못했습니다</h2>
        <p>잠시 후 다시 시도하거나 테스트를 처음부터 다시 열어주세요.</p>
      </section>
    )
  }

  if (isLoading || !catalog) {
    return (
      <section className="result-card empty-state">
        <p className="eyebrow">Loading Result</p>
        <h2>결과 페이지를 준비하는 중입니다</h2>
        <p>공식 챔피언 데이터를 가져온 뒤 결과를 연결하고 있습니다.</p>
      </section>
    )
  }

  if (!hydratedResult) {
    return (
      <section className="result-card empty-state">
        <p className="eyebrow">Result Not Found</p>
        <h2>해당 결과를 찾을 수 없습니다</h2>
        <p>테스트를 다시 진행하면 새로운 추천 결과를 바로 만들 수 있어요.</p>
        <div className="hero-card__actions">
          <Link className="button" to="/quiz">
            다시 테스트하기
          </Link>
          <Link className="button--ghost" to="/">
            홈으로 가기
          </Link>
        </div>
      </section>
    )
  }

  const primary = hydratedResult.recommendations[0]
  const similarChampions = hydratedResult.similarChampions
  const primaryDetail = details.details[primary.champion.id]
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/result/${primary.champion.slug}`
      : `/result/${primary.champion.slug}`
  const isSharedView = !storedResult || storedResult.shareSlug !== shareSlug

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyMessage('링크를 클립보드에 복사했습니다.')
    } catch {
      setCopyMessage('복사에 실패했습니다. 주소창의 URL을 직접 복사해 주세요.')
    }
  }

  async function handleCapture() {
    if (!cardRef.current) return

    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: '#050816',
        scale: 2,
      })

      const link = document.createElement('a')
      link.download = `chambti-${primary.champion.slug}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      setCaptureMessage('결과 이미지를 저장했습니다.')
    } catch {
      setCaptureMessage('이미지 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <div className="result-layout">
      <aside className="panel">
        <p className="eyebrow">Result Summary</p>
        <h2>{isSharedView ? '공유된 결과' : '당신의 성향 결과'}</h2>
        <p>
          {isSharedView
            ? '이 링크는 대표 추천 챔피언 기준으로 열립니다. 직접 테스트하면 Top 3를 더 정확하게 받아볼 수 있어요.'
            : '테스트 응답을 바탕으로 가장 잘 맞는 챔피언 세 명을 정리했습니다.'}
        </p>

        <div className="pill-row">
          <span className="pill">{primary.fitLabel}</span>
          {primary.champion.classes.map((championClass) => (
            <span key={championClass} className="pill">
              {championClass}
            </span>
          ))}
        </div>

        <ul className="mini-list">
          <li>공유 링크는 대표 추천 챔피언의 결과 페이지로 생성됩니다.</li>
          <li>이미지 저장은 결과 카드 전체를 캡처해 PNG로 내려받습니다.</li>
          <li>공략 버튼으로 바로 YouTube 검색 결과를 열 수 있습니다.</li>
        </ul>

        <div className="question-card__actions">
          <button type="button" className="button" onClick={handleCopy}>
            링크 복사
          </button>
          <button type="button" className="button--ghost" onClick={handleCapture}>
            결과 이미지 저장
          </button>
          <Link className="button--subtle" to="/quiz">
            다시 테스트하기
          </Link>
        </div>

        {copyMessage ? <p>{copyMessage}</p> : null}
        {captureMessage ? <p>{captureMessage}</p> : null}
      </aside>

      <div className="page">
        <section ref={cardRef} className="result-card">
          <div className="result-card__hero">
            <div className="result-card__image">
              <img src={getChampionSplashUrl(primary.champion.id)} alt={primary.champion.name} />
            </div>

            <div className="result-card__body">
              <p className="eyebrow">Top Recommendation</p>
              <span className="fit-badge">{primary.fitLabel}</span>
              <h2>{primary.champion.name}</h2>
              <p>{primary.champion.headline}</p>
              <p>{primary.champion.summary}</p>

              <div className="pill-row">
                {primary.champion.tags.map((tag) => (
                  <span key={tag} className="pill">
                    #{tag}
                  </span>
                ))}
              </div>

              <ul className="reason-list">
                {primary.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>

              <div className="result-card__actions">
                <a
                  className="button"
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                    primary.champion.guideQuery,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {primary.champion.name} 공략 보러가기
                </a>
                <button type="button" className="button--ghost" onClick={handleCopy}>
                  공유 링크 복사
                </button>
              </div>
            </div>
          </div>

          <div className="rank-grid">
            {hydratedResult.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.champion.id}
                recommendation={recommendation}
                rank={index + 1}
              />
            ))}
          </div>
        </section>

        <section className="detail-grid">
          <article className="detail-card">
            <p className="eyebrow">Champion Details</p>
            <h3>{primary.champion.name} 한눈에 보기</h3>

            <div className="detail-card__meta">
              {primary.champion.classes.map((championClass) => (
                <span key={championClass} className="stat-badge">
                  {championClass}
                </span>
              ))}
              {primary.champion.tags.map((tag) => (
                <span key={tag} className="stat-badge">
                  {tag}
                </span>
              ))}
            </div>

            <p>{primaryDetail?.blurb ?? primary.champion.summary}</p>

            <ul className="skill-list">
              <li>
                <strong>Passive</strong>
                <div>{primaryDetail?.skills.passive ?? '불러오는 중...'}</div>
              </li>
              <li>
                <strong>Q</strong>
                <div>{primaryDetail?.skills.q ?? '불러오는 중...'}</div>
              </li>
              <li>
                <strong>W</strong>
                <div>{primaryDetail?.skills.w ?? '불러오는 중...'}</div>
              </li>
              <li>
                <strong>E</strong>
                <div>{primaryDetail?.skills.e ?? '불러오는 중...'}</div>
              </li>
              <li>
                <strong>R</strong>
                <div>{primaryDetail?.skills.r ?? '불러오는 중...'}</div>
              </li>
            </ul>
            {details.hasError ? (
              <p>일부 공식 챔피언 데이터를 불러오지 못해 기본 설명으로 표시 중입니다.</p>
            ) : null}
          </article>

          <article className="detail-card">
            <p className="eyebrow">Similar Champions</p>
            <h3>비슷한 취향이라면 이런 챔피언도 잘 맞아요</h3>
            <div className="similar-grid">
              {similarChampions.map((champion) => (
                <Link
                  key={champion.id}
                  className="similar-card"
                  to={`/result/${champion.slug}`}
                >
                  <div className="similar-card__thumb">
                    <img
                      src={getChampionSquareUrl(catalog.version, champion.id)}
                      alt={champion.name}
                    />
                  </div>
                  <div>
                    <strong>{champion.name}</strong>
                    <p>{champion.headline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        </section>

        <footer className="footer">
          <p>
            Riot Data Dragon {catalog.version} 기준 챔피언 데이터와 이미지를 사용합니다.
          </p>
          <p>
            This project is not affiliated with Riot Games. League of Legends and
            all related images are trademarks or registered trademarks of Riot
            Games, Inc.
          </p>
        </footer>
      </div>
    </div>
  )
}

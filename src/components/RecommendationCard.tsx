import { Link } from 'react-router-dom'
import {
  getChampionSplashUrl,
  getDifficultyLabel,
} from '../data/champions'
import type { Recommendation } from '../types/champion'

type RecommendationCardProps = {
  recommendation: Recommendation
  rank: number
}

export function RecommendationCard({
  recommendation,
  rank,
}: RecommendationCardProps) {
  const { champion } = recommendation

  return (
    <article className="rank-card">
      <span className="rank-card__rank">Top {rank}</span>
      <div className="rank-card__thumb">
        <img src={getChampionSplashUrl(champion.id)} alt={champion.name} />
      </div>

      <div>
        <h3>{champion.name}</h3>
        <p>{champion.headline}</p>
      </div>

      <div className="pill-row">
        {champion.classes.map((championClass) => (
          <span key={championClass} className="pill">
            {championClass}
          </span>
        ))}
        <span className="pill">{getDifficultyLabel(champion.profile.execution)}</span>
      </div>

      <ul className="reason-list">
        {recommendation.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <div className="rank-card__actions">
        <Link className="button--subtle" to={`/result/${champion.slug}`}>
          이 챔피언만 보기
        </Link>
        <a
          className="button--ghost"
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
            champion.guideQuery,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          공략 검색
        </a>
      </div>
    </article>
  )
}

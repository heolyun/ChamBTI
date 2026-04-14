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
    <article className="rank-card rank-card--compact">
      <div className="rank-card__header">
        <span className="rank-card__rank">Top {rank}</span>
        <span className="fit-badge fit-badge--compact">{recommendation.fitLabel}</span>
      </div>

      <div className="rank-card__row">
        <Link className="rank-card__thumb rank-card__thumb--compact" to={`/result/${champion.slug}`}>
          <img src={getChampionSplashUrl(champion.id)} alt={champion.name} />
        </Link>

        <div className="rank-card__content">
          <div>
            <h3>{champion.name}</h3>
            <p>{champion.title}</p>
          </div>

          <div className="pill-row pill-row--dense">
            {champion.classes.slice(0, 2).map((championClass) => (
              <span key={championClass} className="pill">
                {championClass}
              </span>
            ))}
            <span className="pill">{getDifficultyLabel(champion.profile.execution)}</span>
          </div>

          <ul className="compact-reason-list">
            {recommendation.reasons.slice(0, 2).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>

      <Link className="inline-link" to={`/result/${champion.slug}`}>
        이 챔피언 상세 보기
      </Link>
    </article>
  )
}

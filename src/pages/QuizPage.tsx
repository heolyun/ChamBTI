import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import { useChampionCatalog } from '../hooks/useChampionCatalog'
import { questions } from '../data/questions'
import {
  buildStoredResult,
  getRecommendations,
  mergePreferencesFromAnswers,
} from '../utils/recommendation'
import { saveLastResult } from '../utils/storage'

export function QuizPage() {
  const navigate = useNavigate()
  const { catalog, isLoading, hasError } = useChampionCatalog()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const question = questions[currentIndex]
  const progress = Math.round((currentIndex / questions.length) * 100)

  if (hasError) {
    return (
      <section className="question-card">
        <p className="eyebrow">Catalog Error</p>
        <h2>챔피언 데이터를 불러오지 못했습니다</h2>
        <p className="question-card__helper">
          네트워크 상태를 확인한 뒤 새로고침하면 다시 불러올 수 있습니다.
        </p>
      </section>
    )
  }

  if (isLoading || !catalog) {
    return (
      <section className="question-card">
        <p className="eyebrow">Preparing Quiz</p>
        <h2>공식 챔피언 데이터를 불러오는 중입니다</h2>
        <p className="question-card__helper">
          전체 챔피언 기준 추천을 만들기 위해 최신 목록을 먼저 준비하고 있습니다.
        </p>
      </section>
    )
  }

  const activeCatalog = catalog

  function handleSelect(optionId: string) {
    const nextAnswers = {
      ...answers,
      [question.id]: optionId,
    }

    setAnswers(nextAnswers)

    if (currentIndex === questions.length - 1) {
      const preferences = mergePreferencesFromAnswers(nextAnswers)
      const recommendations = getRecommendations(activeCatalog.champions, preferences, 3)
      const storedResult = buildStoredResult(nextAnswers, preferences, recommendations)

      saveLastResult(storedResult)
      navigate(`/result/${storedResult.shareSlug}`)
      return
    }

    setCurrentIndex((index) => index + 1)
  }

  function handlePrevious() {
    setCurrentIndex((index) => Math.max(0, index - 1))
  }

  return (
    <div className="quiz-layout">
      <aside className="panel progress-card">
        <div className="progress-strip">
          <div className="progress-strip__header">
            <span className="progress-strip__label">현재 진행도</span>
            <strong className="progress-strip__value">
              {currentIndex + 1}/{questions.length}
            </strong>
          </div>

          <div className="progress-bar progress-bar--quiz" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ul className="mini-list">
          <li>이 검사는 재미로 보는 성향 테스트예요.</li>
          <li>정답은 없습니다. 평소 재미있다고 느끼는 방향으로 골라주세요.</li>
          <li>결과는 Top 3 추천과 추천 이유, 유사 챔피언까지 함께 보여줍니다.</li>
          <li>마지막에는 공유 링크와 결과 이미지 저장도 바로 가능합니다.</li>
        </ul>

        <p className="micro-note">
          Riot Data Dragon {activeCatalog.version} 기준 전체 챔피언 {activeCatalog.champions.length}명을
          추천 후보로 사용합니다.
        </p>
      </aside>

      <QuestionCard
        question={question}
        current={currentIndex + 1}
        total={questions.length}
        onSelect={handleSelect}
        onPrevious={handlePrevious}
        canGoBack={currentIndex > 0}
      />
    </div>
  )
}

import type { Question } from '../types/champion'

type QuestionCardProps = {
  question: Question
  current: number
  total: number
  onSelect: (optionId: string) => void
  onPrevious: () => void
  canGoBack: boolean
}

export function QuestionCard({
  question,
  current,
  total,
  onSelect,
  onPrevious,
  canGoBack,
}: QuestionCardProps) {
  return (
    <section className="question-card">
      <div>
        <span className="question-card__counter">
          Question {current} / {total}
        </span>
      </div>

      <div>
        <h2>{question.prompt}</h2>
      </div>

      <div className="option-list">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="option-card"
            onClick={() => onSelect(option.id)}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>

      <div className="question-card__actions">
        <button
          type="button"
          className="button--ghost"
          onClick={onPrevious}
          disabled={!canGoBack}
        >
          이전 문항
        </button>
      </div>
    </section>
  )
}

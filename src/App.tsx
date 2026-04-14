import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteShell } from './components/SiteShell'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import { ResultPage } from './pages/ResultPage'

function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result/:slug" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  )
}

export default App

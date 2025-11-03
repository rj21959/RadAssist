import React, { useState } from 'react'
import ImageUpload from './components/ImageUpload'
import ResultsDisplay from './components/ResultsDisplay'
import './styles/App.css'

function App() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result)
    setError(null)
  }

  const handleError = (errorMsg) => {
    setError(errorMsg)
    setAnalysisResult(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🩺 RadAssist</h1>
          <p>AI-Powered Radiology Assistant</p>
        </div>
      </header>

      <main className="app-main">
        {!analysisResult ? (
          <ImageUpload 
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            loading={loading}
            setLoading={setLoading}
          />
        ) : (
          <ResultsDisplay 
            result={analysisResult}
            onNewAnalysis={() => setAnalysisResult(null)}
          />
        )}

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Try Again</button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>RadAssist - Transforming Medical Imaging with AI</p>
        <p className="disclaimer">
          Disclaimer: This is a demonstration tool. Always consult with qualified healthcare professionals for medical diagnosis.
        </p>
      </footer>
    </div>
  )
}

export default App
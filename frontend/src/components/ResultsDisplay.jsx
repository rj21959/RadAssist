import React from 'react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ result, onNewAnalysis }) => {
  const { diagnosis, confidence, findings, recommendations, conditions_probabilities, filename, timestamp } = result

  const getConfidenceColor = (conf) => {
    if (conf > 0.8) return '#4CAF50'
    if (conf > 0.6) return '#FF9800'
    return '#F44336'
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <button onClick={onNewAnalysis} className="new-analysis-btn">
          Analyze New Image
        </button>
      </div>

      <div className="results-meta">
        <p><strong>File:</strong> {filename}</p>
        <p><strong>Analyzed:</strong> {formatTimestamp(timestamp)}</p>
      </div>

      <div className="diagnosis-card">
        <h3>Primary Diagnosis</h3>
        <div className="diagnosis-content">
          <span 
            className="diagnosis-label"
            style={{ borderColor: getConfidenceColor(confidence) }}
          >
            {diagnosis}
          </span>
          <div 
            className="confidence-bar"
            style={{ 
              backgroundColor: getConfidenceColor(confidence),
              width: `${confidence * 100}%`
            }}
          >
            <span>Confidence: {(confidence * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="findings-section">
        <h3>Clinical Findings</h3>
        <ul>
          {findings.map((finding, index) => (
            <li key={index}>{finding}</li>
          ))}
        </ul>
      </div>

      <div className="recommendations-section">
        <h3>Recommendations</h3>
        <ul>
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="probabilities-section">
        <h3>Condition Probabilities</h3>
        <div className="probabilities-grid">
          {Object.entries(conditions_probabilities).map(([condition, probability]) => (
            <div key={condition} className="probability-item">
              <span className="condition-name">{condition}</span>
              <div className="probability-bar-container">
                <div 
                  className="probability-bar"
                  style={{ width: `${probability * 100}%` }}
                ></div>
              </div>
              <span className="probability-value">{(probability * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="disclaimer-note">
        <p>
          <strong>Important:</strong> This AI analysis is for assistance only. 
          Always consult with qualified healthcare professionals for final diagnosis and treatment decisions.
        </p>
      </div>
    </div>
  )
}

export default ResultsDisplay
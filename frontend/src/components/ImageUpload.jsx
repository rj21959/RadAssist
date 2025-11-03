import React, { useCallback, useState } from 'react'
import axios from 'axios'
import './ImageUpload.css'

const ImageUpload = ({ onAnalysisComplete, onError, loading, setLoading }) => {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file (JPEG, PNG, etc.)')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target.result)
    }
    reader.readAsDataURL(file)

    // Upload and analyze
    uploadAndAnalyze(file)
  }

  const uploadAndAnalyze = async (file) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      })

      onAnalysisComplete(response.data)
    } catch (error) {
      console.error('Analysis error:', error)
      onError(
        error.response?.data?.detail || 
        'Failed to analyze image. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="image-upload-container">
      <div className="upload-section">
        <h2>Upload Medical Image</h2>
        <p>Upload a chest X-ray or other medical image for AI analysis</p>
        
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${loading ? 'loading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Analyzing image... This may take a few seconds.</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>Drag & drop your image here, or click to browse</p>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
              />
            </>
          )}
        </div>

        {previewUrl && !loading && (
          <div className="image-preview">
            <h3>Image Preview:</h3>
            <img src={previewUrl} alt="Upload preview" />
          </div>
        )}
      </div>

      <div className="supported-formats">
        <h3>Supported Formats:</h3>
        <ul>
          <li>JPEG, PNG, DICOM</li>
          <li>Chest X-rays, CT scans (preliminary)</li>
          <li>Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  )
}

export default ImageUpload
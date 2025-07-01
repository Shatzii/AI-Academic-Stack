import React, { useState, useRef } from 'react';
import axios from 'axios';

/**
 * Curriculum Transformer Interface
 * 
 * A React component that provides a user-friendly interface for the curriculum
 * transformer API, allowing users to upload content and apply transformations.
 */
const TransformerInterface = () => {
  // File input state
  const [file, setFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [inputType, setInputType] = useState('file'); // 'file' or 'text'
  
  // Transformation options state
  const [inputFormat, setInputFormat] = useState('docx');
  const [outputFormat, setOutputFormat] = useState('html');
  const [transformationTypes, setTransformationTypes] = useState(['visual']);
  const [neurodivergentProfile, setNeurodivergentProfile] = useState('general');
  
  // Advanced options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customOptions, setCustomOptions] = useState('{}');
  
  // Results state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobStatus, setJobStatus] = useState({});
  const [transformedContent, setTransformedContent] = useState('');
  
  // References
  const fileInputRef = useRef(null);
  const resultFrameRef = useRef(null);
  
  // Status polling interval
  const [statusInterval, setStatusInterval] = useState(null);
  
  /**
   * Handle file input change
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Auto-detect input format from file extension
      const fileName = selectedFile.name;
      const extension = fileName.split('.').pop().toLowerCase();
      
      if (['pdf', 'docx', 'pptx', 'html', 'txt', 'md'].includes(extension)) {
        setInputFormat(extension);
      }
    }
  };
  
  /**
   * Handle transformation type selection
   */
  const handleTransformationTypeChange = (type) => {
    setTransformationTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(item => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  /**
   * Reset the form
   */
  const resetForm = () => {
    setFile(null);
    setTextContent('');
    setError('');
    setJobId('');
    setJobStatus({});
    setTransformedContent('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Clear status polling interval
    if (statusInterval) {
      clearInterval(statusInterval);
      setStatusInterval(null);
    }
  };
  
  /**
   * Start transformation with file upload
   */
  const startFileTransformation = async () => {
    if (!file) {
      setError('Please select a file to transform');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', outputFormat);
      formData.append('transformationTypes', JSON.stringify(transformationTypes));
      formData.append('neurodivergentProfile', neurodivergentProfile);
      
      if (showAdvancedOptions) {
        formData.append('customOptions', customOptions);
      }
      
      const response = await axios.post('/api/transformer/transform', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.jobId) {
        setJobId(response.data.jobId);
        startStatusPolling(response.data.jobId);
      } else if (response.data.status === 'complete') {
        // Handle immediate completion
        setTransformedContent(response.data.result.content);
        if (resultFrameRef.current) {
          resultFrameRef.current.srcdoc = response.data.result.content;
        }
      }
    } catch (err) {
      console.error('Transformation error:', err);
      setError(err.response?.data?.error || 'Error starting transformation');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Start transformation with text input
   */
  const startTextTransformation = async () => {
    if (!textContent) {
      setError('Please enter some content to transform');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const requestData = {
        content: textContent,
        inputFormat: inputFormat,
        outputFormat,
        transformationTypes,
        neurodivergentProfile
      };
      
      if (showAdvancedOptions) {
        try {
          requestData.customOptions = JSON.parse(customOptions);
        } catch (e) {
          setError('Invalid JSON in custom options');
          setIsLoading(false);
          return;
        }
      }
      
      const response = await axios.post('/api/transformer/transform-text', requestData);
      
      if (response.headers['content-type'].includes('text/html')) {
        // Direct HTML response
        setTransformedContent(response.data);
        if (resultFrameRef.current) {
          resultFrameRef.current.srcdoc = response.data;
        }
      } else if (response.data.jobId) {
        // Async job response
        setJobId(response.data.jobId);
        startStatusPolling(response.data.jobId);
      }
    } catch (err) {
      console.error('Transformation error:', err);
      setError(err.response?.data?.error || 'Error starting transformation');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Start transformation process
   */
  const startTransformation = (e) => {
    e.preventDefault();
    
    if (inputType === 'file') {
      startFileTransformation();
    } else {
      startTextTransformation();
    }
  };
  
  /**
   * Poll for job status
   */
  const startStatusPolling = (jobId) => {
    // Clear any existing interval
    if (statusInterval) {
      clearInterval(statusInterval);
    }
    
    // Set up polling interval
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/transformer/status/${jobId}`);
        setJobStatus(response.data);
        
        if (response.data.status === 'completed') {
          // Job completed, fetch result
          clearInterval(interval);
          fetchTransformationResult(jobId);
        } else if (response.data.status === 'failed') {
          // Job failed
          clearInterval(interval);
          setError(`Transformation failed: ${response.data.error}`);
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        clearInterval(interval);
        setError('Error checking transformation status');
      }
    }, 2000); // Poll every 2 seconds
    
    setStatusInterval(interval);
  };
  
  /**
   * Fetch transformation result
   */
  const fetchTransformationResult = async (jobId) => {
    try {
      const response = await axios.get(`/api/transformer/result/${jobId}`, {
        responseType: 'blob'
      });
      
      // Handle different content types
      const contentType = response.headers['content-type'];
      
      if (contentType.includes('text/html')) {
        // HTML response
        const reader = new FileReader();
        reader.onload = () => {
          setTransformedContent(reader.result);
          if (resultFrameRef.current) {
            resultFrameRef.current.srcdoc = reader.result;
          }
        };
        reader.readAsText(response.data);
      } else if (contentType.includes('application/pdf')) {
        // PDF response - create object URL for viewing/download
        const url = URL.createObjectURL(response.data);
        setTransformedContent(url);
        
        // Open PDF in new window for viewing
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error('Error fetching transformation result:', err);
      setError('Error retrieving transformation result');
    }
  };
  
  /**
   * Cancel transformation job
   */
  const cancelTransformation = async () => {
    if (!jobId) return;
    
    try {
      await axios.post(`/api/transformer/cancel/${jobId}`);
      
      setError('Transformation canceled');
      
      // Clear status polling interval
      if (statusInterval) {
        clearInterval(statusInterval);
        setStatusInterval(null);
      }
    } catch (err) {
      console.error('Error canceling transformation:', err);
      setError('Error canceling transformation');
    }
  };
  
  return (
    <div className="curriculum-transformer">
      <h2 className="transformer-title">Curriculum Transformer</h2>
      <p className="transformer-description">
        Transform educational content into neurodivergent-friendly formats. 
        Upload a document or enter text to adapt it for different learning profiles.
      </p>
      
      <div className="transformer-content">
        <div className="transformer-form-container">
          <form className="transformer-form" onSubmit={startTransformation}>
            {/* Input type selector */}
            <div className="input-type-selector">
              <button
                type="button"
                className={`input-type-button ${inputType === 'file' ? 'active' : ''}`}
                onClick={() => setInputType('file')}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`input-type-button ${inputType === 'text' ? 'active' : ''}`}
                onClick={() => setInputType('text')}
              >
                Enter Text
              </button>
            </div>
            
            {/* File input section */}
            {inputType === 'file' && (
              <div className="form-section">
                <label className="form-label">Upload Content</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.pptx,.html,.txt,.md"
                    className="file-input"
                  />
                  <div className="file-info">
                    {file ? (
                      <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                    ) : (
                      <span>No file selected</span>
                    )}
                  </div>
                </div>
                <div className="form-help">
                  Supported formats: PDF, DOCX, PPTX, HTML, TXT, MD
                </div>
              </div>
            )}
            
            {/* Text input section */}
            {inputType === 'text' && (
              <div className="form-section">
                <label className="form-label">Enter Content</label>
                <textarea
                  className="text-input"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter the content you would like to transform..."
                  rows={8}
                ></textarea>
                
                <div className="format-selector">
                  <label className="form-label">Input Format</label>
                  <select
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    className="format-select"
                  >
                    <option value="txt">Plain Text</option>
                    <option value="html">HTML</option>
                    <option value="md">Markdown</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Output format selector */}
            <div className="form-section">
              <label className="form-label">Output Format</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="format-select"
              >
                <option value="html">HTML</option>
                <option value="interactive">Interactive HTML</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            
            {/* Neurodivergent profile selector */}
            <div className="form-section">
              <label className="form-label">Learning Profile</label>
              <select
                value={neurodivergentProfile}
                onChange={(e) => setNeurodivergentProfile(e.target.value)}
                className="profile-select"
              >
                <option value="general">General (All Profiles)</option>
                <option value="dyslexia">Dyslexia</option>
                <option value="adhd">ADHD</option>
                <option value="autism">Autism Spectrum</option>
                <option value="mixed">Mixed Profile</option>
              </select>
            </div>
            
            {/* Transformation types selector */}
            <div className="form-section">
              <label className="form-label">Transformation Types</label>
              <div className="transformation-types">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={transformationTypes.includes('visual')}
                    onChange={() => handleTransformationTypeChange('visual')}
                  />
                  <span>Visual Learning</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={transformationTypes.includes('pattern')}
                    onChange={() => handleTransformationTypeChange('pattern')}
                  />
                  <span>Pattern Recognition</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={transformationTypes.includes('multisensory')}
                    onChange={() => handleTransformationTypeChange('multisensory')}
                  />
                  <span>Multisensory</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={transformationTypes.includes('executive')}
                    onChange={() => handleTransformationTypeChange('executive')}
                  />
                  <span>Executive Function</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={transformationTypes.includes('social')}
                    onChange={() => handleTransformationTypeChange('social')}
                  />
                  <span>Social Context</span>
                </label>
              </div>
            </div>
            
            {/* Advanced options */}
            <div className="form-section">
              <button
                type="button"
                className="advanced-options-toggle"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
              </button>
              
              {showAdvancedOptions && (
                <div className="advanced-options">
                  <label className="form-label">Custom Options (JSON)</label>
                  <textarea
                    className="custom-options-input"
                    value={customOptions}
                    onChange={(e) => setCustomOptions(e.target.value)}
                    rows={5}
                    placeholder='{"option1": "value1", "option2": "value2"}'
                  ></textarea>
                  <div className="form-help">
                    Enter custom options in JSON format
                  </div>
                </div>
              )}
            </div>
            
            {/* Form buttons */}
            <div className="form-buttons">
              <button
                type="submit"
                className="transform-button"
                disabled={isLoading || (!file && !textContent)}
              >
                {isLoading ? 'Transforming...' : 'Transform Content'}
              </button>
              <button
                type="button"
                className="reset-button"
                onClick={resetForm}
                disabled={isLoading}
              >
                Reset
              </button>
              {jobId && jobStatus.status === 'processing' && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelTransformation}
                >
                  Cancel
                </button>
              )}
            </div>
            
            {/* Error message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {/* Job status */}
            {jobId && jobStatus.status && jobStatus.status !== 'completed' && (
              <div className="job-status">
                <h3>Transformation Status</h3>
                <div className="status-details">
                  <div className="status-item">
                    <span className="status-label">Status:</span>
                    <span className={`status-value status-${jobStatus.status}`}>
                      {jobStatus.status}
                    </span>
                  </div>
                  {jobStatus.progress !== undefined && (
                    <div className="status-item">
                      <span className="status-label">Progress:</span>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{width: `${jobStatus.progress}%`}}
                        ></div>
                        <span className="progress-text">{jobStatus.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Result preview */}
        {transformedContent && (
          <div className="transformation-result">
            <h3>Transformation Result</h3>
            {outputFormat === 'pdf' ? (
              <div className="pdf-result">
                <p>PDF generated successfully. It has been opened in a new tab.</p>
                <a 
                  href={transformedContent} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pdf-link"
                >
                  Open PDF Again
                </a>
              </div>
            ) : (
              <div className="result-preview">
                <iframe
                  ref={resultFrameRef}
                  className="result-frame"
                  title="Transformed Content Preview"
                  sandbox="allow-same-origin allow-scripts"
                ></iframe>
                
                <div className="result-actions">
                  <button
                    className="download-button"
                    onClick={() => {
                      const blob = new Blob([transformedContent], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'transformed-content.html';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Download HTML
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        .curriculum-transformer {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .transformer-title {
          font-size: 24px;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .transformer-description {
          margin-bottom: 30px;
          color: #666;
        }
        
        .transformer-content {
          display: flex;
          flex-direction: column;
        }
        
        @media (min-width: 992px) {
          .transformer-content {
            flex-direction: row;
            gap: 30px;
          }
          
          .transformer-form-container {
            flex: 1;
            max-width: 500px;
          }
          
          .transformation-result {
            flex: 1;
            min-width: 400px;
          }
        }
        
        .transformer-form {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .input-type-selector {
          display: flex;
          margin-bottom: 20px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .input-type-button {
          flex: 1;
          padding: 10px;
          background-color: #f5f5f5;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-weight: 500;
        }
        
        .input-type-button.active {
          background-color: #27ae60;
          color: white;
        }
        
        .form-section {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .file-upload-container {
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
        
        .file-input {
          margin-bottom: 8px;
        }
        
        .file-info {
          font-size: 14px;
          color: #666;
        }
        
        .form-help {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
        }
        
        .text-input,
        .custom-options-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
        }
        
        .format-select,
        .profile-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: white;
        }
        
        .transformation-types {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .advanced-options-toggle {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
          margin-bottom: 10px;
          text-decoration: underline;
        }
        
        .form-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .transform-button,
        .reset-button,
        .cancel-button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .transform-button {
          background-color: #27ae60;
          color: white;
          flex: 1;
        }
        
        .transform-button:hover {
          background-color: #219653;
        }
        
        .transform-button:disabled {
          background-color: #a5d6a7;
          cursor: not-allowed;
        }
        
        .reset-button {
          background-color: #f0f0f0;
          color: #333;
        }
        
        .reset-button:hover {
          background-color: #e0e0e0;
        }
        
        .cancel-button {
          background-color: #e74c3c;
          color: white;
        }
        
        .cancel-button:hover {
          background-color: #c0392b;
        }
        
        .error-message {
          margin-top: 20px;
          padding: 10px;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .job-status {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        
        .job-status h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .status-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .status-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .status-label {
          font-weight: 500;
          min-width: 80px;
        }
        
        .status-value {
          font-weight: 500;
        }
        
        .status-pending {
          color: #f39c12;
        }
        
        .status-processing {
          color: #3498db;
        }
        
        .status-completed {
          color: #27ae60;
        }
        
        .status-failed {
          color: #e74c3c;
        }
        
        .progress-bar-container {
          flex: 1;
          height: 10px;
          background-color: #e0e0e0;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
        }
        
        .progress-bar {
          height: 100%;
          background-color: #3498db;
          border-radius: 5px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          position: absolute;
          top: -4px;
          right: 0;
          font-size: 12px;
          color: #333;
        }
        
        .transformation-result {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          display: flex;
          flex-direction: column;
          max-width: 100%;
        }
        
        .transformation-result h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .result-preview {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 400px;
        }
        
        .result-frame {
          flex: 1;
          min-height: 400px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 15px;
          background-color: white;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .result-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .download-button {
          padding: 8px 15px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .download-button:hover {
          background-color: #2980b9;
        }
        
        .pdf-result {
          padding: 15px;
          background-color: #f0f8ff;
          border-radius: 4px;
          text-align: center;
        }
        
        .pdf-link {
          display: inline-block;
          margin-top: 10px;
          padding: 8px 15px;
          background-color: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .pdf-link:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default TransformerInterface;
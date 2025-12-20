import React, { useState, useRef } from 'react';
import './ServiceDetails.css';

const ServiceDetails = ({ service, onStartService, onBack }) => {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const steps = [
    { number: 1, title: 'Service Overview', description: 'Learn about the service requirements' },
    { number: 2, title: 'Document Upload', description: 'Submit required documents from your device' },
    { number: 3, title: 'Review & Submit', description: 'Verify and submit your application' }
  ];

  // Required document types for the service
  const requiredDocuments = [
    { id: 1, name: 'Identification Document', description: 'Valid ID or Passport (PDF, JPG, PNG)', required: true },
    { id: 2, name: 'Proof of Address', description: 'Utility bill or rental agreement', required: true },
    { id: 3, name: 'Case Related Documents', description: 'Supporting evidence or previous court documents', required: false },
    { id: 4, name: 'Application Form', description: 'Completed service application form', required: true },
    { id: 5, name: 'Additional Evidence', description: 'Any other supporting documents', required: false }
  ];

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleString(),
        status: 'uploaded'
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }, 1000);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentStatus = (docName) => {
    const uploadedDoc = uploadedFiles.find(file => 
      file.name.toLowerCase().includes(docName.toLowerCase().split(' ')[0])
    );
    return uploadedDoc ? 'uploaded' : 'pending';
  };

  const handleFolderSelect = async (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    // Process files from selected folder
    setTimeout(() => {
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleString(),
        status: 'uploaded',
        folder: event.target.webkitdirectory ? 'Selected Folder' : undefined
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      event.target.value = ''; // Reset file input
    }, 1500);
  };

  const handleSubmitApplication = () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one document before submitting.');
      return;
    }
    
    // Check for required documents
    const missingRequired = requiredDocuments
      .filter(doc => doc.required)
      .filter(doc => !uploadedFiles.some(file => 
        file.name.toLowerCase().includes(doc.name.toLowerCase().split(' ')[0])
      ));
    
    if (missingRequired.length > 0) {
      alert(`Please upload these required documents: ${missingRequired.map(d => d.name).join(', ')}`);
      return;
    }
    
    onStartService();
  };

  return (
    <div className="service-details-container">
      <div className="service-details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Services
        </button>
        <h1>{service.name}</h1>
        <p className="service-description">{service.detailedDescription || service.description}</p>
      </div>

      <div className="service-process">
        <div className="process-steps">
          {steps.map(s => (
            <div key={s.number} className={`process-step ${step >= s.number ? 'active' : ''}`}>
              <div className="step-number">{s.number}</div>
              <div className="step-info">
                <h4>{s.title}</h4>
                <p>{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="process-content">
          {step === 1 && (
            <div className="step-content">
              <h2>Service Requirements</h2>
              <div className="requirements-list">
                <div className="requirement">
                  <span className="req-icon">📋</span>
                  <div>
                    <h4>Required Documents</h4>
                    <div className="documents-checklist">
                      {requiredDocuments.map(doc => (
                        <div key={doc.id} className="document-item">
                          <div className="document-info">
                            <span className={`document-status ${getDocumentStatus(doc.name)}`}>
                              {getDocumentStatus(doc.name) === 'uploaded' ? '✓' : '○'}
                            </span>
                            <div>
                              <strong>{doc.name} {doc.required && <span className="required-badge">Required</span>}</strong>
                              <p>{doc.description}</p>
                            </div>
                          </div>
                          <span className="document-type">
                            {doc.required ? 'Mandatory' : 'Optional'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="requirement">
                  <span className="req-icon">⏱️</span>
                  <div>
                    <h4>Processing Time</h4>
                    <p className="processing-time">{service.processingTime || '5-7 business days'}</p>
                    <small>Your application will be processed once all required documents are submitted</small>
                  </div>
                </div>
                <div className="requirement">
                  <span className="req-icon">📝</span>
                  <div>
                    <h4>Application Process</h4>
                    <ol className="process-list">
                      <li>Review service requirements</li>
                      <li>Upload required documents</li>
                      <li>Submit application</li>
                      <li>Receive confirmation and case number</li>
                      <li>Track application status in dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>Document Upload</h2>
              <p className="upload-instructions">
                Upload all required documents for {service.name}. You can upload individual files or select an entire folder.
              </p>
              
              <div className="upload-options">
                <div className="upload-method">
                  <h4>Upload Individual Files</h4>
                  <div className="upload-area" onClick={handleFileSelect}>
                    <div className="upload-box">
                      📄
                      <p>Click to select files or drag and drop</p>
                      <small>Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</small>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="upload-method">
                  <h4>Upload Entire Folder</h4>
                  <div className="upload-area" onClick={() => document.getElementById('folderInput').click()}>
                    <div className="upload-box folder-upload">
                      📁
                      <p>Click to select a folder</p>
                      <small>All files in the folder will be uploaded</small>
                      <input
                        id="folderInput"
                        type="file"
                        webkitdirectory="true"
                        directory="true"
                        multiple
                        onChange={handleFolderSelect}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isUploading && (
                <div className="uploading-indicator">
                  <div className="spinner"></div>
                  <p>Uploading files...</p>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  <h3>Uploaded Documents ({uploadedFiles.length})</h3>
                  <div className="files-list">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="file-item">
                        <div className="file-icon">
                          {file.type.includes('pdf') ? '📄' : 
                           file.type.includes('image') ? '🖼️' : 
                           file.type.includes('word') ? '📝' : '📎'}
                        </div>
                        <div className="file-info">
                          <strong>{file.name}</strong>
                          <div className="file-details">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{file.uploadedAt}</span>
                            {file.folder && <span className="folder-tag">From Folder</span>}
                          </div>
                        </div>
                        <div className="file-actions">
                          <button className="view-btn" title="View">👁️</button>
                          <button 
                            className="remove-btn" 
                            onClick={() => handleRemoveFile(file.id)}
                            title="Remove"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="upload-guidelines">
                <h4>Upload Guidelines:</h4>
                <ul>
                  <li>Ensure all documents are clear and legible</li>
                  <li>Maximum file size: 10MB per document</li>
                  <li>Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                  <li>Name files appropriately for easy identification</li>
                  <li>Upload all required documents before proceeding</li>
                </ul>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>Application Review</h2>
              <div className="review-card">
                <h3>Application Summary</h3>
                <div className="review-details">
                  <div className="summary-section">
                    <h4>Service Information</h4>
                    <p><strong>Service:</strong> {service.name}</p>
                    <p><strong>Application Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Application ID:</strong> APP-{Date.now().toString().slice(-8)}</p>
                  </div>
                  
                  <div className="summary-section">
                    <h4>Uploaded Documents</h4>
                    <div className="documents-summary">
                      <p><strong>Total Files:</strong> {uploadedFiles.length}</p>
                      <p><strong>Required Documents:</strong> {
                        requiredDocuments.filter(doc => 
                          doc.required && uploadedFiles.some(file => 
                            file.name.toLowerCase().includes(doc.name.toLowerCase().split(' ')[0])
                          )
                        ).length
                      }/{requiredDocuments.filter(doc => doc.required).length} completed</p>
                    </div>
                    <div className="uploaded-files-preview">
                      {uploadedFiles.slice(0, 3).map(file => (
                        <div key={file.id} className="file-preview">
                          <span>📄</span>
                          <span>{file.name}</span>
                        </div>
                      ))}
                      {uploadedFiles.length > 3 && (
                        <div className="more-files">+{uploadedFiles.length - 3} more files</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="confirmation-check">
                  <input type="checkbox" id="confirm" defaultChecked />
                  <label htmlFor="confirm">
                    I confirm that all information provided is accurate and documents are authentic
                  </label>
                </div>
              </div>

              <div className="submission-notice">
                <h4>⚠️ Important Notice</h4>
                <p>
                  By submitting this application, you acknowledge that:
                </p>
                <ul>
                  <li>All uploaded documents are authentic and unaltered</li>
                  <li>False information may lead to legal consequences</li>
                  <li>Application processing begins after submission</li>
                  <li>You will receive updates via your registered email</li>
                </ul>
              </div>
            </div>
          )}

          <div className="process-actions">
            {step > 1 && (
              <button className="process-btn secondary" onClick={() => setStep(step - 1)}>
                ← Previous
              </button>
            )}
            {step < 3 ? (
              <button className="process-btn primary" onClick={() => setStep(step + 1)}>
                Continue →
              </button>
            ) : (
              <button className="process-btn primary submit-btn" onClick={handleSubmitApplication}>
                📤 Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
import React, { useState, useRef, useEffect } from 'react';
import './ServiceDetails.css';

const ServiceDetails = ({ service, onStartService, onBack }) => {
  const [step, setStep] = useState(2);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const fileInputRef = useRef(null);
  
  // Service-specific configurations
  const serviceConfigs = {
    'Document Submission': {
      steps: [
        { number: 1, title: 'Document Overview', description: 'Learn about submission requirements' },
        { number: 2, title: 'Upload Documents', description: 'Upload your legal documents' },
        { number: 3, title: 'Review & Submit', description: 'Verify and submit documents to court' }
      ],
      requiredDocuments: [
        { id: 1, name: 'Identification Document', description: 'Valid ID or Passport (PDF, JPG, PNG)', required: true },
        { id: 2, name: 'Case Documents', description: 'Legal documents to submit', required: true },
        { id: 3, name: 'Cover Letter', description: 'Explanation letter (optional)', required: false },
      ],
      processingTime: '1-2 business days',
      showDocumentUpload: true,
      showPayment: false,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: false,
      showContact: false
    },
    // ... (other service configs remain the same)
  };

  // Get configuration for current service
  const config = serviceConfigs[service.name] || serviceConfigs['Document Submission'];
  const steps = config.steps;
  const requiredDocuments = config.requiredDocuments;

  // Load submitted requests from localStorage on component mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('submittedRequests');
    if (savedRequests) {
      setSubmittedRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Save submitted requests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('submittedRequests', JSON.stringify(submittedRequests));
  }, [submittedRequests]);

  const handleFileSelect = () => {
    if (config.showDocumentUpload) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    if (!config.showDocumentUpload) return;
    
    const files = Array.from(event.target.files);
    setIsUploading(true);
    
    setTimeout(() => {
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toLocaleString(),
        status: 'uploaded',
        previewURL: URL.createObjectURL(file),
        fileObject: file
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      event.target.value = '';
    }, 1000);
  };

  const handleRemoveFile = (fileId) => {
    const fileToRemove = uploadedFiles.find(file => file.id === fileId);
    if (fileToRemove && fileToRemove.previewURL) {
      URL.revokeObjectURL(fileToRemove.previewURL);
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = () => {
    if (config.showDocumentUpload && uploadedFiles.length === 0) {
      alert('Please upload at least one document before submitting.');
      return;
    }

    const newRequest = {
      id: Date.now(),
      service: service.name,
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted',
      referenceId: `${service.name.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-8)}`,
      files: [...uploadedFiles],
      formData: { ...formData },
      processingTime: config.processingTime
    };

    setSubmittedRequests(prev => [newRequest, ...prev]);
    setUploadedFiles([]);
    setFormData({});
    setStep(1);
    
    alert(`${service.name} submitted successfully!\nReference ID: ${newRequest.referenceId}`);
  };

  const renderDocumentSidebar = () => (
    <div className="documents-sidebar">
      <div className="sidebar-section">
        <div className="section-header">
          <div className="section-icon">📂</div>
          <h3>Uploaded Documents</h3>
        </div>
        {uploadedFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📎</div>
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="uploaded-files-sidebar">
            {uploadedFiles.map(file => (
              <div key={file.id} className="file-item-sidebar">
                <div className="file-icon">
                  {file.type.includes('pdf') ? '📄' : 
                   file.type.includes('image') ? '🖼️' : 
                   file.type.includes('word') ? '📝' : '📎'}
                </div>
                <div className="file-info-sidebar">
                  <strong className="file-name">{file.name}</strong>
                  <div className="file-meta">
                    <span className="file-size">{formatFileSize(file.size)}</span>
                    <span className="file-date">{file.uploadedAt.split(',')[0]}</span>
                  </div>
                </div>
                <button 
                  className="btn-icon remove-btn" 
                  onClick={() => handleRemoveFile(file.id)}
                  title="Remove"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <div className="section-icon">✅</div>
          <h3>Submitted Requests</h3>
        </div>
        {submittedRequests.filter(req => req.service === service.name).length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No requests submitted yet</p>
          </div>
        ) : (
          <div className="submitted-requests">
            {submittedRequests
              .filter(req => req.service === service.name)
              .map(request => (
                <div key={request.id} className="request-item">
                  <div className="request-header">
                    <span className="request-ref">{request.referenceId}</span>
                    <span className={`request-status ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="request-meta">
                    <span>{request.submittedAt}</span>
                    <span>{request.files.length} files</span>
                  </div>
                  <div className="request-preview">
                    {request.files.slice(0, 2).map((file, index) => (
                      <span key={index} className="file-preview-item">
                        {file.type.includes('pdf') ? '📄' : 
                         file.type.includes('image') ? '🖼️' : '📎'}
                      </span>
                    ))}
                    {request.files.length > 2 && (
                      <span className="more-files-count">+{request.files.length - 2}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep1Content = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Service Requirements</h2>
        <p className="step-description">Review what's needed to complete this service</p>
      </div>
      
      <div className="requirements-grid">
        {config.showDocumentUpload && (
          <div className="requirement-card">
            <div className="card-header">
              <div className="card-icon">📋</div>
              <h3>Required Documents</h3>
            </div>
            <div className="documents-list">
              {requiredDocuments.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="document-check">
                    <div className={`check-circle ${getDocumentStatus(doc.name)}`}>
                      {getDocumentStatus(doc.name) === 'uploaded' ? '✓' : ''}
                    </div>
                  </div>
                  <div className="document-details">
                    <div className="document-name">
                      <span>{doc.name}</span>
                      {doc.required && <span className="badge required">Required</span>}
                    </div>
                    <p className="document-description">{doc.description}</p>
                  </div>
                  <div className="document-type">
                    <span className={`type-tag ${doc.required ? 'mandatory' : 'optional'}`}>
                      {doc.required ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="requirement-card">
          <div className="card-header">
            <div className="card-icon">⏱️</div>
            <h3>Processing Time</h3>
          </div>
          <div className="processing-info">
            <div className="time-display">{config.processingTime}</div>
            <p className="time-note">Your request will be processed according to court procedures</p>
          </div>
        </div>
        
        <div className="requirement-card">
          <div className="card-header">
            <div className="card-icon">📝</div>
            <h3>Service Process</h3>
          </div>
          <div className="process-list">
            {steps.map(step => (
              <div key={step.number} className="process-step-item">
                <div className="step-indicator">{step.number}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2Content = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>{service.name} Details</h2>
        <p className="step-description">Complete the required information</p>
      </div>
      
      {config.showDocumentUpload && (
        <div className="upload-section">
          <div className="section-card">
            <div className="section-header">
              <h3>Upload Documents</h3>
              <p className="section-subtitle">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)</p>
            </div>
            
            <div className="upload-area" onClick={handleFileSelect}>
              <div className="upload-box">
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p className="upload-title">Drop files here or click to browse</p>
                <p className="upload-subtitle">Select one or multiple files</p>
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
            
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files ({uploadedFiles.length})</h4>
                <div className="files-grid">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="file-card">
                      <div className="file-icon">
                        {file.type.includes('pdf') ? '📄' : 
                         file.type.includes('image') ? '🖼️' : 
                         file.type.includes('word') ? '📝' : '📎'}
                      </div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-details">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                      </div>
                      <button 
                        className="btn-icon remove-btn"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {config.showPayment && (
        <div className="form-section">
          <div className="section-card">
            <h3>Payment Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Amount to Pay</label>
                <div className="amount-display">ETB 2,500.00</div>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select" name="paymentMethod" onChange={handleInputChange}>
                  <option value="">Select payment method</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Banking</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showSearch && (
        <div className="form-section">
          <div className="section-card">
            <h3>Search Criteria</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Case Number</label>
                <input className="form-input" type="text" name="caseNumber" onChange={handleInputChange} placeholder="Enter case number" />
              </div>
              <div className="form-group">
                <label className="form-label">Document Type</label>
                <select className="form-select" name="documentType" onChange={handleInputChange}>
                  <option value="">Select document type</option>
                  <option value="judgment">Judgment</option>
                  <option value="order">Court Order</option>
                  <option value="filing">Case Filing</option>
                  <option value="evidence">Evidence</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showAppointment && (
        <div className="form-section">
          <div className="section-card">
            <h3>Schedule Appointment</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Select Date</label>
                <input className="form-input" type="date" name="appointmentDate" onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Select Time</label>
                <select className="form-select" name="appointmentTime" onChange={handleInputChange}>
                  <option value="">Select time slot</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showComplaintForm && (
        <div className="form-section">
          <div className="section-card">
            <h3>Complaint Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Complaint Type</label>
                <select className="form-select" name="complaintType" onChange={handleInputChange}>
                  <option value="">Select type</option>
                  <option value="procedure">Court Procedure</option>
                  <option value="staff">Staff Behavior</option>
                  <option value="facility">Facility Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="complaintDescription" onChange={handleInputChange} rows="4" placeholder="Describe your complaint in detail"></textarea>
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showFeedback && (
        <div className="form-section">
          <div className="section-card">
            <h3>Your Feedback</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Service to Review</label>
                <select className="form-select" name="serviceToReview" onChange={handleInputChange}>
                  <option value="">Select service</option>
                  {Object.keys(serviceConfigs).map(serviceName => (
                    <option key={serviceName} value={serviceName}>{serviceName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="star-btn">
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Comments</label>
                <textarea className="form-textarea" name="feedbackComments" onChange={handleInputChange} rows="4" placeholder="Share your experience"></textarea>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="uploading-overlay">
          <div className="uploading-content">
            <div className="spinner"></div>
            <p>Uploading files...</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3Content = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Review & Submit</h2>
        <p className="step-description">Verify all information before submission</p>
      </div>
      
      <div className="review-card">
        <div className="review-header">
          <h3>{service.name} Summary</h3>
          <span className="reference-id">
            Ref: {service.name.slice(0, 3).toUpperCase()}-{Date.now().toString().slice(-8)}
          </span>
        </div>
        
        <div className="review-sections">
          <div className="review-section">
            <h4>Service Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Service</span>
                <span className="info-value">{service.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Request Date</span>
                <span className="info-value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Processing Time</span>
                <span className="info-value">{config.processingTime}</span>
              </div>
            </div>
          </div>
          
          {config.showDocumentUpload && uploadedFiles.length > 0 && (
            <div className="review-section">
              <h4>Uploaded Documents ({uploadedFiles.length})</h4>
              <div className="files-preview">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="file-review-item">
                    <div className="file-icon">📄</div>
                    <div className="file-review-info">
                      <span className="file-review-name">{file.name}</span>
                      <span className="file-review-size">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(formData).length > 0 && (
            <div className="review-section">
              <h4>Entered Details</h4>
              <div className="details-grid">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="detail-item">
                    <span className="detail-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="confirmation-box">
          <label className="checkbox-container">
            <input type="checkbox" id="confirm" defaultChecked />
            <span className="checkmark"></span>
            <span className="checkbox-label">
              I confirm that all information provided is accurate and complete
            </span>
          </label>
        </div>
      </div>

      <div className="notice-card">
        <div className="notice-header">
          <div className="notice-icon">⚠️</div>
          <h4>Important Notice</h4>
        </div>
        <p className="notice-text">
          By submitting this request, you acknowledge that all information provided is truthful and accurate. 
          False information may result in legal consequences.
        </p>
      </div>
    </div>
  );

  const renderServiceSpecificContent = () => {
    switch(step) {
      case 1: return renderStep1Content();
      case 2: return renderStep2Content();
      case 3: return renderStep3Content();
      default: return renderStep1Content();
    }
  };

  return (
    <div className="service-details-container">
      <div className="service-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Services
        </button>
        
        <div className="service-title-section">
          <div className="service-badge">{service.name.charAt(0)}</div>
          <div>
            <h1 className="service-title">{service.name}</h1>
            <p className="service-subtitle">
              {service.description || `Complete your ${service.name.toLowerCase()} request`}
            </p>
          </div>
        </div>
      </div>

      <div className="service-process-wrapper">
        <div className="process-header">
          <div className="progress-steps">
            {steps.map(s => (
              <div key={s.number} className={`progress-step ${step === s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > s.number ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  ) : (
                    <span>{s.number}</span>
                  )}
                </div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-description">{s.description}</div>
                </div>
                {s.number < steps.length && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="process-layout">
          <div className="main-content">
            <div className="content-wrapper">
              {renderServiceSpecificContent()}
              
              <div className="action-bar">
                <div className="action-left">
                  {step > 1 && (
                    <button className="btn-secondary" onClick={() => setStep(step - 1)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                      </svg>
                      Previous
                    </button>
                  )}
                </div>
                <div className="action-right">
                  {step < steps.length ? (
                    <button className="btn-primary" onClick={() => setStep(step + 1)}>
                      Continue
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </button>
                  ) : (
                    <button className="btn-submit" onClick={handleSubmitApplication}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                      Submit Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar">
            {renderDocumentSidebar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
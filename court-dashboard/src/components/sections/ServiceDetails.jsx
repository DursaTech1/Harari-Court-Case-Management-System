import React, { useState, useRef, useEffect } from 'react';
import './ServiceDetails.css';

const ServiceDetails = ({ service, onStartService, onBack }) => {
  const [step, setStep] = useState(2);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({});
  const [submittedRequests, setSubmittedRequests] = useState([]);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
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
    'Arbitration Fee': {
      steps: [
        { number: 1, title: 'Fee Calculation', description: 'Calculate arbitration fees' },
        { number: 2, title: 'Payment Details', description: 'Complete payment information' },
        { number: 3, title: 'Review & Submit', description: 'Verify and submit payment' }
      ],
      processingTime: 'Immediate confirmation',
      showDocumentUpload: true,
      requiredDocuments: [
        { id: 1, name: 'Arbitration Agreement', description: 'Signed arbitration agreement (PDF)', required: true },
        { id: 2, name: 'Claim Details', description: 'Statement of claim (PDF, DOC)', required: true },
        { id: 3, name: 'Proof of Dispute Value', description: 'Supporting documents for claim amount', required: true },
      ],
      showPayment: true,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: false,
      showContact: false
    },
    'Search Document': {
      steps: [
        { number: 1, title: 'Search Criteria', description: 'Specify document search parameters' },
        { number: 2, title: 'Upload Authorization', description: 'Upload search authorization' },
        { number: 3, title: 'Review & Submit', description: 'Verify and submit search request' }
      ],
      processingTime: '3-5 business days',
      showDocumentUpload: true,
      requiredDocuments: [
        { id: 1, name: 'Authorization Letter', description: 'Legal authorization for document search (PDF)', required: true },
        { id: 2, name: 'Case Reference', description: 'Case reference documents (PDF)', required: true },
        { id: 3, name: 'Identification', description: 'Government ID for verification', required: true },
      ],
      showPayment: false,
      showSearch: true,
      showAppointment: false,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: false,
      showContact: false
    },
    'Daily Appointment': {
      steps: [
        { number: 1, title: 'Select Date & Time', description: 'Choose appointment slot' },
        { number: 2, title: 'Case Information', description: 'Provide case details' },
        { number: 3, title: 'Review & Submit', description: 'Verify and book appointment' }
      ],
      processingTime: 'Confirmation within 1 hour',
      showDocumentUpload: false,
      showPayment: false,
      showSearch: false,
      showAppointment: true,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: true,
      showContact: false
    },
    'Complaint Form': {
      steps: [
        { number: 1, title: 'Complaint Details', description: 'Describe your complaint' },
        { number: 2, title: 'Supporting Evidence', description: 'Upload supporting documents' },
        { number: 3, title: 'Review & Submit', description: 'Verify and submit complaint' }
      ],
      processingTime: '5-7 business days',
      showDocumentUpload: true,
      requiredDocuments: [
        { id: 1, name: 'Complaint Statement', description: 'Detailed complaint description (PDF, DOC)', required: true },
        { id: 2, name: 'Supporting Evidence', description: 'Photos, documents, or other evidence', required: false },
        { id: 3, name: 'Witness Statements', description: 'Statements from witnesses (if any)', required: false },
      ],
      showPayment: false,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: true,
      showFeedback: false,
      showLocation: false,
      showContact: true
    },
    'Feedback': {
      steps: [
        { number: 1, title: 'Service Feedback', description: 'Rate and review services' },
        { number: 2, title: 'Additional Comments', description: 'Provide detailed feedback' },
        { number: 3, title: 'Review & Submit', description: 'Verify and submit feedback' }
      ],
      processingTime: 'Submitted immediately',
      showDocumentUpload: false,
      showPayment: false,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: false,
      showFeedback: true,
      showLocation: false,
      showContact: false
    },
  };

  // Get configuration for current service
  const config = serviceConfigs[service.name] || serviceConfigs['Document Submission'];
  const steps = config.steps;
  const requiredDocuments = config.requiredDocuments || [];

  // Calculate arbitration fee based on claim amount
  useEffect(() => {
    if (service.name === 'Arbitration Fee' && formData.claimAmount) {
      const amount = parseFloat(formData.claimAmount.replace(/,/g, '')) || 0;
      let calculatedFee = 0;
      
      if (amount <= 100000) {
        calculatedFee = 5000;
      } else if (amount <= 500000) {
        calculatedFee = 10000;
      } else if (amount <= 1000000) {
        calculatedFee = 20000;
      } else if (amount <= 5000000) {
        calculatedFee = 35000;
      } else {
        calculatedFee = 50000;
      }
      
      setPaymentAmount(calculatedFee);
    }
  }, [formData.claimAmount, service.name]);

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

  const handleRatingClick = (rating) => {
    setFeedbackRating(rating);
    setFormData(prev => ({ ...prev, rating: rating }));
  };

  const handleClaimAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    const formattedValue = value ? parseInt(value).toLocaleString() : '';
    setFormData(prev => ({ ...prev, claimAmount: formattedValue }));
  };

  const handleSubmitApplication = () => {
    if (config.showDocumentUpload && uploadedFiles.length === 0) {
      alert('Please upload at least one document before submitting.');
      return;
    }

    if (service.name === 'Arbitration Fee' && !formData.claimAmount) {
      alert('Please enter the claim amount to calculate fees.');
      return;
    }

    if (service.name === 'Daily Appointment' && (!formData.appointmentDate || !formData.appointmentTime)) {
      alert('Please select both date and time for the appointment.');
      return;
    }

    if (service.name === 'Complaint Form' && !formData.complaintDescription) {
      alert('Please describe your complaint in detail.');
      return;
    }

    if (service.name === 'Feedback' && feedbackRating === 0) {
      alert('Please provide a rating for the service.');
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
      processingTime: config.processingTime,
      ...(service.name === 'Arbitration Fee' && { paymentAmount: paymentAmount })
    };

    setSubmittedRequests(prev => [newRequest, ...prev]);
    setUploadedFiles([]);
    setFormData({});
    setFeedbackRating(0);
    setPaymentAmount(0);
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

  const renderStep1Content = () => {
    if (service.name === 'Arbitration Fee') {
      return (
        <div className="step-content">
          <div className="step-header">
            <h2>Arbitration Fee Calculation</h2>
            <p className="step-description">Calculate fees based on your claim amount</p>
          </div>
          
          <div className="section-card">
            <h3>Fee Calculation</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Claim Amount (ETB)</label>
                <input 
                  className="form-input" 
                  type="text" 
                  name="claimAmount" 
                  value={formData.claimAmount || ''}
                  onChange={handleClaimAmountChange}
                  placeholder="Enter claim amount"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Calculated Fee</label>
                <div className="amount-display">
                  ETB {paymentAmount.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="fee-schedule">
              <h4>Fee Schedule</h4>
              <div className="schedule-table">
                <div className="schedule-row header">
                  <div className="schedule-cell">Claim Amount (ETB)</div>
                  <div className="schedule-cell">Arbitration Fee (ETB)</div>
                </div>
                <div className="schedule-row">
                  <div className="schedule-cell">Up to 100,000</div>
                  <div className="schedule-cell">5,000</div>
                </div>
                <div className="schedule-row">
                  <div className="schedule-cell">100,001 - 500,000</div>
                  <div className="schedule-cell">10,000</div>
                </div>
                <div className="schedule-row">
                  <div className="schedule-cell">500,001 - 1,000,000</div>
                  <div className="schedule-cell">20,000</div>
                </div>
                <div className="schedule-row">
                  <div className="schedule-cell">1,000,001 - 5,000,000</div>
                  <div className="schedule-cell">35,000</div>
                </div>
                <div className="schedule-row">
                  <div className="schedule-cell">Above 5,000,000</div>
                  <div className="schedule-cell">50,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
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
  };

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

      {config.showPayment && service.name === 'Arbitration Fee' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Payment Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Amount to Pay</label>
                <div className="amount-display">ETB {paymentAmount.toLocaleString()}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select className="form-select" name="paymentMethod" onChange={handleInputChange} required>
                  <option value="">Select payment method</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Banking</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Account Number (if bank transfer)</label>
                <input className="form-input" type="text" name="accountNumber" onChange={handleInputChange} placeholder="Enter account number" />
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showSearch && service.name === 'Search Document' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Search Criteria</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Case Number *</label>
                <input className="form-input" type="text" name="caseNumber" onChange={handleInputChange} placeholder="Enter case number" required />
              </div>
              <div className="form-group">
                <label className="form-label">Document Type *</label>
                <select className="form-select" name="documentType" onChange={handleInputChange} required>
                  <option value="">Select document type</option>
                  <option value="judgment">Judgment</option>
                  <option value="order">Court Order</option>
                  <option value="filing">Case Filing</option>
                  <option value="evidence">Evidence</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Additional Search Keywords</label>
                <input className="form-input" type="text" name="keywords" onChange={handleInputChange} placeholder="Enter keywords separated by commas" />
              </div>
              <div className="form-group">
                <label className="form-label">Case Year</label>
                <input className="form-input" type="number" name="caseYear" onChange={handleInputChange} placeholder="YYYY" min="1900" max={new Date().getFullYear()} />
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showAppointment && service.name === 'Daily Appointment' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Schedule Appointment</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Select Date *</label>
                <input 
                  className="form-input" 
                  type="date" 
                  name="appointmentDate" 
                  onChange={handleInputChange} 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select Time *</label>
                <select className="form-select" name="appointmentTime" onChange={handleInputChange} required>
                  <option value="">Select time slot</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Purpose of Visit *</label>
                <select className="form-select" name="purpose" onChange={handleInputChange} required>
                  <option value="">Select purpose</option>
                  <option value="case_inquiry">Case Inquiry</option>
                  <option value="document_submission">Document Submission</option>
                  <option value="hearing">Case Hearing</option>
                  <option value="consultation">Legal Consultation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Case Number (if applicable)</label>
                <input className="form-input" type="text" name="appointmentCaseNumber" onChange={handleInputChange} placeholder="Enter case number" />
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showComplaintForm && service.name === 'Complaint Form' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Complaint Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Complaint Type *</label>
                <select className="form-select" name="complaintType" onChange={handleInputChange} required>
                  <option value="">Select type</option>
                  <option value="procedure">Court Procedure</option>
                  <option value="staff">Staff Behavior</option>
                  <option value="facility">Facility Issue</option>
                  <option value="delay">Service Delay</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Incident</label>
                <input className="form-input" type="date" name="incidentDate" onChange={handleInputChange} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description *</label>
                <textarea 
                  className="form-textarea" 
                  name="complaintDescription" 
                  onChange={handleInputChange} 
                  rows="4" 
                  placeholder="Describe your complaint in detail including date, time, people involved, and what happened"
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Case Number (if related)</label>
                <input className="form-input" type="text" name="complaintCaseNumber" onChange={handleInputChange} placeholder="Enter case number" />
              </div>
              <div className="form-group">
                <label className="form-label">Department/Office</label>
                <input className="form-input" type="text" name="department" onChange={handleInputChange} placeholder="Enter department/office name" />
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showFeedback && service.name === 'Feedback' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Your Feedback</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Service to Review *</label>
                <select className="form-select" name="serviceToReview" onChange={handleInputChange} required>
                  <option value="">Select service</option>
                  {Object.keys(serviceConfigs).map(serviceName => (
                    <option key={serviceName} value={serviceName}>{serviceName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Rating *</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      className={`star-btn ${star <= feedbackRating ? 'active' : ''}`}
                      onClick={() => handleRatingClick(star)}
                      type="button"
                    >
                      ★
                    </button>
                  ))}
                  <span className="rating-text">
                    {feedbackRating > 0 ? `${feedbackRating} star${feedbackRating > 1 ? 's' : ''}` : 'Select rating'}
                  </span>
                </div>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Comments</label>
                <textarea 
                  className="form-textarea" 
                  name="feedbackComments" 
                  onChange={handleInputChange} 
                  rows="4" 
                  placeholder="Share your experience, suggestions, or any issues you encountered"
                ></textarea>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Would you recommend this service to others?</label>
                <div className="recommendation-buttons">
                  <button 
                    type="button"
                    className={`recommend-btn ${formData.recommend === 'yes' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, recommend: 'yes' }))}
                  >
                    Yes
                  </button>
                  <button 
                    type="button"
                    className={`recommend-btn ${formData.recommend === 'no' ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, recommend: 'no' }))}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showLocation && service.name === 'Daily Appointment' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Location Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Court Location *</label>
                <select className="form-select" name="courtLocation" onChange={handleInputChange} required>
                  <option value="">Select court location</option>
                  <option value="main">Main Court Building</option>
                  <option value="branch1">North Branch Court</option>
                  <option value="branch2">South Branch Court</option>
                  <option value="branch3">East Branch Court</option>
                  <option value="branch4">West Branch Court</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department/Section</label>
                <input className="form-input" type="text" name="department" onChange={handleInputChange} placeholder="Enter department/section" />
              </div>
            </div>
          </div>
        </div>
      )}

      {config.showContact && service.name === 'Complaint Form' && (
        <div className="form-section">
          <div className="section-card">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" type="text" name="fullName" onChange={handleInputChange} required placeholder="Enter your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" name="email" onChange={handleInputChange} required placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" type="tel" name="phone" onChange={handleInputChange} required placeholder="Enter your phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Contact Method</label>
                <select className="form-select" name="contactMethod" onChange={handleInputChange}>
                  <option value="">Select method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="sms">SMS</option>
                </select>
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
              {service.name === 'Arbitration Fee' && paymentAmount > 0 && (
                <div className="info-item">
                  <span className="info-label">Amount Due</span>
                  <span className="info-value">ETB {paymentAmount.toLocaleString()}</span>
                </div>
              )}
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
                    <span className="detail-label">{key.replace(/([A-Z])/g, ' $1').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}</span>
                    <span className="detail-value">{value || 'Not specified'}</span>
                  </div>
                ))}
                {service.name === 'Arbitration Fee' && paymentAmount > 0 && !formData.paymentAmount && (
                  <div className="detail-item">
                    <span className="detail-label">payment amount</span>
                    <span className="detail-value">ETB {paymentAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="confirmation-box">
          <label className="checkbox-container">
            <input type="checkbox" id="confirm" required />
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
          {service.name === 'Arbitration Fee' && ' Payment is non-refundable once processed.'}
          {service.name === 'Complaint Form' && ' Your complaint will be reviewed within the specified processing time.'}
          {service.name === 'Daily Appointment' && ' Appointment confirmation will be sent via email/SMS.'}
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
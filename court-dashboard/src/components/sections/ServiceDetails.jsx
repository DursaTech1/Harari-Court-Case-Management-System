import React, { useState, useRef } from 'react';
import './ServiceDetails.css';
import { submitServiceRequest } from "../../api/api";



const ServiceDetails = ({ service, onStartService, onBack }) => {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({});
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
        { number: 1, title: 'Fee Overview', description: 'Understand fee structure and requirements' },
        { number: 2, title: 'Payment Details', description: 'Enter payment information' },
        { number: 3, title: 'Review & Pay', description: 'Verify and complete payment' }
      ],
      requiredDocuments: [
        { id: 1, name: 'Case Reference Number', description: 'Your case reference ID', required: true },
        { id: 2, name: 'Payment Slip', description: 'Previous payment receipt (if any)', required: false },
      ],
      processingTime: 'Immediate (payment confirmation)',
      showDocumentUpload: false,
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
        { number: 1, title: 'Search Criteria', description: 'Define search parameters' },
        { number: 2, title: 'Search Results', description: 'View found documents' },
        { number: 3, title: 'Document Request', description: 'Request document access' }
      ],
      requiredDocuments: [
        { id: 1, name: 'Search Authorization', description: 'Proof of right to search', required: true },
        { id: 2, name: 'Case Details', description: 'Case number or parties involved', required: true },
      ],
      processingTime: '2-4 business hours',
      showDocumentUpload: false,
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
        { number: 2, title: 'Enter Details', description: 'Provide appointment information' },
        { number: 3, title: 'Confirm Booking', description: 'Review and book appointment' }
      ],
      requiredDocuments: [
        { id: 1, name: 'Identification', description: 'Valid ID for verification', required: true },
        { id: 2, name: 'Case Reference', description: 'Case number (if applicable)', required: false },
      ],
      processingTime: 'Booking confirmation immediate',
      showDocumentUpload: false,
      showPayment: false,
      showSearch: false,
      showAppointment: true,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: false,
      showContact: false
    },
    'Complaint Form': {
      steps: [
        { number: 1, title: 'Complaint Details', description: 'Describe your complaint' },
        { number: 2, title: 'Supporting Evidence', description: 'Upload supporting documents' },
        { number: 3, title: 'Review & Submit', description: 'Verify and submit complaint' }
      ],
      requiredDocuments: [
        { id: 1, name: 'Complaint Statement', description: 'Detailed complaint description', required: true },
        { id: 2, name: 'Supporting Evidence', description: 'Documents supporting complaint', required: false },
        { id: 3, name: 'Witness Information', description: 'Witness details (if any)', required: false },
      ],
      processingTime: '3-5 business days',
      showDocumentUpload: true,
      showPayment: false,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: true,
      showFeedback: false,
      showLocation: false,
      showContact: false
    },
    'FeedBack': {
      steps: [
        { number: 1, title: 'Service Selection', description: 'Select service to provide feedback on' },
        { number: 2, title: 'Feedback Details', description: 'Provide your feedback' },
        { number: 3, title: 'Submit Feedback', description: 'Review and submit feedback' }
      ],
      requiredDocuments: [],
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
    'Find Location': {
      steps: [
        { number: 1, title: 'Court Selection', description: 'Select court location' },
        { number: 2, title: 'View Details', description: 'View location information' },
        { number: 3, title: 'Get Directions', description: 'Get directions to location' }
      ],
      requiredDocuments: [],
      processingTime: 'Immediate access',
      showDocumentUpload: false,
      showPayment: false,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: true,
      showContact: false
    },
    'Contact us': {
      steps: [
        { number: 1, title: 'Contact Method', description: 'Select preferred contact method' },
        { number: 2, title: 'Message Details', description: 'Enter your message' },
        { number: 3, title: 'Submit Inquiry', description: 'Review and submit contact request' }
      ],
      requiredDocuments: [
        { id: 1, name: 'Contact Information', description: 'Your contact details', required: true },
      ],
      processingTime: 'Response within 1-2 business days',
      showDocumentUpload: false,
      showPayment: false,
      showSearch: false,
      showAppointment: false,
      showComplaintForm: false,
      showFeedback: false,
      showLocation: false,
      showContact: true
    }
  };

  // Get configuration for current service
  const config = serviceConfigs[service.name] || serviceConfigs['Document Submission'];
  const steps = config.steps;
  const requiredDocuments = config.requiredDocuments;

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
  originalFile: file // 🔑 REQUIRED FOR DJANGO
}));

      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
      event.target.value = '';
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleSubmitApplication = async () => {
  if (config.showDocumentUpload && uploadedFiles.length === 0) {
    alert('Please upload at least one document before submitting.');
    return;
  }

  const formPayload = new FormData();
  formPayload.append('service_name', service.name);

  // append form fields
  Object.entries(formData).forEach(([key, value]) => {
    formPayload.append(key, value);
  });

  // append uploaded files
  uploadedFiles.forEach((fileObj, index) => {
    formPayload.append(`documents[${index}]`, fileObj.originalFile || fileObj);
  });

  try {
    await submitServiceRequest(service.name, formPayload);
    onStartService(); // KEEP existing flow
  } catch (error) {
    console.error(error);
    alert('Failed to submit service request. Please try again.');
  }
};


  // Render service-specific content based on step
  const renderServiceSpecificContent = () => {
    if (step === 1) {
      return renderStep1Content();
    } else if (step === 2) {
      return renderStep2Content();
    } else if (step === 3) {
      return renderStep3Content();
    }
  };

  const renderStep1Content = () => (
    <div className="step-content">
      <h2>Service Requirements</h2>
      <div className="requirements-list">
        {config.showDocumentUpload && (
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
        )}
        
        <div className="requirement">
          <span className="req-icon">⏱️</span>
          <div>
            <h4>Processing Time</h4>
            <p className="processing-time">{config.processingTime}</p>
            <small>Your request will be processed according to court procedures</small>
          </div>
        </div>
        
        <div className="requirement">
          <span className="req-icon">📝</span>
          <div>
            <h4>Service Process</h4>
            <ol className="process-list">
              {steps.map(step => (
                <li key={step.number}>{step.title}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2Content = () => (
    <div className="step-content">
      <h2>{service.name} Details</h2>
      
      {config.showDocumentUpload && (
        <>
          <p className="upload-instructions">
            Upload all required documents for {service.name}. Supported formats: PDF, JPG, PNG, DOC, DOCX.
          </p>
          
          <div className="upload-options">
            <div className="upload-method">
              <div className="upload-area" onClick={handleFileSelect}>
                <div className="upload-box">
                  📄
                  <p>Click to select files</p>
                  <small>Max 10MB per file</small>
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
          </div>
        </>
      )}

      {config.showPayment && (
        <div className="payment-details">
          <h3>Payment Information</h3>
          <div className="payment-form">
            <div className="form-group">
              <label>Amount to Pay</label>
              <input type="text" value="ETB 2,500.00" readOnly className="amount-display" />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select name="paymentMethod" onChange={handleInputChange}>
                <option value="">Select payment method</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Banking</option>
                <option value="card">Credit/Debit Card</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {config.showSearch && (
        <div className="search-details">
          <h3>Search Criteria</h3>
          <div className="search-form">
            <div className="form-group">
              <label>Case Number</label>
              <input type="text" name="caseNumber" onChange={handleInputChange} placeholder="Enter case number" />
            </div>
            <div className="form-group">
              <label>Document Type</label>
              <select name="documentType" onChange={handleInputChange}>
                <option value="">Select document type</option>
                <option value="judgment">Judgment</option>
                <option value="order">Court Order</option>
                <option value="filing">Case Filing</option>
                <option value="evidence">Evidence</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {config.showAppointment && (
        <div className="appointment-details">
          <h3>Schedule Appointment</h3>
          <div className="appointment-form">
            <div className="form-group">
              <label>Select Date</label>
              <input type="date" name="appointmentDate" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Select Time</label>
              <select name="appointmentTime" onChange={handleInputChange}>
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
      )}

      {config.showComplaintForm && (
        <div className="complaint-details">
          <h3>Complaint Details</h3>
          <div className="complaint-form">
            <div className="form-group">
              <label>Complaint Type</label>
              <select name="complaintType" onChange={handleInputChange}>
                <option value="">Select type</option>
                <option value="procedure">Court Procedure</option>
                <option value="staff">Staff Behavior</option>
                <option value="facility">Facility Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="complaintDescription" onChange={handleInputChange} rows="4" placeholder="Describe your complaint in detail"></textarea>
            </div>
          </div>
        </div>
      )}

      {config.showFeedback && (
        <div className="feedback-details">
          <h3>Your Feedback</h3>
          <div className="feedback-form">
            <div className="form-group">
              <label>Service to Review</label>
              <select name="serviceToReview" onChange={handleInputChange}>
                <option value="">Select service</option>
                {Object.keys(serviceConfigs).map(serviceName => (
                  <option key={serviceName} value={serviceName}>{serviceName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Rating</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="star">★</span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Comments</label>
              <textarea name="feedbackComments" onChange={handleInputChange} rows="4" placeholder="Share your experience"></textarea>
            </div>
          </div>
        </div>
      )}

      {config.showLocation && (
        <div className="location-details">
          <h3>Court Locations</h3>
          <div className="location-selector">
            <select name="courtLocation" onChange={handleInputChange}>
              <option value="">Select court location</option>
              <option value="harari-main">Harari Main Court</option>
              <option value="harari-civil">Civil Court Harar</option>
              <option value="harari-criminal">Criminal Court Harar</option>
              <option value="harari-appeal">Appeal Court Harar</option>
            </select>
          </div>
          <div className="location-info">
            <p><strong>Address:</strong> Selected court address will appear here</p>
            <p><strong>Hours:</strong> Mon-Fri, 8:30 AM - 5:30 PM</p>
            <p><strong>Contact:</strong> +251 XXX XXX XXX</p>
          </div>
        </div>
      )}

      {config.showContact && (
        <div className="contact-details">
          <h3>Contact Information</h3>
          <div className="contact-form">
            <div className="form-group">
              <label>Contact Method</label>
              <select name="contactMethod" onChange={handleInputChange}>
                <option value="">Select method</option>
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
                <option value="office">Office Visit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Your Message</label>
              <textarea name="contactMessage" onChange={handleInputChange} rows="4" placeholder="How can we help you?"></textarea>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="uploading-indicator">
          <div className="spinner"></div>
          <p>Uploading files...</p>
        </div>
      )}

      {config.showDocumentUpload && uploadedFiles.length > 0 && (
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
                  </div>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => handleRemoveFile(file.id)}
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3Content = () => (
    <div className="step-content">
      <h2>Review & Submit</h2>
      <div className="review-card">
        <h3>{service.name} Summary</h3>
        <div className="review-details">
          <div className="summary-section">
            <h4>Service Information</h4>
            <p><strong>Service:</strong> {service.name}</p>
            <p><strong>Request Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Reference ID:</strong> {service.name.slice(0, 3).toUpperCase()}-{Date.now().toString().slice(-8)}</p>
          </div>
          
          {config.showDocumentUpload && uploadedFiles.length > 0 && (
            <div className="summary-section">
              <h4>Uploaded Documents</h4>
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
          )}

          {Object.keys(formData).length > 0 && (
            <div className="summary-section">
              <h4>Entered Details</h4>
              {Object.entries(formData).map(([key, value]) => (
                <p key={key}><strong>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</strong> {value}</p>
              ))}
            </div>
          )}
        </div>
        
        <div className="confirmation-check">
          <input type="checkbox" id="confirm" defaultChecked />
          <label htmlFor="confirm">
            I confirm that all information provided is accurate and complete
          </label>
        </div>
      </div>

      <div className="submission-notice">
        <h4>⚠️ Important Notice</h4>
        <p>
          By submitting this request, you acknowledge that all information provided is truthful.
        </p>
      </div>
    </div>
  );

  return (
    <div className="service-details-container">
      <div className="service-details-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Services
        </button>
        <h1>{service.name}</h1>
        <p className="service-description">
          {service.description || `Complete your ${service.name.toLowerCase()} request`}
        </p>
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
          {renderServiceSpecificContent()}
          
          <div className="process-actions">
            {step > 1 && (
              <button className="process-btn secondary" onClick={() => setStep(step - 1)}>
                 Previous
              </button>
            )}
            {step < 3 ? (
              <button className="process-btn primary" onClick={() => setStep(step + 1)}>
                Continue 
              </button>
            ) : (
              <button className="process-btn primary submit-btn" onClick={handleSubmitApplication}>
                📤 Submit {service.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;

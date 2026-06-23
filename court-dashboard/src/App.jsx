import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import RegisterModal from './components/modals/RegisterModal';
import LoginModal from './components/modals/LoginModal';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userCases, setUserCases] = useState([]);

  // Demo data constants
  const courtServices = [
    { 
      id: 1, 
      name: 'Case Filing', 
      icon: '📄', 
      description: 'File new court cases online',
      requirements: ['Valid ID', 'Case Details', 'Supporting Documents']
    },
    { 
      id: 2, 
      name: 'Case Status', 
      icon: '📊', 
      description: 'Check your case progress',
      requirements: ['Case Number']
    },
    { 
      id: 3, 
      name: 'Document Submission', 
      icon: '📤', 
      description: 'Submit legal documents',
      requirements: ['Case Number', 'Document Files', 'Document Type']
    },
    { 
      id: 4, 
      name: 'Search Document', 
      icon: '🔍', 
      description: 'Pay court fees online',
      requirements: ['Case Number', 'Payment Amount']
    },
    { 
      id: 5, 
      name: 'Arbitration Fee', 
      icon: '📅', 
      description: 'View hearing dates',
      requirements: ['Case Number']
    },
    { 
      id: 6, 
      name: 'Legal Aid Request', 
      icon: '⚖️', 
      description: 'Request legal assistance',
      requirements: ['Income Proof', 'Case Details', 'Personal Information']
    },
    { 
      id: 7, 
      name: 'Appeal Filing', 
      icon: '↗️', 
      description: 'File appeal applications',
      requirements: ['Original Case Number', 'Appeal Grounds', 'Supporting Evidence']
    },
    
  ];

  const notifications = [
    { id: 1, message: 'Hearing scheduled for HC-2024-001 on Dec 15', time: '2 hours ago', type: 'hearing' },
    { id: 2, message: 'Document approved for submission', time: '1 day ago', type: 'document' },
    { id: 3, message: 'Payment of ETB 500.00 received', time: '2 days ago', type: 'payment' },
    { id: 4, message: 'New message from your lawyer', time: '3 days ago', type: 'message' },
  ];

  // Initialize demo data
  useEffect(() => {
    const demoCases = [
      { 
        id: 'HC-2024-001', 
        title: 'Civil Case #245', 
        status: 'Pending', 
        nextHearing: '2024-12-15 10:00 AM',
        department: 'Civil Division',
        judge: 'Judge Ahmed Mohammed'
      },
      { 
        id: 'HC-2024-002', 
        title: 'Property Dispute', 
        status: 'Active', 
        nextHearing: '2024-12-10 02:30 PM',
        department: 'Property Division',
        judge: 'Judge Fatima Ali'
      },
      { 
        id: 'HC-2024-003', 
        title: 'Contract Case', 
        status: 'Completed', 
        nextHearing: 'N/A',
        department: 'Commercial Division',
        judge: 'Judge Omar Hassan'
      },
    ];
    setUserCases(demoCases);
    
    const savedUser = localStorage.getItem('harariCourtUser');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleRegisterSubmit = (userData) => {
    setUserData(userData);
    localStorage.setItem('harariCourtUser', JSON.stringify(userData));
    setIsLoggedIn(true);
    setIsRegisterOpen(false);
  };

  const handleLoginSubmit = (email) => {
    const user = {
      fullName: 'Demo User',
      email: email,
      userId: 'HCU-123456',
      registrationDate: '2024-01-15'
    };
    
    setUserData(user);
    localStorage.setItem('harariCourtUser', JSON.stringify(user));
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggedIn(false);
      setUserData(null);
      localStorage.removeItem('harariCourtUser');
      localStorage.removeItem('token');       // clear JWT token
      localStorage.removeItem('user');        // clear user from AuthContext
    }
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <Dashboard 
          userData={userData}
          onLogout={handleLogout}
          courtServices={courtServices}
          userCases={userCases}
          notifications={notifications}
        />
      ) : (
        <LandingPage 
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
          courtServices={courtServices}
        />
      )}
      
      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSubmit={handleRegisterSubmit}
        />
      )}
      
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSubmit={handleLoginSubmit}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
import React from 'react';
import EmployeeManager from './components/EmployeeManager';
import AttendanceManager from './components/AttendanceManager';
import TicketManager from './components/TicketManager';

export default function App() {
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
	  <header style={{ marginBottom: '32px' }}>
	    <h1 style={{ 
	      color: '#0f172a', 
	      fontSize: '28px', 
	      fontWeight: '700', 
	      lineHeight: '1.3', 
	      marginBottom: '8px' 
	    }}>
	      Enterprise Operations Platform
	    </h1>
	    <p style={{ 
	      color: '#64748b', 
	      fontSize: '14px', 
	      lineHeight: '1.5', 
	      margin: 0 
	    }}>
	      Production platform managing employee records, attendance verification, and internal ticketing.
	    </p>
	  </header>

        <EmployeeManager />
        <AttendanceManager />
        <TicketManager />
      </div>
    </div>
  );
}
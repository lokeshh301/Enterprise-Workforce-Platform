import React, { useState } from 'react';
import { attendanceApi } from '../api/attendanceApi';

export default function AttendanceManager() {
  const [employeeId, setEmployeeId] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClockIn = async () => {
    if (!employeeId) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await attendanceApi.clockIn(Number(employeeId));
      setMessage({ type: 'success', text: `Clocked in successfully at ${res.clockIn}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!employeeId) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await attendanceApi.clockOut(Number(employeeId));
      setMessage({ 
        type: 'success', 
        text: `Clocked out successfully at ${res.clockOut}. Total Hours: ${res.totalHoursWorked || 0} hrs` 
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={cardStyle}>
      <h3>Attendance System</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
        <input 
          placeholder="Employee Database ID" 
          type="number" 
          value={employeeId} 
          onChange={(e) => setEmployeeId(e.target.value)} 
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' }}
        />
        <button disabled={loading} onClick={handleClockIn} style={btnClockIn}>Clock In</button>
        <button disabled={loading} onClick={handleClockOut} style={btnClockOut}>Clock Out</button>
      </div>

      {message && (
        <div style={{ 
          padding: '10px', 
          borderRadius: '4px', 
          background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#991b1b'
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

const cardStyle = { padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' };
const btnClockIn = { padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const btnClockOut = { padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };
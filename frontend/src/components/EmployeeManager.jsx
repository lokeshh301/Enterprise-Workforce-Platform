import React, { useState, useEffect } from 'react';
import { employeeApi } from '../api/employeeApi';

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    employeeCode: '',
    name: '',
    department: '',
    email: '',
    salary: '',
  });

  const fetchEmployees = async (pageNumber = 0) => {
    setLoading(true);
    setErrorBanner('');
    try {
      const data = await employeeApi.getAll(pageNumber, 5);
      setEmployees(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (err) {
      setErrorBanner(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(0);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner('');
    try {
      await employeeApi.create({
        ...formData,
        salary: parseFloat(formData.salary),
      });
      setFormData({ employeeCode: '', name: '', department: '', email: '', salary: '' });
      fetchEmployees(0);
    } catch (err) {
      if (err.fieldErrors) {
        const details = Object.entries(err.fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' | ');
        setErrorBanner(details);
      } else {
        setErrorBanner(err.message);
      }
    }
  };

  return (
    <div style={styles.card}>
      <h3>Employee Management</h3>
      
      {errorBanner && <div style={styles.error}>{errorBanner}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          placeholder="Code (e.g., EMP-1001)" 
          name="employeeCode" 
          value={formData.employeeCode} 
          onChange={handleInputChange} 
          required 
          style={styles.input} 
        />
        <input 
          placeholder="Full Name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          required 
          style={styles.input} 
        />
        <input 
          placeholder="Department" 
          name="department" 
          value={formData.department} 
          onChange={handleInputChange} 
          required 
          style={styles.input} 
        />
        <input 
          placeholder="Email Address" 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
          style={styles.input} 
        />
        <input 
          placeholder="Salary" 
          type="number" 
          name="salary" 
          value={formData.salary} 
          onChange={handleInputChange} 
          required 
          style={styles.input} 
        />
        <button type="submit" style={styles.primaryBtn}>Register Employee</button>
      </form>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employeeCode}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.email}</td>
                <td><span style={styles.badge}>{emp.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.pagination}>
        <button 
          disabled={page === 0} 
          onClick={() => fetchEmployees(page - 1)}
          style={styles.secondaryBtn}
        >
          Previous
        </button>
        <span> Page {page + 1} of {totalPages || 1} </span>
        <button 
          disabled={page + 1 >= totalPages} 
          onClick={() => fetchEmployees(page + 1)}
          style={styles.secondaryBtn}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  form: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  input: { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', flex: '1 1 180px' },
  primaryBtn: { padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  secondaryBtn: { padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '12px' },
  badge: { padding: '2px 8px', borderRadius: '12px', fontSize: '12px', background: '#dcfce7', color: '#15803d' },
  error: { background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px' },
  pagination: { marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }
};
import React, { useState, useEffect } from 'react';
import { ticketApi } from '../api/ticketApi';

export default function TicketManager() {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Form input states
  const [formData, setFormData] = useState({
    requesterId: '',
    title: '',
    priority: 'MEDIUM',
    description: '',
  });

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketApi.getAll(statusFilter, 0, 10);
      setTickets(data.content || []);
    } catch (err) {
      setErrorBanner(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner('');
    setSuccessBanner('');

    try {
      const payload = {
        requesterId: Number(formData.requesterId),
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
      };

      const created = await ticketApi.create(payload);
      setSuccessBanner(`Ticket ${created.ticketCode} raised successfully!`);
      
      // Reset form
      setFormData({
        requesterId: '',
        title: '',
        priority: 'MEDIUM',
        description: '',
      });

      loadTickets();
    } catch (err) {
      if (err.fieldErrors) {
        const details = Object.entries(err.fieldErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(' | ');
        setErrorBanner(details);
      } else {
        setErrorBanner(err.message || 'Could not submit service ticket');
      }
    }
  };

  const handleStatusTransition = async (ticket) => {
    setErrorBanner('');
    setSuccessBanner('');
    try {
      if (ticket.status === 'OPEN') {
        await ticketApi.updateStatus(ticket.id, {
          status: 'IN_PROGRESS',
          resolverId: ticket.requesterId, // auto-assign for demonstration
        });
        setSuccessBanner(`Ticket ${ticket.ticketCode} moved to IN_PROGRESS.`);
      } else if (ticket.status === 'IN_PROGRESS') {
        const notes = prompt('Enter resolution notes (mandatory for closing):');
        if (!notes || !notes.trim()) {
          alert('Resolution notes cannot be empty.');
          return;
        }
        await ticketApi.updateStatus(ticket.id, {
          status: 'RESOLVED',
          resolutionNotes: notes.trim(),
        });
        setSuccessBanner(`Ticket ${ticket.ticketCode} marked as RESOLVED.`);
      }
      loadTickets();
    } catch (err) {
      setErrorBanner(err.message || 'Error advancing ticket status');
    }
  };

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL': return { background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171' };
      case 'HIGH': return { background: '#ffedd5', color: '#9a3412', border: '1px solid #fdba74' };
      case 'MEDIUM': return { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' };
      default: return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'OPEN': return { background: '#e0f2fe', color: '#0369a1' };
      case 'IN_PROGRESS': return { background: '#fef3c7', color: '#b45309' };
      case 'RESOLVED': return { background: '#dcfce7', color: '#15803d' };
      case 'CLOSED': return { background: '#f1f5f9', color: '#64748b' };
      default: return { background: '#f8fafc', color: '#334155' };
    }
  };

  return (
    <div style={ui.wrapper}>
      {/* SECTION 1: HEADER & DESCRIPTIVE BANNER */}
      <div style={ui.sectionHeader}>
        <div>
          <h2 style={ui.title}>Internal Service Ticketing</h2>
          <p style={ui.subtitle}>Log employee workplace issues, IT asset requests, and track SLA resolutions.</p>
        </div>
      </div>

      {errorBanner && <div style={ui.errorAlert}>{errorBanner}</div>}
      {successBanner && <div style={ui.successAlert}>{successBanner}</div>}

      {/* SECTION 2: CREATE TICKET FORM */}
      <div style={ui.card}>
        <h4 style={ui.cardTitle}>Submit a Service Request</h4>
        <form onSubmit={handleSubmit} style={ui.formGrid}>
          
          {/* Employee ID Field */}
          <div style={ui.inputGroup}>
            <label style={ui.label}>Employee ID <span style={ui.required}>*</span></label>
            <input
              type="number"
              name="requesterId"
              value={formData.requesterId}
              onChange={handleInputChange}
              placeholder="e.g. 1"
              required
              style={ui.input}
            />
            <small style={ui.helperText}>Numeric primary ID from employee directory</small>
          </div>

          {/* Priority Field */}
          <div style={ui.inputGroup}>
            <label style={ui.label}>Priority Level <span style={ui.required}>*</span></label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              style={ui.select}
            >
              <option value="LOW">Low - General Inquiry</option>
              <option value="MEDIUM">Medium - Normal Workflow</option>
              <option value="HIGH">High - Urgent / Blocker</option>
              <option value="CRITICAL">Critical - System Outage</option>
            </select>
            <small style={ui.helperText}>Determines resolver response SLA</small>
          </div>

          {/* Issue Title Field */}
          <div style={{ ...ui.inputGroup, gridColumn: '1 / -1' }}>
            <label style={ui.label}>Issue Title <span style={ui.required}>*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., VPN authorization failed on staging server"
              minLength={5}
              maxLength={150}
              required
              style={ui.input}
            />
            <small style={ui.helperText}>Concise summary of the request (5 - 150 characters)</small>
          </div>

          {/* Details / Description Field */}
          <div style={{ ...ui.inputGroup, gridColumn: '1 / -1' }}>
            <label style={ui.label}>Detailed Description <span style={ui.required}>*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide exact error codes, device hostname, software versions, or reproduction steps..."
              rows={4}
              required
              style={ui.textarea}
            />
            <small style={ui.helperText}>Add all context necessary for IT/Admin diagnostics</small>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={ui.primaryButton}>
              Submit Ticket
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: TICKET LISTING & STATUS WORKFLOW */}
      <div style={ui.card}>
        <div style={ui.filterBar}>
          <h4 style={ui.cardTitle}>Active Service Requests</h4>
          <div style={ui.filterGroup}>
            <label style={ui.filterLabel}>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={ui.filterSelect}
            >
              <option value="">All Tickets</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Refreshing tickets...</p>
        ) : tickets.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
            No service tickets found for the selected view.
          </p>
        ) : (
          <div style={ui.ticketGrid}>
            {tickets.map((t) => (
              <div key={t.id} style={ui.ticketCard}>
                <div style={ui.ticketHeader}>
                  <span style={ui.ticketCode}>{t.ticketCode}</span>
                  <span style={{ ...ui.priorityTag, ...getPriorityBadgeStyle(t.priority) }}>
                    {t.priority}
                  </span>
                </div>

                <h5 style={ui.ticketTitle}>{t.title}</h5>
                <p style={ui.ticketDesc}>{t.description}</p>

                <div style={ui.metaRow}>
                  <span><strong>Requester:</strong> {t.requesterName} (ID: {t.requesterId})</span>
                  {t.resolverName && <span><strong>Resolver:</strong> {t.resolverName}</span>}
                </div>

                {t.resolutionNotes && (
                  <div style={ui.resolutionBox}>
                    <strong>Resolution Note:</strong> {t.resolutionNotes}
                  </div>
                )}

                <div style={ui.cardFooter}>
                  <span style={{ ...ui.statusTag, ...getStatusBadgeStyle(t.status) }}>
                    {t.status}
                  </span>
                  
                  {t.status === 'OPEN' && (
                    <button onClick={() => handleStatusTransition(t)} style={ui.actionBtnYellow}>
                      Start Working →
                    </button>
                  )}
                  {t.status === 'IN_PROGRESS' && (
                    <button onClick={() => handleStatusTransition(t)} style={ui.actionBtnGreen}>
                      Resolve Ticket ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ui = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#0f172a' },
  subtitle: { margin: '4px 0 0', fontSize: '13px', color: '#64748b' },
  card: { background: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' },
  cardTitle: { margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#1e293b' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '500', color: '#334155' },
  required: { color: '#ef4444' },
  helperText: { fontSize: '11px', color: '#94a3b8' },
  input: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' },
  select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' },
  textarea: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' },
  primaryButton: { padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' },
  filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  filterLabel: { fontSize: '13px', color: '#64748b' },
  filterSelect: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' },
  ticketGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' },
  ticketCard: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#fafaf9', display: 'flex', flexDirection: 'column', gap: '8px' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ticketCode: { fontFamily: 'monospace', fontSize: '13px', fontWeight: '700', color: '#0284c7' },
  priorityTag: { padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' },
  ticketTitle: { margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a' },
  ticketDesc: { margin: 0, fontSize: '12px', color: '#475569', lineHeight: '1.4' },
  metaRow: { fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' },
  resolutionBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '6px 8px', fontSize: '11px', color: '#166534' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' },
  statusTag: { padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' },
  actionBtnYellow: { padding: '5px 10px', fontSize: '11px', fontWeight: '600', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  actionBtnGreen: { padding: '5px 10px', fontSize: '11px', fontWeight: '600', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  errorAlert: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' },
  successAlert: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '10px 14px', borderRadius: '6px', fontSize: '13px' },
};
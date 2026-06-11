import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function IncrementForm({ increment, onClose, onSave }) {
  const [effectiveDate, setEffectiveDate] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [previousBaseSalary, setPreviousBaseSalary] = useState('');
  const [newBaseSalary, setNewBaseSalary] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (increment) {
      setEffectiveDate(increment.effectiveDate || '');
      setEmployerName(increment.employerName || '');
      setPreviousBaseSalary(increment.previousBaseSalary || '');
      setNewBaseSalary(increment.newBaseSalary || '');
      setReason(increment.reason || '');
    } else {
      setEffectiveDate(new Date().toISOString().substring(0, 10));
      setEmployerName('');
      setPreviousBaseSalary('');
      setNewBaseSalary('');
      setReason('');
    }
  }, [increment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!effectiveDate || !employerName || !previousBaseSalary || !newBaseSalary) {
      alert('Please fill in all mandatory fields');
      return;
    }

    const payload = {
      effectiveDate,
      employerName,
      previousBaseSalary: parseFloat(previousBaseSalary),
      newBaseSalary: parseFloat(newBaseSalary),
      reason,
    };

    if (increment?.id) {
      payload.id = increment.id;
    }

    onSave(payload);
  };

  const prevVal = parseFloat(previousBaseSalary) || 0;
  const newVal = parseFloat(newBaseSalary) || 0;
  const hikePercentage = prevVal > 0 ? ((newVal - prevVal) / prevVal) * 100 : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in" style={{ maxWidth: '550px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glow)' }}>
        <div className="modal-header">
          <h2>{increment ? 'Edit Increment Milestone' : 'Log Salary Increment'}</h2>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              
              <div className="form-group">
                <label className="form-label">Employer Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Effective Date *</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Previous Base *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    required
                    placeholder="0.00"
                    value={previousBaseSalary}
                    onChange={(e) => setPreviousBaseSalary(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Base *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    required
                    placeholder="0.00"
                    value={newBaseSalary}
                    onChange={(e) => setNewBaseSalary(e.target.value)}
                  />
                </div>
              </div>

              {prevVal > 0 && newVal > 0 && (
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Calculated Hike Percentage:</span>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: hikePercentage >= 0 ? 'var(--color-success)' : 'var(--color-error)'
                  }}>
                    {hikePercentage >= 0 ? '+' : ''}{hikePercentage.toFixed(2)}%
                  </span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Reason / Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                  placeholder="e.g. Annual appraisal cycle, promotion to Senior Engineer"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {increment ? 'Save Milestone' : 'Log Increment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

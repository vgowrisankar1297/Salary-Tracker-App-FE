import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function SalaryForm({ record, onClose, onSave }) {
  const [month, setMonth] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [status, setStatus] = useState('PAID');
  const [notes, setNotes] = useState('');
  const [spendingAllowance, setSpendingAllowance] = useState('');

  const [allowances, setAllowances] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [deductions, setDeductions] = useState([]);

  useEffect(() => {
    if (record) {
      setMonth(record.month || '');
      setEmployerName(record.employerName || '');
      setBaseSalary(record.baseSalary || '');
      setPaymentDate(record.paymentDate || '');
      setStatus(record.status || 'PAID');
      setNotes(record.notes || '');
      setSpendingAllowance(record.spendingAllowance || '');

      setAllowances(
        record.allowances
          ? Object.entries(record.allowances).map(([k, v]) => ({ key: k, value: v }))
          : []
      );
      setBonuses(
        record.bonuses
          ? Object.entries(record.bonuses).map(([k, v]) => ({ key: k, value: v }))
          : []
      );
      setDeductions(
        record.deductions
          ? Object.entries(record.deductions).map(([k, v]) => ({ key: k, value: v }))
          : []
      );
    } else {
      setMonth(new Date().toISOString().substring(0, 7));
      setEmployerName('');
      setBaseSalary('');
      setPaymentDate(new Date().toISOString().substring(0, 10));
      setStatus('PAID');
      setNotes('');
      setSpendingAllowance('');

      setAllowances([
        { key: 'House Rent Allowance', value: '' },
        { key: 'Medical Allowance', value: '' },
      ]);
      setBonuses([
        { key: 'Performance Bonus', value: '' },
      ]);
      setDeductions([
        { key: 'Income Tax', value: '' },
        { key: 'Provident Fund', value: '' },
        { key: 'Health Insurance', value: '' },
      ]);
    }
  }, [record]);

  const handleAddField = (setter) => {
    setter((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveField = (setter, index) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (setter, index, field, val) => {
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const convertToMap = (arr) => {
    const map = {};
    arr.forEach((item) => {
      if (item.key.trim()) {
        map[item.key.trim()] = parseFloat(item.value) || 0.0;
      }
    });
    return map;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!month || !employerName || !baseSalary || !paymentDate) {
      alert('Please fill in all mandatory fields');
      return;
    }

    const payload = {
      month,
      employerName,
      baseSalary: parseFloat(baseSalary),
      paymentDate,
      status,
      notes,
      spendingAllowance: parseFloat(spendingAllowance) || 0.0,
      allowances: convertToMap(allowances),
      bonuses: convertToMap(bonuses),
      deductions: convertToMap(deductions),
    };

    if (record?.id) {
      payload.id = record.id;
    }

    onSave(payload);
  };

  const totalAllowances = allowances.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalBonuses = bonuses.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0);
  const grossSalary = (parseFloat(baseSalary) || 0) + totalAllowances + totalBonuses;
  const netSalary = grossSalary - totalDeductions;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glow)' }}>
        <div className="modal-header">
          <h2>{record ? 'Edit Salary Record' : 'Log New Salary Slip'}</h2>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
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
                <label className="form-label">Salary Month *</label>
                <input
                  type="month"
                  className="form-input"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Base Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  required
                  placeholder="0.00"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Date *</label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Status *</label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., direct deposit details"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Spending Allowance (Budget Limit) (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="e.g. 20000"
                  value={spendingAllowance}
                  onChange={(e) => setSpendingAllowance(e.target.value)}
                />
              </div>

              <div className="form-section-title">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Allowances</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                    onClick={() => handleAddField(setAllowances)}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
              
              <div className="dynamic-fields-container">
                {allowances.map((item, idx) => (
                  <div key={`allowance-${idx}`} className="dynamic-row">
                    <input
                      type="text"
                      placeholder="Allowance Name"
                      className="form-input"
                      value={item.key}
                      onChange={(e) => handleFieldChange(setAllowances, idx, 'key', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="form-input"
                      style={{ maxWidth: '180px' }}
                      value={item.value}
                      onChange={(e) => handleFieldChange(setAllowances, idx, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-icon-only danger"
                      onClick={() => handleRemoveField(setAllowances, idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {allowances.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No allowances added.</p>}
              </div>

              <div className="form-section-title">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Bonuses & Perks</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                    onClick={() => handleAddField(setBonuses)}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              <div className="dynamic-fields-container">
                {bonuses.map((item, idx) => (
                  <div key={`bonus-${idx}`} className="dynamic-row">
                    <input
                      type="text"
                      placeholder="Bonus Name"
                      className="form-input"
                      value={item.key}
                      onChange={(e) => handleFieldChange(setBonuses, idx, 'key', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="form-input"
                      style={{ maxWidth: '180px' }}
                      value={item.value}
                      onChange={(e) => handleFieldChange(setBonuses, idx, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-icon-only danger"
                      onClick={() => handleRemoveField(setBonuses, idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {bonuses.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No bonuses added.</p>}
              </div>

              <div className="form-section-title">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Deductions & Taxes</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                    onClick={() => handleAddField(setDeductions)}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              <div className="dynamic-fields-container">
                {deductions.map((item, idx) => (
                  <div key={`deduction-${idx}`} className="dynamic-row">
                    <input
                      type="text"
                      placeholder="Deduction Name"
                      className="form-input"
                      value={item.key}
                      onChange={(e) => handleFieldChange(setDeductions, idx, 'key', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      className="form-input"
                      style={{ maxWidth: '180px' }}
                      value={item.value}
                      onChange={(e) => handleFieldChange(setDeductions, idx, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-icon-only danger"
                      onClick={() => handleRemoveField(setDeductions, idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {deductions.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No deductions added.</p>}
              </div>

              <div className="form-section-title">Quick Breakdown Preview</div>
              <div className="form-group full-width" style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gross Salary</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>₹{grossSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Deductions</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-error)' }}>₹{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Net Take-Home</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-success)' }}>₹{netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {record ? 'Save Changes' : 'Log Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

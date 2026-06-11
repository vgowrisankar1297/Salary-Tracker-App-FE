import React from 'react';
import { X, Printer } from 'lucide-react';

export default function PayslipPreview({ record, onClose }) {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const allowances = record.allowances ? Object.entries(record.allowances) : [];
  const bonuses = record.bonuses ? Object.entries(record.bonuses) : [];
  const deductions = record.deductions ? Object.entries(record.deductions) : [];

  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card animate-fade-in" style={{ maxWidth: '850px', padding: 0 }}>
        
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Payslip Document Viewer</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handlePrint} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              <Printer size={16} /> Print Payslip
            </button>
            <button className="btn-icon-only" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '2.5rem' }}>
          <div className="payslip-sheet">
            <div className="payslip-header">
              <div className="payslip-company">
                <h2>{record.employerName}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Salary Statement</p>
              </div>
              <div className="payslip-title">
                <h3>PAYSLIP</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.25rem' }}>
                  For {formatMonth(record.month)}
                </p>
              </div>
            </div>

            <div className="payslip-details-grid">
              <div className="payslip-details-col">
                <p><strong>Payment Date:</strong> {formatDate(record.paymentDate)}</p>
                <p><strong>Payment Method:</strong> Bank Transfer</p>
              </div>
              <div className="payslip-details-col" style={{ textAlign: 'right' }}>
                <p><strong>Slip Reference:</strong> #SLIP-{record.id ? record.id.substring(record.id.length - 8).toUpperCase() : 'NEW'}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge ${record.status?.toLowerCase() === 'paid' ? 'paid' : 'pending'}`}>
                    {record.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="payslip-table-grid">
              <div className="payslip-table-col">
                <h4>EARNINGS</h4>
                <div className="payslip-row">
                  <span>Base Salary</span>
                  <span>₹{record.baseSalary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                {allowances.map(([key, val]) => (
                  <div key={key} className="payslip-row">
                    <span>{key}</span>
                    <span>₹{val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}

                {bonuses.map(([key, val]) => (
                  <div key={key} className="payslip-row">
                    <span>{key}</span>
                    <span>₹{val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}

                <div className="payslip-row total">
                  <span>Gross Salary</span>
                  <span>₹{record.grossSalary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="payslip-table-col">
                <h4>DEDUCTIONS</h4>
                {deductions.map(([key, val]) => (
                  <div key={key} className="payslip-row">
                    <span>{key}</span>
                    <span style={{ color: 'var(--color-error)' }}>
                      -₹{val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
                {deductions.length === 0 && (
                  <div className="payslip-row" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    <span>No deductions logged</span>
                    <span>₹0.00</span>
                  </div>
                )}

                <div className="payslip-row total">
                  <span>Total Deductions</span>
                  <span style={{ color: 'var(--color-error)' }}>
                    ₹{record.totalDeductions?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="payslip-summary">
              <div className="payslip-summary-box">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>NET TAKE-HOME</span>
                <h3>₹{record.netSalary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
              </div>
            </div>

            {record.notes && (
              <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>REMARKS / NOTES</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{record.notes}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

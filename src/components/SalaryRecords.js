import React, { useState } from 'react';
import { Search, Plus, Download, Edit, Trash2, Eye } from 'lucide-react';

export default function SalaryRecords({
  records,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
  onSelectRecord,
  exportCsvUrl,
}) {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  const years = ['All', ...new Set(records.map((r) => r.month ? r.month.split('-')[0] : ''))]
    .filter((y) => y !== '')
    .sort((a, b) => b - a);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.employerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.notes?.toLowerCase().includes(search.toLowerCase());
    
    const recordYear = r.month ? r.month.split('-')[0] : '';
    const matchesYear = yearFilter === 'All' || recordYear === yearFilter;

    return matchesSearch && matchesYear;
  });

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
    <div className="animate-fade-in">
      <div className="header-row">
        <div className="page-title">
          <h1>Salary Records</h1>
          <p>Manage and audit your historical salary slips and payslips</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href={exportCsvUrl}
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
            download="salary_records.csv"
          >
            <Download size={16} /> Export CSV
          </a>
          <button className="btn btn-primary" onClick={onAddRecord}>
            <Plus size={16} /> Log Salary
          </button>
        </div>
      </div>

      <div className="glass-card toolbar" style={{ padding: '1.25rem' }}>
        <div className="filter-group" style={{ flexGrow: 1 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by employer or remarks..."
              className="form-input"
              style={{ paddingLeft: '2.5rem', width: '100%' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Year:</label>
            <select
              className="form-input"
              style={{ padding: '0.65rem 1rem', width: '130px' }}
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> entries
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Employer</th>
                <th>Base Salary</th>
                <th>Gross Pay</th>
                <th>Deductions</th>
                <th>Net Take-Home</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '600' }}>
                      {formatMonth(item.month)}
                    </td>
                    <td>{item.employerName}</td>
                    <td>₹{item.baseSalary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>₹{item.grossSalary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: 'var(--color-error)' }}>
                      ₹{item.totalDeductions?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                      ₹{item.netSalary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>{formatDate(item.paymentDate)}</td>
                    <td>
                      <span className={`status-badge ${item.status?.toLowerCase() === 'paid' ? 'paid' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                        <button
                          className="btn-icon-only"
                          title="Generate payslip sheet"
                          onClick={() => onSelectRecord(item)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon-only"
                          title="Edit record"
                          onClick={() => onEditRecord(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-icon-only danger"
                          title="Delete record"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the salary entry for ${formatMonth(item.month)}?`)) {
                              onDeleteRecord(item.id);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    No matching records found. Create a new record or modify filters!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

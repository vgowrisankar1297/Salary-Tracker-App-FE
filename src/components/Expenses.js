import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Expenses({ expenses, onAddExpense, onDeleteExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date) return;
    
    setIsSubmitting(true);
    try {
      await onAddExpense({
        title,
        amount: parseFloat(amount),
        category,
        date
      });
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().substring(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return '₹' + (val || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      <div className="header-row">
        <div className="page-title">
          <h1>Spendings & Expenses</h1>
          <p>Log your daily expenses and track spending category allocations</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Log New Expense</h3>
              <p>Add a new spending record to calculate against your budget</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Title / Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Weekly Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="e.g. 750"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="Food">Food & Groceries</option>
                <option value="Rent">Rent & Housing</option>
                <option value="Utilities">Utilities & Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel & Commute</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group full-width" style={{ marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={isSubmitting}>
                <Plus size={18} />
                <span>{isSubmitting ? 'Logging...' : 'Log Expense'}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-header">
            <div className="chart-title">
              <h3>Recent Expense Logs</h3>
              <p>Chronological record of your spendings</p>
            </div>
          </div>

          <div className="table-container" style={{ flexGrow: 1, maxHeight: '420px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses && expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td style={{ fontWeight: '500' }}>{expense.title}</td>
                      <td>
                        <span className="timeline-stat-pill" style={{ textTransform: 'capitalize' }}>
                          {expense.category}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {formatDate(expense.date)}
                      </td>
                      <td style={{ fontWeight: '600', color: 'var(--color-error)' }}>
                        {formatCurrency(expense.amount)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn-icon-only danger"
                          onClick={() => onDeleteExpense(expense.id)}
                          title="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                      No expenses logged yet. Add one to start tracking your budget!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, CircleDollarSign, TrendingUp, Activity, X, CheckCircle, AlertCircle, Info, Receipt, LogOut } from 'lucide-react';
import { api } from './services/api';
import Dashboard from './components/Dashboard';
import SalaryRecords from './components/SalaryRecords';
import Increments from './components/Increments';
import Expenses from './components/Expenses';
import SalaryForm from './components/SalaryForm';
import IncrementForm from './components/IncrementForm';
import PayslipPreview from './components/PayslipPreview';
import Login from './components/Login';

export default function App() {
  const [authenticated, setAuthenticated] = useState(api.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(api.getCurrentUser());
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [increments, setIncrements] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [showIncrementForm, setShowIncrementForm] = useState(false);
  const [selectedIncrement, setSelectedIncrement] = useState(null);

  const [previewRecord, setPreviewRecord] = useState(null);

  const [toasts, setToasts] = useState([]);

  const addToast = (text, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadData = async () => {
    if (!api.isAuthenticated()) return;
    try {
      setLoading(true);
      const [statsData, recordsData, incrementsData, expensesData] = await Promise.all([
        api.getDashboardStats(),
        api.getSalaryRecords(),
        api.getIncrements(),
        api.getExpenses(),
      ]);
      setStats(statsData);
      setRecords(recordsData);
      setIncrements(incrementsData);
      setExpenses(expensesData);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to sync data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setAuthenticated(false);
      setCurrentUser(null);
      addToast('Your session has expired. Please sign in again.', 'info');
    };
    
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSalary = async (payload) => {
    try {
      if (payload.id) {
        await api.updateSalaryRecord(payload.id, payload);
        addToast('Salary record updated successfully!', 'success');
      } else {
        await api.createSalaryRecord(payload);
        addToast('New salary record logged successfully!', 'success');
      }
      setShowSalaryForm(false);
      setSelectedRecord(null);
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteSalary = async (id) => {
    try {
      await api.deleteSalaryRecord(id);
      addToast('Salary record deleted successfully!', 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSaveIncrement = async (payload) => {
    try {
      if (payload.id) {
        await api.updateIncrement(payload.id, payload);
        addToast('Increment milestone updated successfully!', 'success');
      } else {
        await api.createIncrement(payload);
        addToast('Salary increment logged successfully!', 'success');
      }
      setShowIncrementForm(false);
      setSelectedIncrement(null);
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteIncrement = async (id) => {
    try {
      await api.deleteIncrement(id);
      addToast('Increment milestone deleted successfully!', 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSaveExpense = async (payload) => {
    try {
      await api.createExpense(payload);
      addToast('Expense logged successfully!', 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.deleteExpense(id);
      addToast('Expense entry deleted successfully!', 'success');
      loadData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setAuthenticated(false);
    setCurrentUser(null);
    setStats(null);
    setRecords([]);
    setIncrements([]);
    setExpenses([]);
    addToast('Logged out successfully.', 'info');
  };

  // User details avatar helpers
  const getUserInitials = () => {
    if (!currentUser || !currentUser.username) return 'US';
    return currentUser.username.slice(0, 2).toUpperCase();
  };

  if (!authenticated) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Login 
          onAuthSuccess={() => {
            setAuthenticated(true);
            setCurrentUser(api.getCurrentUser());
          }} 
          addToast={addToast} 
        />
        
        {/* Render Toast Notifications for Login */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              {toast.type === 'success' && <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />}
              {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--color-error)' }} />}
              {toast.type === 'info' && <Info size={18} style={{ color: 'var(--color-primary)' }} />}
              <span>{toast.text}</span>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Activity size={28} />
          <span>PayPulse</span>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'salaries' ? 'active' : ''}`}
              onClick={() => setActiveTab('salaries')}
            >
              <CircleDollarSign size={20} />
              <span>Salaries</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('expenses')}
            >
              <Receipt size={20} />
              <span>Spendings</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'increments' ? 'active' : ''}`}
              onClick={() => setActiveTab('increments')}
            >
              <TrendingUp size={20} />
              <span>Progression</span>
            </button>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile" style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-avatar">{getUserInitials()}</div>
              <div className="user-details">
                <h4 style={{ textTransform: 'capitalize' }}>{currentUser ? currentUser.username : 'User'}</h4>
                <p>Private Ledger</p>
              </div>
            </div>
            <button 
              className="btn-icon-only danger" 
              onClick={handleLogout} 
              title="Sign Out"
              style={{ padding: '0.6rem', borderRadius: '8px' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {loading && !stats ? (
          <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <Activity className="animate-pulse" size={48} style={{ color: 'var(--color-primary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Syncing PayPulse Database...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                onSelectRecord={(rec) => setPreviewRecord(rec)}
              />
            )}
            {activeTab === 'salaries' && (
              <SalaryRecords
                records={records}
                exportCsvUrl={api.getExportCsvUrl()}
                onAddRecord={() => {
                  setSelectedRecord(null);
                  setShowSalaryForm(true);
                }}
                onEditRecord={(rec) => {
                  setSelectedRecord(rec);
                  setShowSalaryForm(true);
                }}
                onDeleteRecord={handleDeleteSalary}
                onSelectRecord={(rec) => setPreviewRecord(rec)}
              />
            )}
            {activeTab === 'expenses' && (
              <Expenses
                expenses={expenses}
                onAddExpense={handleSaveExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            )}
            {activeTab === 'increments' && (
              <Increments
                increments={increments}
                onAddIncrement={() => {
                  setSelectedIncrement(null);
                  setShowIncrementForm(true);
                }}
                onEditIncrement={(inc) => {
                  setSelectedIncrement(inc);
                  setShowIncrementForm(true);
                }}
                onDeleteIncrement={handleDeleteIncrement}
              />
            )}
          </>
        )}
      </main>

      {showSalaryForm && (
        <SalaryForm
          record={selectedRecord}
          onClose={() => {
            setShowSalaryForm(false);
            setSelectedRecord(null);
          }}
          onSave={handleSaveSalary}
        />
      )}

      {showIncrementForm && (
        <IncrementForm
          increment={selectedIncrement}
          onClose={() => {
            setShowIncrementForm(false);
            setSelectedIncrement(null);
          }}
          onSave={handleSaveIncrement}
        />
      )}

      {previewRecord && (
        <PayslipPreview
          record={previewRecord}
          onClose={() => setPreviewRecord(null)}
        />
      )}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />}
            {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--color-error)' }} />}
            {toast.type === 'info' && <Info size={18} style={{ color: 'var(--color-primary)' }} />}
            <span>{toast.text}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

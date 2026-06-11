import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, CreditCard, PiggyBank, Receipt, ArrowUpRight, ArrowDownRight, Eye } from 'lucide-react';

export default function Dashboard({ stats, onSelectRecord }) {
  if (!stats) return <p>Loading dashboard...</p>;

  const deductionData = Object.entries(stats.deductionBreakdown || {})
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  const allowanceData = Object.entries(stats.allowanceBreakdown || {})
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  const expenseData = Object.entries(stats.expensesByCategory || {})
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#a855f7'];

  const formatCurrency = (val) => {
    return '₹' + (val || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(15, 21, 36, 0.95)',
          border: '1px solid var(--border-glow)',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{payload[0].payload.employerName || 'Salary'}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color, fontSize: '0.85rem', margin: '0.25rem 0' }}>
              <strong>{entry.name}:</strong> ₹{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="header-row">
        <div className="page-title">
          <h1>Dashboard Overview</h1>
          <p>Real-time analytics of your career earnings, allowances, spendings and budgets</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-card">
          <div className="stat-icon primary">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <label>Cumulative Gross</label>
            <div className="stat-value">{formatCurrency(stats.totalGrossEarnings)}</div>
            <div className="stat-trend up">
              <ArrowUpRight size={14} /> Overall career growth
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="stat-icon success">
            <PiggyBank size={24} />
          </div>
          <div className="stat-info">
            <label>Net Take-Home</label>
            <div className="stat-value">{formatCurrency(stats.totalNetReceived)}</div>
            <div className="stat-trend up">
              <ArrowUpRight size={14} /> Total money received
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="stat-icon error">
            <Receipt size={24} />
          </div>
          <div className="stat-info">
            <label>Total Expenses</label>
            <div className="stat-value" style={{ color: 'var(--color-error)' }}>
              {formatCurrency(stats.totalExpenses)}
            </div>
            <div className="stat-trend down">
              <ArrowDownRight size={14} /> Logged spendings
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="stat-icon cyan">
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <label>Monthly Average (Net)</label>
            <div className="stat-value">{formatCurrency(stats.averageMonthlyNet)}</div>
            <div className="stat-trend up">
              <ArrowUpRight size={14} /> Avg take-home payout
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-header">
            <div className="chart-title">
              <h3>Salary, Spendings & Budget History</h3>
              <p>Chronological trends of take-home pay, actual spendings vs budget limits</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '320px' }}>
            {stats.monthlyTrend && stats.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    stroke="var(--text-muted)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                  />
                  <YAxis
                    tickFormatter={formatCurrency}
                    stroke="var(--text-muted)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    name="Net Pay"
                    dataKey="net"
                    stroke="var(--color-success)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorNet)"
                  />
                  <Area
                    type="monotone"
                    name="Spendings"
                    dataKey="expenses"
                    stroke="var(--color-error)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                  <Line
                    type="monotone"
                    name="Budget Limit"
                    dataKey="spendingAllowance"
                    stroke="var(--color-warning)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No historical records logged yet. Add your first salary record to see trends!
              </div>
            )}
          </div>
        </div>

        {/* Monthly Budget Gauge Card */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Monthly Budget Tracker</h3>
              <p>Compare expenses against your latest spending allowance</p>
            </div>
          </div>
          
          {stats.spendingAllowance > 0 || stats.totalExpenses > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '70%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Spent: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(stats.totalExpenses)}</strong></span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Budget: <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(stats.spendingAllowance)}</strong></span>
              </div>
              
              <div style={{ width: '100%', height: '14px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${Math.min((stats.totalExpenses / (stats.spendingAllowance || 1)) * 100, 100)}%`, 
                  height: '100%', 
                  background: stats.totalExpenses > stats.spendingAllowance ? 'var(--gradient-rose)' : 'var(--gradient-emerald)',
                  borderRadius: '10px',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: '600', 
                  color: stats.totalExpenses > stats.spendingAllowance ? 'var(--color-error)' : 'var(--color-success)',
                  backgroundColor: stats.totalExpenses > stats.spendingAllowance ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  border: stats.totalExpenses > stats.spendingAllowance ? '1px solid rgba(244,63,94,0.15)' : '1px solid rgba(16,185,129,0.15)'
                }}>
                  {stats.totalExpenses > stats.spendingAllowance 
                    ? `Over Budget by ${formatCurrency(stats.totalExpenses - stats.spendingAllowance)}` 
                    : `${((stats.totalExpenses / (stats.spendingAllowance || 1)) * 100).toFixed(0)}% Budget Used`
                  }
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Remaining: {formatCurrency(Math.max(stats.spendingAllowance - stats.totalExpenses, 0))}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', height: '70%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
              Set a Spending Allowance (Budget) in your latest Salary record and log expenses to track!
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Expenses Category Pie Chart */}
        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Expense Allocations</h3>
              <p>Distribution of spendings by category</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Spent']} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No expenses logged yet.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Deduction Outflows</h3>
              <p>Breakdown of statutory tax and insurance</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {deductionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deductionData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deductionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Total']} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No deductions to analyze.</span>
            )}
          </div>
        </div>

        <div className="glass-card chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <h3>Allowance Distribution</h3>
              <p>Structure of non-base emoluments</p>
            </div>
          </div>
          <div style={{ width: '100%', height: '280px' }}>
            {allowanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allowanceData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                  />
                  <YAxis
                    tickFormatter={formatCurrency}
                    stroke="var(--text-muted)"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--border-color)' }}
                  />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="value" fill="var(--color-secondary)" radius={[6, 6, 0, 0]}>
                    {allowanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No allowances logged.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="chart-header" style={{ marginBottom: '1rem' }}>
          <div className="chart-title">
            <h3>Recent Salary Slip Logs</h3>
            <p>Your 5 most recently created or updated pay records</p>
          </div>
        </div>

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
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentRecords && stats.recentRecords.length > 0 ? (
                stats.recentRecords.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '600' }}>
                      {formatMonth(item.month)}
                    </td>
                    <td>{item.employerName}</td>
                    <td>₹{item.baseSalary?.toLocaleString()}</td>
                    <td>₹{item.grossSalary?.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-error)' }}>
                      ₹{item.totalDeductions?.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--color-success)' }}>
                      ₹{item.netSalary?.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-badge ${item.status?.toLowerCase() === 'paid' ? 'paid' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon-only"
                        title="View slip details"
                        onClick={() => onSelectRecord(item)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No records logged yet. Add your first pay record under the Salaries tab.
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

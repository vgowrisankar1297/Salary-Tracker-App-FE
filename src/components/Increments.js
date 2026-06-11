import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Plus, Edit, Trash2, Award } from 'lucide-react';

export default function Increments({
  increments,
  onAddIncrement,
  onEditIncrement,
  onDeleteIncrement,
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (val) => {
    return '₹' + (val || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const chartData = [...increments]
    .sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate))
    .flatMap((inc, idx, arr) => {
      const points = [];
      if (idx === 0) {
        points.push({
          dateStr: formatDate(inc.effectiveDate),
          date: inc.effectiveDate,
          salary: inc.previousBaseSalary,
          label: 'Start Base',
        });
      }
      points.push({
        dateStr: formatDate(inc.effectiveDate),
        date: inc.effectiveDate,
        salary: inc.newBaseSalary,
        label: `${inc.percentageIncrease >= 0 ? '+' : ''}${inc.percentageIncrease.toFixed(1)}% Hike`,
      });
      return points;
    });

  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(15, 21, 36, 0.95)',
          border: '1px solid var(--border-glow)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{data.dateStr}</p>
          <p style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)', margin: '0.25rem 0' }}>
            Base Salary: {formatCurrency(data.salary)}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: '600' }}>{data.label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="header-row">
        <div className="page-title">
          <h1>Salary Progression</h1>
          <p>Track base salary growth milestones and compensation appraisals</p>
        </div>
        <button className="btn btn-primary" onClick={onAddIncrement}>
          <Plus size={16} /> Log Increment
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '2.5rem', minHeight: '350px' }}>
        <div className="chart-header">
          <div className="chart-title">
            <h3>Base Salary Growth Curve</h3>
            <p>Chronological milestones showing baseline remuneration changes</p>
          </div>
        </div>
        <div style={{ width: '100%', height: '280px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis
                  dataKey="dateStr"
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
                <Tooltip content={<CustomChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="salary"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  activeDot={{ r: 8, stroke: 'var(--color-secondary)', strokeWidth: 2 }}
                  dot={{ r: 5, fill: 'var(--bg-primary)', stroke: 'var(--color-primary)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No increment milestones logged yet. Click Log Increment to start tracking your salary hikes!
            </div>
          )}
        </div>
      </div>

      <div className="glass-card">
        <div className="chart-header" style={{ marginBottom: '2rem' }}>
          <div className="chart-title">
            <h3>Increment Timeline</h3>
            <p>Career milestones and performance appraisal records</p>
          </div>
        </div>

        {increments.length > 0 ? (
          <div className="timeline">
            {increments.map((inc) => (
              <div key={inc.id} className="timeline-item">
                <div className="timeline-date">{formatDate(inc.effectiveDate)}</div>
                
                <div className="timeline-title">
                  <Award size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>{inc.employerName}</span>
                  <span
                    className="status-badge"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      color: 'var(--color-success)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.5rem',
                    }}
                  >
                    +{inc.percentageIncrease.toFixed(2)}% Hike
                  </span>
                </div>

                <div className="timeline-content">
                  <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: '500' }}>
                    {inc.reason || 'Appraisal increment'}
                  </p>
                  
                  <div className="timeline-stats">
                    <div className="timeline-stat-pill">
                      Previous Base: <strong>₹{inc.previousBaseSalary.toLocaleString()}</strong>
                    </div>
                    <div className="timeline-stat-pill">
                      New Base: <strong>₹{inc.newBaseSalary.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', right: 0, top: '6px', display: 'flex', gap: '0.25rem' }}>
                  <button
                    className="btn-icon-only"
                    title="Edit increment"
                    onClick={() => onEditIncrement(inc)}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="btn-icon-only danger"
                    title="Delete increment"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this increment milestone?')) {
                        onDeleteIncrement(inc.id);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
            No progression records found.
          </p>
        )}
      </div>
    </div>
  );
}

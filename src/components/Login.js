import React, { useState } from 'react';
import { api } from '../services/api';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Login({ onAuthSuccess, addToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        if (!usernameOrEmail || !password) {
          throw new Error('Please fill in all fields');
        }
        const data = await api.login(usernameOrEmail, password);
        addToast(`Welcome back, ${data.username}!`, 'success');
        onAuthSuccess();
      } else {
        if (!username || !email || !password) {
          throw new Error('Please fill in all fields');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await api.register(username, email, password);
        addToast('Registration successful! Please log in.', 'success');
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass-card">
        <div className="login-logo">
          <Activity size={36} />
          <span>PayPulse</span>
        </div>
        
        <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
        <p className="login-subtitle">
          {isLogin ? 'Access your salaries, budgets & progression' : 'Start tracking your career income & expenses'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. gowrisankar"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. gowri@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="gowrisankar or gowri@example.com"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <button 
            type="button" 
            className="toggle-mode-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setUsername('');
              setEmail('');
              setPassword('');
              setUsernameOrEmail('');
            }}
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

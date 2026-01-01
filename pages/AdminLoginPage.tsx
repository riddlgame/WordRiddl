import React, { useState, FormEvent } from 'react';
import { authService } from '../services/authService';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authService.login(password)) {
      onLoginSuccess();
    } else {
      setError('Invalid password.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
       <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Back to game">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
      <div className="w-full max-w-xs">
        <form onSubmit={handleSubmit} className="bg-slate-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="bg-slate-700 border border-slate-600 shadow appearance-none rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
            />
          </div>
           {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

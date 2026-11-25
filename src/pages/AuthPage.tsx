import React, { useState } from 'react';
import { 
  Code2, 
  Mail, 
  Lock, 
  User, 
  AtSign, 
  Phone,
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  RefreshCw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { CURRENT_USER } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    login, 
    register, 
    verifyOtp, 
    pendingAuthEmail,
    addToast 
  } = useApp();

  // Register form state
  const [regName, setRegName] = useState('Alex Rivera');
  const [regUsername, setRegUsername] = useState('alexrivera_dev');
  const [regEmail, setRegEmail] = useState('alex.rivera@devcollab.io');
  const [regPhone, setRegPhone] = useState('+1 (415) 892-3490');
  const [regPassword, setRegPassword] = useState('SecureDevPass123!');

  // Login form state
  const [loginEmail, setLoginEmail] = useState(pendingAuthEmail || 'alex.rivera@devcollab.io');
  const [loginPassword, setLoginPassword] = useState('password123');

  // OTP state
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpTimer, setOtpTimer] = useState(45);

  // Forgot / Reset password state
  const [forgotEmail, setForgotEmail] = useState('alex.rivera@devcollab.io');
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      addToast('Please fill in all required registration fields.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      register(regName, regUsername, regEmail, regPhone);
      setLoginEmail(regEmail);
    }, 600);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(loginEmail);
    }, 600);
  };

  // Quick Demo Login
  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(CURRENT_USER.email);
    }, 400);
  };

  // Handle OTP submission -> redirects to Login page as requested!
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const verified = verifyOtp(code);
      if (verified) {
        setLoginEmail(regEmail);
      }
    }, 600);
  };

  // Handle OTP digit change
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle Reset Password
  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetStep('reset');
      addToast('Password reset code sent to ' + forgotEmail, 'info');
    }, 600);
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Password reset successfully! Please sign in.', 'success');
      setCurrentView('login');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div 
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2.5 cursor-pointer group mb-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-slate-900 dark:text-white font-display">
            Dev<span className="text-teal-600 dark:text-teal-400">Collab</span>
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Developer Collaboration & Networking Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl">
          
          {/* ================= REGISTER VIEW ================= */}
          {currentView === 'register' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Create Developer Account
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Connect with complementary engineers and build projects together.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Alex Rivera"
                    icon={<User className="w-4 h-4" />}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />

                  <Input
                    label="Username"
                    placeholder="e.g. alexrivera_dev"
                    icon={<AtSign className="w-4 h-4" />}
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. alex@domain.com"
                  icon={<Mail className="w-4 h-4" />}
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />

                {/* Mobile Number Option */}
                <Input
                  label="Mobile Number (Optional)"
                  type="tel"
                  placeholder="e.g. +1 (415) 892-3490 or +91 98450 12894"
                  icon={<Phone className="w-4 h-4" />}
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  helperText="Used for account verification and optional communication with accepted connections."
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  helperText="At least 8 characters with numbers and symbols."
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full mt-3 text-base"
                  loading={loading}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Create Account & Verify
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Already registered?{' '}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ================= OTP VERIFICATION VIEW ================= */}
          {currentView === 'verify_otp' && (
            <div>
              <div className="mb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Verify Your Account
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  We sent a 6-digit verification code to <strong className="text-slate-900 dark:text-slate-100">{pendingAuthEmail}</strong>.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                
                {/* 6-box input */}
                <div className="flex justify-between gap-2 max-w-sm mx-auto">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 shadow-inner"
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(['1', '2', '3', '4', '5', '6']);
                      addToast('Simulated OTP [123456] filled!', 'info');
                    }}
                    className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    ⚡ Quick-Fill Test Code (123456)
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 text-center font-medium">
                  After verification, you will proceed to the Login screen to securely sign in.
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full text-base font-semibold"
                  loading={loading}
                >
                  Verify & Proceed to Login
                </Button>

                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium">
                  <span>Resend code in {otpTimer}s</span>
                  <button
                    type="button"
                    onClick={() => addToast('New verification code sent!', 'info')}
                    className="text-teal-600 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to registration</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= LOGIN VIEW ================= */}
          {currentView === 'login' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Welcome Back, Developer
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Sign in to access your connections, messages, and projects.
                </p>
              </div>

              {/* Demo Quick Login Helper Banner */}
              <div className="mb-5 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-teal-900 dark:text-teal-200">
                    One-Click Demo Login
                  </p>
                  <p className="text-xs text-teal-700/90 dark:text-teal-400 truncate">
                    Explore directly as Alex Rivera (Senior Backend Lead)
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={handleDemoLogin}
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Demo Sign In
                </Button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email, Username or Mobile"
                  placeholder="alex.rivera@devcollab.io"
                  icon={<Mail className="w-4 h-4" />}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setCurrentView('forgot_password')}
                      className="text-xs text-teal-600 dark:text-teal-400 hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full mt-3 text-base"
                  loading={loading}
                >
                  Sign In to DevCollab
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setCurrentView('register')}
                    className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Register New Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ================= FORGOT / RESET PASSWORD VIEW ================= */}
          {(currentView === 'forgot_password' || currentView === 'reset_password') && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {resetStep === 'request' ? 'Reset Your Password' : 'Enter New Password'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {resetStep === 'request'
                    ? "Enter your verified email address or mobile number and we'll send you a password reset code."
                    : 'Create a new secure password for your account.'}
                </p>
              </div>

              {resetStep === 'request' ? (
                <form onSubmit={handleResetRequest} className="space-y-4">
                  <Input
                    label="Email Address or Mobile Number"
                    type="text"
                    placeholder="alex.rivera@devcollab.io"
                    icon={<Mail className="w-4 h-4" />}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full mt-3 text-base"
                    loading={loading}
                  >
                    Send Reset Code
                  </Button>
                </form>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                  <Input
                    label="Verification Code"
                    placeholder="123456"
                    icon={<KeyRound className="w-4 h-4" />}
                    defaultValue="123456"
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••••••"
                    icon={<Lock className="w-4 h-4" />}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    helperText="At least 8 characters."
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full mt-3 text-base"
                    loading={loading}
                  >
                    Update Password & Sign In
                  </Button>
                </form>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

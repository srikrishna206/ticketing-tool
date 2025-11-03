// for another UI/UX ok

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [forgot, setForgot] = useState(false);
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(15);
//   const [showReset, setShowReset] = useState(false);
//   const [resetPassword, setResetPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordChanged, setPasswordChanged] = useState(false);

//   // New states for Registration view
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [fullName, setFullName] = useState('');

//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     let interval = null;
//     if (forgot && otpSent && otpTimer > 0) {
//       interval = setInterval(() => setOtpTimer(t => t - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [forgot, otpSent, otpTimer]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await login(email, password);
//       navigate('/for-you');
//     } catch (err) {
//       setError(err.message || 'Failed to log in. Please check your credentials.');
//     }
//   };

//   // Registration form submission handler (dummy, to be replaced with real logic)
//   const handleRegister = (e) => {
//     e.preventDefault();
//     // Registration logic would go here
//     alert('Registered (functionality to be implemented)');
//   };

//   const handleSendOtp = () => {
//     setOtpSent(true);
//     setOtpTimer(15);
//   };

//   const handleOtpInput = (e, idx) => {
//     let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
//     let next = [...otp];
//     next[idx] = val;
//     setOtp(next);
//     if (val && idx < otp.length - 1) {
//       document.getElementById(`otp-field-${idx + 1}`).focus();
//     }
//   };

//   const handleOtpPaste = (e) => {
//     let val = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6).split('');
//     setOtp(otp.map((_, i) => val[i] || ''));
//   };

//   const handleReset = (e) => {
//     e.preventDefault();
//     if (!resetPassword || !confirmPassword) {
//       setError('Please fill both fields');
//       return;
//     }
//     if (resetPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
//     setError('');
//     setPasswordChanged(true);
//   };

//   const styles = {
//     loginContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       background: '#2196F3',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     backgroundAnimation: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: `
//         radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
//         radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
//         radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
//       `,
//     },
//     loginCard: {
//       display: 'flex',
//       backgroundColor: 'rgba(255, 255, 255, 0.95)',
//       backdropFilter: 'blur(20px)',
//       borderRadius: '24px',
//       boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
//       overflow: 'hidden',
//       width: '1000px',
//       maxWidth: '90%',
//       minHeight: '600px',
//       border: '1px solid rgba(255, 255, 255, 0.2)',
//     },
//     loginFormSection: {
//       flex: 1,
//       padding: '50px',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//     },
//     graphicSection: {
//       flex: 1,
//       background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: '40px',
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     heading: {
//       fontSize: '2.8em',
//       color: 'transparent',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       WebkitBackgroundClip: 'text',
//       backgroundClip: 'text',
//       marginBottom: '40px',
//       fontWeight: '700',
//       textAlign: 'center',
//     },
//     form: {
//       width: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '24px',
//     },
//     inputGroup: {
//       position: 'relative',
//     },
//     input: {
//       padding: '18px 20px 18px 60px',
//       border: '2px solid rgba(226, 232, 240, 0.8)',
//       borderRadius: '16px',
//       fontSize: '1em',
//       width: '100%',
//       boxSizing: 'border-box',
//       transition: 'all 0.3s ease',
//       backgroundColor: 'rgba(248, 250, 252, 0.8)',
//       fontWeight: '500',
//     },
//     inputIcon: {
//       position: 'absolute',
//       left: '20px',
//       top: '50%',
//       transform: 'translateY(-50%)',
//       width: '24px',
//       height: '24px',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       borderRadius: '8px',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       color: 'white',
//       fontSize: '14px',
//       fontWeight: 'bold',
//     },
//     button: {
//       background: '#4e54c8',
//       color: 'white',
//       padding: '18px',
//       border: 'none',
//       borderRadius: '16px',
//       fontSize: '1.1em',
//       fontWeight: '600',
//       cursor: 'pointer',
//       transition: 'all 0.3s ease',
//       width: '100%',
//       marginTop: '10px',
//       boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     buttonHover: {
//       position: 'absolute',
//       top: '0',
//       left: '-100%',
//       width: '100%',
//       height: '100%',
//       background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
//       transition: 'left 0.5s',
//     },
//     isRegisteringLink: {
//       marginTop: '30px',
//       fontSize: '0.95em',
//       color: '#718096',
//       textAlign: 'center',
//       display: 'none',
//     },
//     link: {
//       color: '#667eea',
//       textDecoration: 'none',
//       fontWeight: '600',
//     },
//     userIconContainer: {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '30px',
//     },
//     userIcon: {
//       width: '120px',
//       height: '120px',
//       borderRadius: '50%',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontSize: '48px',
//       fontWeight: 'bold',
//       color: 'white',
//       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//       boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
//       transition: 'all 0.3s ease',
//     },
//     userText: {
//       fontSize: '1.5em',
//       color: '#2D3748',
//       fontWeight: '600',
//       textAlign: 'center',
//       marginTop: '20px',
//     },
//     userDescription: {
//       fontSize: '1em',
//       color: '#4A5568',
//       textAlign: 'center',
//       maxWidth: '400px',
//       lineHeight: '1.5',
//     },
//     floatingOrbs: {
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       top: 0,
//       left: 0,
//     },
//     orb: {
//       position: 'absolute',
//       borderRadius: '50%',
//       background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
//       animation: 'float 6s ease-in-out infinite',
//     },
//     errorMessage: {
//       color: '#ff4d4f',
//       textAlign: 'center',
//       marginTop: '15px',
//       fontWeight: '500',
//       fontSize: '0.95em',
//     },
//     bottomActionsContainer: {
//       width: '100%',
//       position: 'absolute',
//       bottom: '30px',
//       left: 0,
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     decorationLine: {
//       width: '80%',
//       height: '2px',
//       background: 'linear-gradient(90deg, #667eea, #764ba2)',
//       marginBottom: '18px',
//       borderRadius: '2px',
//     },
//     forgotAndRegister: {
//       display: 'flex',
//       flexDirection: 'row',
//       gap: '40px',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     bottomText: {
//       color: '#667eea',
//       fontWeight: '600',
//       fontSize: '1.05em',
//       textDecoration: 'none',
//       transition: 'color 0.2s',
//     },
//     bottomTextHover: {
//       color: '#764ba2',
//     },
//     otpFormContainer: {
//       background: '#E0F7FA',
//       borderRadius: '24px',
//       boxShadow: '0 25px 50px rgba(0, 0, 0, 0.07)',
//       padding: '30px 30px 10px 30px',
//       maxWidth: '340px',
//       margin: 'auto'
//     },
//     otpHeading: {
//       textAlign: 'center',
//       fontWeight: 'bold',
//       fontSize: '1.6em',
//       marginBottom: '20px'
//     },
//     otpInput: {
//       width: '38px',
//       height: '38px',
//       fontSize: '1.3em',
//       border: '1.5px solid #bfe2f3',
//       borderRadius: '8px',
//       outline: 'none',
//       textAlign: 'center',
//       background: '#fff'
//     },
//     otpRow: {
//       display: 'flex',
//       gap: '10px',
//       justifyContent: 'center',
//       margin: '18px 0 8px 0'
//     },
//     copyright: {
//       color: '#333',
//       marginTop: '26px',
//       marginBottom: '8px',
//       fontSize: '0.88em',
//       textAlign: 'center'
//     },
//     resetContainer: {
//       background: '#e0f7fa',
//       margin: 'auto',
//       borderRadius: '18px',
//       padding: '30px 30px 10px 30px',
//       width: '340px',
//       marginTop: '40px',
//       boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
//     },
//     resetHeading: {
//       textAlign: 'center',
//       fontWeight: 'bold',
//       fontSize: '1.3em',
//       marginBottom: '15px'
//     },
//     resetInput: {
//       width: '100%',
//       padding: '14px 32px 14px 12px',
//       fontSize: '1.1em',
//       border: '1.5px solid #bfe2f3',
//       borderRadius: '7px',
//       outline: 'none',
//       boxSizing: 'border-box',
//       marginBottom: '16px',
//       background: '#fff'
//     },
//     resetButton: {
//       background: '#4e54c8',
//       color: '#fff',
//       fontWeight: '500',
//       border: 'none',
//       fontSize: '1.15em',
//       borderRadius: '6px',
//       width: '100%',
//       padding: '11px',
//       marginTop: '10px',
//       marginBottom: '20px',
//       cursor: 'pointer',
//       boxShadow: '0 4px 12px rgba(102,126,234,0.1)',
//     },
//     // Success screen styles
//     successContainer: {
//       background: '#E0F7FA',
//       borderRadius: '18px',
//       boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
//       width: '340px',
//       margin: '100px',
//       padding: '40px 20px',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',

//     },
//     successText: {
//       fontSize: '1.5em',
//       fontWeight: 'bold',
//       marginBottom: '28px',
//       letterSpacing: '0.02em',
//       color: '#234e70',
//       textAlign: 'center',
//     },
//     successIcon: {
//       fontSize: '2.2em',
//       color: '#0072e6',
//       marginBottom: '18px',
//       marginTop: '10px',
//     },
//     successButton: {
//       background: '#2196F3',
//       color: 'white',
//       fontWeight: '500',
//       border: 'none',
//       fontSize: '1.15em',
//       borderRadius: '8px',
//       width: '90%',
//       maxWidth: '250px',
//       padding: '11px',
//       marginTop: '18px',
//       cursor: 'pointer',
//       boxShadow: '0 2px 10px rgba(120,119,198,0.07)',
//     },
//     // Registration form styles
//     isRegisteringContainer: {
//       background: '#e0f7fa',
//       maxWidth: '370px',
//       width: '90%',
//       margin: 'auto',
//       borderRadius: '24px',
//       boxShadow: '0 25px 50px rgba(0, 0, 0, 0.07)',
//       padding: '40px 30px 30px 30px',
//       display: 'flex',
//       flexDirection: 'column',
//       gap: '20px',
//     },
//     isRegisteringHeading: {
//       fontWeight: '700',
//       fontSize: '1.7em',
//       color: '#204060',
//       textAlign: 'center',
//       marginBottom: '30px',
//     },
//     isRegisteringInput: {
//       padding: '15px 20px',
//       border: '2px solid rgba(226, 232, 240, 0.8)',
//       borderRadius: '12px',
//       fontSize: '1em',
//       width: '100%',
//       boxSizing: 'border-box',
//       backgroundColor: 'rgba(248, 250, 252, 0.8)',
//       fontWeight: '500',
//       outline: 'none',
//     },
//     isRegisteringButton: {
//       background: '#4e54c8',
//       color: 'white',
//       padding: '15px',
//       border: 'none',
//       borderRadius: '12px',
//       fontSize: '1.2em',
//       fontWeight: '700',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s ease',
//       boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
//     },
//     backToLogin: {
//       color: '#667eea',
//       cursor: 'pointer',
//       fontWeight: '600',
//       textAlign: 'center',
//       marginTop: '24px',
//       fontSize: '1em',
//     },
//   };

//   const userIcon = { icon: '👤' };
//   const orbs = [
//     { size: '120px', top: '10%', left: '10%', animationDelay: '0s' },
//     { size: '80px', top: '70%', left: '80%', animationDelay: '2s' },
//     { size: '100px', top: '20%', left: '85%', animationDelay: '4s' },
//     { size: '90px', top: '80%', left: '15%', animationDelay: '1s' },
//   ];
//   const animationStyles = `
//     @keyframes float {
//       0%, 100% { transform: translateY(0px) rotate(0deg); }
//       50% { transform: translateY(-20px) rotate(180deg); }
//     }
//   `;

//   if (passwordChanged) {
//     return (
//       <div style={styles.loginContainer}>
//         <div style={styles.successContainer}>
//           <div style={{ textAlign: "center", marginBottom: "10px", fontWeight: 'bold', fontSize: '1.3em' }}>
//             FLOW TRACK
//           </div>
//           <div style={styles.successIcon}>
//             ✓✓
//           </div>
//           <div style={styles.successText}>
//             Password Changed Successfully
//           </div>
//           <button
//             style={styles.successButton}
//             onClick={() => {
//               setForgot(false);
//               setOtp(['', '', '', '', '', '']);
//               setOtpSent(false);
//               setOtpTimer(15);
//               setError('');
//               setShowReset(false);
//               setPasswordChanged(false);
//             }}
//           >
//             Back to Login
//           </button>
//           <div style={styles.copyright}>© 2025 Viranchi Technologies Pvt Ltd</div>
//         </div>
//       </div>
//     );
//   }

//   if (forgot && showReset) {
//     return (
//       <div style={styles.loginContainer}>
//         <div style={styles.resetContainer}>
//           <div style={{ ...styles.resetHeading, marginBottom: 20 }}>FLOW TRACK</div>
//           <form onSubmit={handleReset}>
//             <div style={{ fontSize: '1em', marginBottom: '8px' }}>New Password</div>
//             <input
//               type="password"
//               style={styles.resetInput}
//               value={resetPassword}
//               onChange={e => setResetPassword(e.target.value)}
//               placeholder="New Password"
//               required
//             />
//             <div style={{ fontSize: '1em', marginBottom: '8px' }}>Confirm Password</div>
//             <input
//               type="password"
//               style={styles.resetInput}
//               value={confirmPassword}
//               onChange={e => setConfirmPassword(e.target.value)}
//               placeholder="Confirm Password"
//               required
//             />
//             <button type="submit" style={styles.resetButton}>Next</button>
//           </form>
//           <div style={styles.copyright}>© 2025 Viranchi Technologies Pvt Ltd</div>
//           {error && <p style={styles.errorMessage}>{error}</p>}
//         </div>
//       </div>
//     );
//   }

//   if (forgot) {
//     return (
//       <div style={styles.loginContainer}>
//         <div style={styles.backgroundAnimation} />
//         <div style={styles.otpFormContainer}>
//           <div style={styles.otpHeading}>FLOW TRACK</div>
//           <div style={{ marginBottom: '18px', fontWeight: 500, fontSize: '1em' }}>Email Address</div>
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//             style={styles.input}
//             autoFocus
//           />
//           <button
//             type="button"
//             style={{ ...styles.button, marginBottom: '18px', marginTop: '0px' }}
//             disabled={!email || otpSent}
//             onClick={handleSendOtp}
//           >
//             Send OTP
//           </button>
//           <div style={{ fontWeight: 500, fontSize: '1em', marginBottom: '10px' }}>OTP</div>
//           <div style={styles.otpRow}>
//             {otp.map((digit, idx) => (
//               <input
//                 key={idx}
//                 id={`otp-field-${idx}`}
//                 style={styles.otpInput}
//                 maxLength={1}
//                 value={digit}
//                 type="text"
//                 pattern="[0-9]"
//                 inputMode="numeric"
//                 onChange={e => handleOtpInput(e, idx)}
//                 onPaste={handleOtpPaste}
//               />
//             ))}
//           </div>
//           <div style={{ color: '#888', fontSize: '0.95em', textAlign: 'center', marginBottom: 12 }}>
//             {otpSent && otpTimer > 0 ? `${otpTimer} Sec left` : ''}
//           </div>
//           <button
//             type="button"
//             style={styles.button}
//             onClick={() => setShowReset(true)}
//           >
//             Next
//           </button>
//           <button
//             type="button"
//             style={{ ...styles.button, background: '#888', marginTop: '12px' }}
//             onClick={() => { setForgot(false); setOtp(['', '', '', '', '', '']); setOtpSent(false); setOtpTimer(15); setError(''); setShowReset(false); }}
//           >
//             Back to Login
//           </button>
//           {error && <p style={styles.errorMessage}>{error}</p>}
//           <div style={styles.copyright}>© 2025 Viranchi Technologies Pvt Ltd</div>
//         </div>
//       </div>
//     );
//   }

//   // Registration view
//   if (isRegistering) {
//     return (
//       <div style={styles.loginContainer}>
//         <div style={styles.isRegisteringContainer}>
//           <div style={styles.isRegisteringHeading}>FLOW TRACK</div>
//           <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               required
//               style={styles.isRegisteringInput}
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               style={styles.isRegisteringInput}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={styles.isRegisteringInput}
//             />
//             <button type="submit" style={styles.isRegisteringButton}>Sign In</button>
//           </form>
//           <div
//             style={styles.backToLogin}
//             onClick={() => {
//               setIsRegistering(false);
//               setFullName('');
//               setEmail('');
//               setPassword('');
//               setError('');
//             }}
//           >
//             Back to Login
//           </div>
//           <div style={styles.copyright}>© 2025 Viranchi Technologies Pvt Ltd</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{animationStyles}</style>
//       <div style={styles.loginContainer}>
//         <div style={styles.backgroundAnimation} />
//         <div style={styles.loginCard}>
//           <div style={styles.loginFormSection}>
//             <h2 style={styles.heading}>FLOW TRACK</h2>
//             <form onSubmit={handleLogin} style={styles.form}>
//               <div style={styles.inputGroup}>
//                 <div style={styles.inputIcon}>@</div>
//                 <input
//                   type="email"
//                   placeholder="Email Address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   style={styles.input}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#667eea';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 />
//               </div>
//               <div style={styles.inputGroup}>
//                 <div style={styles.inputIcon}>#</div>
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   style={styles.input}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#667eea';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 style={styles.button}
//                 onMouseOver={(e) => {
//                   e.target.style.transform = 'translateY(-3px)';
//                   e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
//                 }}
//                 onMouseOut={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
//                 }}
//                 disabled={loading}
//               >
//                 {loading ? 'Signing In...' : 'Sign In'}
//                 <div style={styles.buttonHover}></div>
//               </button>
//               {error && <p style={styles.errorMessage}>{error}</p>}
//             </form>
//           </div>
//           <div style={styles.graphicSection}>
//             <div style={styles.floatingOrbs}>
//               {orbs.map((orb, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     ...styles.orb,
//                     width: orb.size,
//                     height: orb.size,
//                     top: orb.top,
//                     left: orb.left,
//                     animationDelay: orb.animationDelay,
//                   }}
//                 />
//               ))}
//             </div>
//             <div style={styles.userIconContainer}>
//               <div
//                 style={styles.userIcon}
//                 onMouseOver={(e) => {
//                   e.currentTarget.style.transform = 'scale(1.1)';
//                   e.currentTarget.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.6)';
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.transform = 'scale(1)';
//                   e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
//                 }}
//               >
//                 {userIcon.icon}
//               </div>
//               <h3 style={styles.userText}>Welcome Back</h3>
//               <p style={styles.userDescription}>
//                 Sign in to access your projects, collaborate with your team,
//                 and continue tracking your progress seamlessly.
//               </p>
//             </div>
//             <div style={styles.bottomActionsContainer}>
//               <div style={styles.decorationLine}></div>
//               <div style={styles.forgotAndRegister}>
//                 <span
//                   style={{ ...styles.bottomText, cursor: "pointer" }}
//                   onClick={() => setForgot(true)}
//                   onMouseOver={e => e.currentTarget.style.color = styles.bottomTextHover.color}
//                   onMouseOut={e => e.currentTarget.style.color = styles.bottomText.color}
//                   tabIndex={0}
//                 >
//                   Forgot Password?
//                 </span>
//                 <span
//                   style={{ ...styles.bottomText, cursor: "pointer" }}
//                   onClick={() => setIsRegistering(true)}
//                   onMouseOver={e => e.currentTarget.style.color = styles.bottomTextHover.color}
//                   onMouseOut={e => e.currentTarget.style.color = styles.bottomText.color}
//                   tabIndex={0}
//                 >
//                   Registration
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Login;

// rectify errors

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Simple SVG Icon Components
const MailIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(15);
  const [showReset, setShowReset] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChanged, setPasswordChanged] = useState(false);
  // New states for Registration view
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    let interval = null;
    if (forgot && otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgot, otpSent, otpTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/for-you");
    } catch (err) {
      setError(
        err.message || "Failed to log in. Please check your credentials.",
      );
    }
  };

  // Registration form submission handler (real implementation)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await register(email, password, fullName);
      navigate("/for-you");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpTimer(15);
  };

  const handleOtpInput = (e, idx) => {
    let val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    let next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < otp.length - 1) {
      document.getElementById(`otp-field-${idx + 1}`).focus();
    }
  };

  const handleOtpPaste = (e) => {
    let val = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6)
      .split("");
    setOtp(otp.map((_, i) => val[i] || ""));
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (!resetPassword || !confirmPassword) {
      setError("Please fill both fields");
      return;
    }
    if (resetPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setPasswordChanged(true);
  };

  const styles = {
    loginContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#2196F3",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      position: "relative",
      overflow: "hidden",
    },
    backgroundAnimation: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)`,
    },
    loginCard: {
      display: "flex",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: "24px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      overflow: "hidden",
      width: "1000px",
      maxWidth: "90%",
      minHeight: "600px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    loginFormSection: {
      flex: 1,
      padding: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    graphicSection: {
      flex: 1,
      background:
        "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      position: "relative",
      overflow: "hidden",
    },
    heading: {
      fontSize: "2.8em",
      color: "transparent",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      marginBottom: "40px",
      fontWeight: "700",
      textAlign: "center",
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    inputGroup: {
      position: "relative",
    },
    input: {
      padding: "18px 60px 18px 60px",
      border: "2px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "16px",
      fontSize: "1em",
      width: "100%",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      backgroundColor: "rgba(248, 250, 252, 0.8)",
      fontWeight: "500",
    },
    inputIcon: {
      position: "absolute",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#667eea",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    eyeIcon: {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#667eea",
      cursor: "pointer",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "color 0.2s",
    },
    button: {
      background: "#4e54c8",
      color: "white",
      padding: "18px",
      border: "none",
      borderRadius: "16px",
      fontSize: "1.1em",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
      marginTop: "10px",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
      position: "relative",
      overflow: "hidden",
    },
    buttonHover: {
      position: "absolute",
      top: "0",
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: "left 0.5s",
    },
    isRegisteringLink: {
      marginTop: "30px",
      fontSize: "0.95em",
      color: "#718096",
      textAlign: "center",
      display: "none",
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "600",
    },
    userIconContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
    },
    userIcon: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "48px",
      fontWeight: "bold",
      color: "white",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "0 20px 40px rgba(102, 126, 234, 0.4)",
      transition: "all 0.3s ease",
    },
    userText: {
      fontSize: "1.5em",
      color: "#2D3748",
      fontWeight: "600",
      textAlign: "center",
      marginTop: "20px",
    },
    userDescription: {
      fontSize: "1em",
      color: "#4A5568",
      textAlign: "center",
      maxWidth: "400px",
      lineHeight: "1.5",
    },
    floatingOrbs: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
    },
    orb: {
      position: "absolute",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
      animation: "float 6s ease-in-out infinite",
    },
    errorMessage: {
      color: "#ff4d4f",
      textAlign: "center",
      marginTop: "15px",
      fontWeight: "500",
      fontSize: "0.95em",
    },
    bottomActionsContainer: {
      width: "100%",
      position: "absolute",
      bottom: "30px",
      left: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    decorationLine: {
      width: "80%",
      height: "2px",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      marginBottom: "18px",
      borderRadius: "2px",
    },
    forgotAndRegister: {
      display: "flex",
      flexDirection: "row",
      gap: "40px",
      justifyContent: "center",
      alignItems: "center",
    },
    bottomText: {
      color: "#667eea",
      fontWeight: "600",
      fontSize: "1.05em",
      textDecoration: "none",
      transition: "color 0.2s",
    },
    bottomTextHover: {
      color: "#764ba2",
    },
    otpFormContainer: {
      background: "#E0F7FA",
      borderRadius: "24px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.07)",
      padding: "30px 30px 10px 30px",
      maxWidth: "340px",
      margin: "auto",
    },
    otpHeading: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1.6em",
      marginBottom: "20px",
    },
    otpInput: {
      width: "38px",
      height: "38px",
      fontSize: "1.3em",
      border: "1.5px solid #bfe2f3",
      borderRadius: "8px",
      outline: "none",
      textAlign: "center",
      background: "#fff",
    },
    otpRow: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      margin: "18px 0 8px 0",
    },
    copyright: {
      color: "#333",
      marginTop: "26px",
      marginBottom: "8px",
      fontSize: "0.88em",
      textAlign: "center",
    },
    resetContainer: {
      background: "#e0f7fa",
      margin: "auto",
      borderRadius: "18px",
      padding: "30px 30px 10px 30px",
      width: "340px",
      marginTop: "40px",
      boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
    },
    resetHeading: {
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1.3em",
      marginBottom: "15px",
    },
    resetInput: {
      width: "100%",
      padding: "14px 50px 14px 12px",
      fontSize: "1.1em",
      border: "1.5px solid #bfe2f3",
      borderRadius: "7px",
      outline: "none",
      boxSizing: "border-box",
      marginBottom: "16px",
      background: "#fff",
    },
    resetButton: {
      background: "#4e54c8",
      color: "#fff",
      fontWeight: "500",
      border: "none",
      fontSize: "1.15em",
      borderRadius: "6px",
      width: "100%",
      padding: "11px",
      marginTop: "10px",
      marginBottom: "20px",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(102,126,234,0.1)",
    },
    // Success screen styles
    successContainer: {
      background: "#E0F7FA",
      borderRadius: "18px",
      boxShadow: "0 15px 30px rgba(0,0,0,0.08)",
      width: "340px",
      margin: "100px",
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    successText: {
      fontSize: "1.5em",
      fontWeight: "bold",
      marginBottom: "28px",
      letterSpacing: "0.02em",
      color: "#10b981",
      textAlign: "center",
    },
    successIcon: {
      fontSize: "2.2em",
      color: "#10b981",
      marginBottom: "18px",
      marginTop: "10px",
    },
    successButton: {
      background: "#2196F3",
      color: "white",
      fontWeight: "500",
      border: "none",
      fontSize: "1.15em",
      borderRadius: "8px",
      width: "90%",
      maxWidth: "250px",
      padding: "11px",
      marginTop: "18px",
      cursor: "pointer",
      boxShadow: "0 2px 10px rgba(120,119,198,0.07)",
    },
    // Registration form styles
    isRegisteringContainer: {
      background: "#e0f7fa",
      maxWidth: "370px",
      width: "90%",
      margin: "auto",
      borderRadius: "24px",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.07)",
      padding: "40px 30px 30px 30px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    isRegisteringHeading: {
      fontWeight: "700",
      fontSize: "1.7em",
      color: "#204060",
      textAlign: "center",
      marginBottom: "30px",
    },
    isRegisteringInput: {
      padding: "15px 50px 15px 20px",
      border: "2px solid rgba(226, 232, 240, 0.8)",
      borderRadius: "12px",
      fontSize: "1em",
      width: "100%",
      boxSizing: "border-box",
      backgroundColor: "rgba(248, 250, 252, 0.8)",
      fontWeight: "500",
      outline: "none",
    },
    isRegisteringButton: {
      background: "#4e54c8",
      color: "white",
      padding: "15px",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.2em",
      fontWeight: "700",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      boxShadow: "0 8px 25px rgba(102, 126, 234, 0.4)",
    },
    backToLogin: {
      color: "#667eea",
      cursor: "pointer",
      fontWeight: "600",
      textAlign: "center",
      marginTop: "24px",
      fontSize: "1em",
    },
  };

  const userIcon = { icon: "👤" };

  const orbs = [
    { size: "120px", top: "10%", left: "10%", animationDelay: "0s" },
    { size: "80px", top: "70%", left: "80%", animationDelay: "2s" },
    { size: "100px", top: "20%", left: "85%", animationDelay: "4s" },
    { size: "90px", top: "80%", left: "15%", animationDelay: "1s" },
  ];

  const animationStyles = `@keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }`;

  if (passwordChanged) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.successContainer}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "1.3em",
            }}
          >
            FLOW TRACK
          </div>
          <div style={styles.successIcon}>✓✓</div>
          <div style={styles.successText}>Password Changed Successfully</div>
          <button
            style={styles.successButton}
            onClick={() => {
              setForgot(false);
              setOtp(["", "", "", "", "", ""]);
              setOtpSent(false);
              setOtpTimer(15);
              setError("");
              setShowReset(false);
              setPasswordChanged(false);
              setShowResetPassword(false);
              setShowConfirmPassword(false);
            }}
          >
            Back to Login
          </button>
          <div style={styles.copyright}>
            © 2025 Vunathi Technologies Pvt Ltd
          </div>
        </div>
      </div>
    );
  }

  if (forgot && showReset) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.resetContainer}>
          <div style={{ ...styles.resetHeading, marginBottom: 20 }}>
            FLOW TRACK
          </div>
          <form onSubmit={handleReset}>
            <div style={{ fontSize: "1em", marginBottom: "8px" }}>
              New Password
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showResetPassword ? "text" : "password"}
                style={styles.resetInput}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="New Password"
                required
              />
              <div
                style={styles.eyeIcon}
                onClick={() => setShowResetPassword(!showResetPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#764ba2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#667eea")}
              >
                {showResetPassword ? <EyeOffIcon /> : <EyeIcon />}
              </div>
            </div>
            <div style={{ fontSize: "1em", marginBottom: "8px" }}>
              Confirm Password
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                style={styles.resetInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              <div
                style={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#764ba2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#667eea")}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </div>
            </div>
            <button type="submit" style={styles.resetButton}>
              Next
            </button>
          </form>
          <div style={styles.copyright}>
            © 2025 Vunathi Technologies Pvt Ltd
          </div>
          {error && <p style={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    );
  }

  if (forgot) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.backgroundAnimation} />
        <div style={styles.otpFormContainer}>
          <div style={styles.otpHeading}>FLOW TRACK</div>
          <div
            style={{ marginBottom: "18px", fontWeight: 500, fontSize: "1em" }}
          >
            Email Address
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            autoFocus
          />
          <button
            type="button"
            style={{ ...styles.button, marginBottom: "18px", marginTop: "0px" }}
            disabled={!email || otpSent}
            onClick={handleSendOtp}
          >
            Send OTP
          </button>
          <div
            style={{ fontWeight: 500, fontSize: "1em", marginBottom: "10px" }}
          >
            OTP
          </div>
          <div style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-field-${idx}`}
                style={styles.otpInput}
                maxLength={1}
                value={digit}
                type="text"
                pattern="[0-9]"
                inputMode="numeric"
                onChange={(e) => handleOtpInput(e, idx)}
                onPaste={handleOtpPaste}
              />
            ))}
          </div>
          <div
            style={{
              color: "#888",
              fontSize: "0.95em",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {otpSent && otpTimer > 0 ? `${otpTimer} Sec left` : ""}
          </div>
          <button
            type="button"
            style={styles.button}
            onClick={() => setShowReset(true)}
          >
            Next
          </button>
          <button
            type="button"
            style={{ ...styles.button, background: "#888", marginTop: "12px" }}
            onClick={() => {
              setForgot(false);
              setOtp(["", "", "", "", "", ""]);
              setOtpSent(false);
              setOtpTimer(15);
              setError("");
              setShowReset(false);
            }}
          >
            Back to Login
          </button>
          {error && <p style={styles.errorMessage}>{error}</p>}
          <div style={styles.copyright}>
            © 2025 Vunathi Technologies Pvt Ltd
          </div>
        </div>
      </div>
    );
  }

  // Registration view
  if (isRegistering) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.isRegisteringContainer}>
          <div style={styles.isRegisteringHeading}>FLOW TRACK</div>
          <form
            onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={styles.isRegisteringInput}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.isRegisteringInput}
            />
            <div style={{ position: "relative" }}>
              <input
                type={showRegPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.isRegisteringInput}
              />
              <div
                style={styles.eyeIcon}
                onClick={() => setShowRegPassword(!showRegPassword)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#764ba2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#667eea")}
              >
                {showRegPassword ? <EyeOffIcon /> : <EyeIcon />}
              </div>
            </div>
            <button 
              type="submit" 
              style={styles.isRegisteringButton}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
            {error && <p style={styles.errorMessage}>{error}</p>}
          </form>
          <div
            style={styles.backToLogin}
            onClick={() => {
              setIsRegistering(false);
              setFullName("");
              setEmail("");
              setPassword("");
              setError("");
              setShowRegPassword(false);
            }}
          >
            Back to Login
          </div>
          <div style={styles.copyright}>
            © 2025 Vunathi Technologies Pvt Ltd
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.loginContainer}>
        <div style={styles.backgroundAnimation} />
        <div style={styles.loginCard}>
          <div style={styles.loginFormSection}>
            <h2 style={styles.heading}>FLOW TRACK</h2>
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>
                  <MailIcon />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(226, 232, 240, 0.8)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(226, 232, 240, 0.8)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <div
                  style={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#764ba2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#667eea")
                  }
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </div>
              </div>
              <button
                type="submit"
                style={styles.button}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-3px)";
                  e.target.style.boxShadow =
                    "0 12px 30px rgba(102, 126, 234, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(102, 126, 234, 0.4)";
                }}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
                <div style={styles.buttonHover}></div>
              </button>
              {error && <p style={styles.errorMessage}>{error}</p>}
            </form>
          </div>
          <div style={styles.graphicSection}>
            <div style={styles.floatingOrbs}>
              {orbs.map((orb, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.orb,
                    width: orb.size,
                    height: orb.size,
                    top: orb.top,
                    left: orb.left,
                    animationDelay: orb.animationDelay,
                  }}
                />
              ))}
            </div>
            <div style={styles.userIconContainer}>
              <div
                style={styles.userIcon}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(102, 126, 234, 0.6)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(102, 126, 234, 0.4)";
                }}
              >
                {userIcon.icon}
              </div>
              <h3 style={styles.userText}>Welcome Back</h3>
              <p style={styles.userDescription}>
                Sign in to access your projects, collaborate with your team, and
                continue tracking your progress seamlessly.
              </p>
            </div>
            <div style={styles.bottomActionsContainer}>
              <div style={styles.decorationLine}></div>
              <div style={styles.forgotAndRegister}>
                <span
                  style={{ ...styles.bottomText, cursor: "pointer" }}
                  onClick={() => setForgot(true)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = styles.bottomTextHover.color)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = styles.bottomText.color)
                  }
                  tabIndex={0}
                >
                  Forgot Password?
                </span>
                <span
                  style={{ ...styles.bottomText, cursor: "pointer" }}
                  onClick={() => setIsRegistering(true)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = styles.bottomTextHover.color)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = styles.bottomText.color)
                  }
                  tabIndex={0}
                >
                  Registration
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

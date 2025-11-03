
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegistrationPage() {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Redirecting to login...');
        navigate('/login');
      } else {
        alert(data.detail || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  const styles = {
    registrationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#2196F3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundAnimation: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
      `,
    },
    registrationCard: {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      overflow: 'hidden',
      width: '1000px',
      maxWidth: '90%',
      minHeight: '600px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    registrationFormSection: {
      flex: 1,
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    graphicSection: {
      flex: 1,
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden',
    },
    heading: {
      fontSize: '2.8em',
      color: 'transparent',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      marginBottom: '40px',
      fontWeight: '700',
      textAlign: 'center',
    },
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    inputGroup: {
      position: 'relative',
    },
    input: {
      padding: '18px 20px 18px 60px',
      border: '2px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '16px',
      fontSize: '1em',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      fontWeight: '500',
    },
    inputIcon: {
      position: 'absolute',
      left: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '24px',
      height: '24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
    },
    button: {
      background: '#4e54c8',
      color: 'white',
      padding: '18px',
      border: 'none',
      borderRadius: '16px',
      fontSize: '1.1em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      marginTop: '10px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
      position: 'relative',
      overflow: 'hidden',
    },
    buttonHover: {
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'left 0.5s',
    },
    loginLink: {
      marginTop: '30px',
      fontSize: '0.95em',
      color: '#718096',
      textAlign: 'center',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
    },
    // Group icon styles
    groupIconContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '30px',
    },
    groupIcon: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'white',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
    },
    groupText: {
      fontSize: '1.5em',
      color: '#2D3748',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: '20px',
    },
    groupDescription: {
      fontSize: '1em',
      color: '#4A5568',
      textAlign: 'center',
      maxWidth: '400px',
      lineHeight: '1.5',
    },
    floatingOrbs: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    },
    orb: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
      animation: 'float 6s ease-in-out infinite',
    },
  };

  // Only the group icon
  const groupIcon = {
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    icon: '👥'
  };

  // Floating orbs configuration
  const orbs = [
    { size: '120px', top: '10%', left: '10%', animationDelay: '0s' },
    { size: '80px', top: '70%', left: '80%', animationDelay: '2s' },
    { size: '100px', top: '20%', left: '85%', animationDelay: '4s' },
    { size: '90px', top: '80%', left: '15%', animationDelay: '1s' },
  ];

  // Add CSS animation for floating orbs
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div style={styles.registrationContainer}>
        <div style={styles.backgroundAnimation} />
        
        <div style={styles.registrationCard}>
          <div style={styles.registrationFormSection}>
            <h2 style={styles.heading}>FLOW TRACK</h2>
            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>U</div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              
              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>@</div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div style={styles.inputGroup}>
                <div style={styles.inputIcon}>#</div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <button 
                type="submit" 
                style={styles.button}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }}
              >
                Create Account
                <div style={styles.buttonHover}></div>
              </button>
            </form>
            <p style={styles.loginLink}>
              Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
            </p>
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
            
            <div style={styles.groupIconContainer}>
              <div 
                style={styles.groupIcon}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
                }}
              >
                {groupIcon.icon}
              </div>
              <h3 style={styles.groupText}>Team Collaboration</h3>
              <p style={styles.groupDescription}>
                Work together seamlessly with your team members. 
                Manage projects, assign tasks, and track progress in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegistrationPage;
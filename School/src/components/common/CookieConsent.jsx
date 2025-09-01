// Cookie Consent Banner Implementation
// This is a simple example. For production, use a library like 'react-cookie-consent' and ensure compliance with GDPR, LFPDPPP, and CCPA.

import React, { useState } from 'react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem('cookieConsent');
  });

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#222', color: '#fff', padding: '1em', zIndex: 1000 }}>
      This site uses cookies to enhance your experience. By continuing to browse, you accept our <a href="/PRIVACY_POLICY.md" style={{ color: '#4fc3f7' }}>Privacy Policy</a>.
      <button onClick={acceptCookies} style={{ marginLeft: '1em', background: '#4fc3f7', color: '#222', border: 'none', padding: '0.5em 1em', borderRadius: '4px' }}>Accept</button>
    </div>
  );
};

export default CookieConsent;

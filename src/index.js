import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // Uncomment if you have global styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProfileProvider } from './context/UserProfileContext';
import { HelmetProvider } from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Bootstrap() {
  useEffect(() => {
    const pixelId = process.env.REACT_APP_FACEBOOK_PIXEL_ID;
    if (!pixelId) return;
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) n = f.fbq; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = 'https://connect.facebook.net/en_US/fbevents.js'; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }, []);

  return (
    <React.StrictMode>
      <HelmetProvider>
        <UserProfileProvider>
          <App />
        </UserProfileProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
}
root.render(<Bootstrap />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 
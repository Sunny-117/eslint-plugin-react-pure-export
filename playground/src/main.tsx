import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>ESLint Plugin React Pure Export - Playground</h1>
      <p>This playground is used to test the ESLint plugin rules in a real Vite + React + TypeScript environment.</p>
      <p>Run <code>npm run lint</code> to see the ESLint errors.</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

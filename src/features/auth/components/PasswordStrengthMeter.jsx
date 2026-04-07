import React, { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ password }) => {
  const result = useMemo(() => zxcvbn(password || ''), [password]);

  const score = result.score; // 0-4
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#00d2d3'];

  const getWidth = () => `${((score + 1) / 5) * 100}%`;

  return (
    <div className="password-strength">
      <div className="strength-bar-bg">
        <div
          className="strength-bar-fill"
          style={{
            width: getWidth(),
            backgroundColor: colors[score],
            transition: 'all 0.3s ease',
          }}
        />
      </div>
      <div className="strength-info">
        <span className="strength-label" style={{ color: colors[score] }}>
          {labels[score]}
        </span>
        {result.feedback.warning && (
          <span className="strength-warning">{result.feedback.warning}</span>
        )}
      </div>
      {result.feedback.suggestions.length > 0 && (
        <ul className="strength-suggestions">
          {result.feedback.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

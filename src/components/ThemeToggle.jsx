import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
    return (
        <div className="theme-toggle-container">
            <label className="theme-switch">
                <input
                    type="checkbox"
                    onChange={toggleTheme}
                    checked={theme === 'light'}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
}

export default ThemeToggle;
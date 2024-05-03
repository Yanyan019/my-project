import React, { useEffect, useState } from 'react';

const Toggle = () => {
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter", "dim", "nord", "sunset"
  ];
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="flex items-center flex-wrap gap-3 justify-center mt-5">
      {themes.map((theme, index) => (
        <button
          key={index}
          className={`btn btn-${theme} ${currentTheme === theme ? 'btn-active' : ''}`}
          onClick={() => changeTheme(theme)}
          aria-label={`Switch to ${theme} theme`}
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default Toggle;
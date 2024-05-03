import React from 'react';
import 'daisyui/dist/full.css';

const ThemeSwitcher = () => {
  const daisyThemes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter", "dim", "nord", "sunset"
  ];

  const changeTheme = (theme) => {
    console.log('Changing theme to:', theme);
    document.documentElement.classList.remove(...daisyThemes);
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  };

  return (
    <div className="p-4">
      {daisyThemes.map((theme) => (
        <button key={theme} className="btn" onClick={() => changeTheme(theme)}>
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
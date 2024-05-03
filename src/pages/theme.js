import React from 'react'
import ThemeSwitcher from '../pages/themefolder/ThemeSwitcher';
import Toggle from '../pages/themefolder/Toggle';

function theme() {
  return (
    <div className='mt-5' >
        <h1 className='text-center font-medium'>Theme Switcher</h1>
        <Toggle/>
    </div>
  )
}

export default theme
import { useState } from 'react';
import NavigationHeader from '../NavigationHeader';
import { ThemeProvider } from '../ThemeProvider';

export default function NavigationHeaderExample() {
  const [activeSection, setActiveSection] = useState('chat');

  return (
    <ThemeProvider>
      <NavigationHeader 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </ThemeProvider>
  );
}
import { useEffect, useState } from 'react';

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {

        // Check for saved preference in cookies
        const cookies = document.cookie.split(';');
        const darkModeCookie = cookies.find(cookie => cookie.trim().startsWith('darkMode='));
        
        if (darkModeCookie) {
            return darkModeCookie.split('=')[1] === 'true';
        }

        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        
        // Update cookie when dark mode changes
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `darkMode=${isDarkMode}; expires=${expiryDate.toUTCString()}; path=/`;

        // Update document class
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;

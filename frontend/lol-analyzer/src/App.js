import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import HomePage from './pages/Home';
import MatchSelectPage from './pages/MatchSelect';
import MatchAnalysis from './pages/MatchAnalysis';
import Footer from './components/Footer';
import useDarkMode from './hooks/useDarkMode';


function App() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Only redirect on actual page refresh/reload, not on internal navigation
        if (isInitialMount.current) {
            isInitialMount.current = false;
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="App">
            <div className="pages">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/match-selection" element={<MatchSelectPage />} />
                    <Route path="/analysis" element={<MatchAnalysis />} />
                </Routes>
            </div>
            <Footer isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div >
        
    );
}

export default App;

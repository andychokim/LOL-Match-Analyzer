import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import MatchSelectPage from './pages/MatchSelect';
import MatchAnalysis from './pages/MatchAnalysis';


function App() {
    return (
        <div className="App">
            <div className="pages">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/match-selection" element={<MatchSelectPage />} />
                    <Route path="/analysis" element={<MatchAnalysis />} />
                </Routes>
            </div>
        </div >
        
    );
}

export default App;

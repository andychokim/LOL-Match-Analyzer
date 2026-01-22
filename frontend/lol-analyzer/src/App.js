import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MatchList from './pages/MatchList';
// import Analysis from './pages/Analysis';


function App() {
    return (
        <div className="App">
            <div className="pages">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/match-selection" element={<MatchList />} />
                    {/* <Route path="/analysis" element={<Analysis />} /> */}
                </Routes>
            </div>
        </div >
    );
}

export default App;

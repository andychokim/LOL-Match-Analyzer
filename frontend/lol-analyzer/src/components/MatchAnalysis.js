import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisContext } from "../hooks/useAnalysisContext";
import { API_URL } from "../config";

const MatchAnalysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const { puuid, matchId, dispatch } = useAnalysisContext();
    const navigate = useNavigate();

    // fetch match analysis on component mount
    useEffect(() => {
        
        // function to fetch match analysis
        const fetchAnalysis = async () => {

            try {
                const response = await fetch(`${API_URL}/api/riot/player-summary/${puuid}/${matchId}`);

                if (!response.ok) {
                    console.error('Error fetching match analysis:', response.statusText);
                    return;
                }

                const data = await response.json();
                setAnalysis(data);
                console.log('Fetched match analysis successfully:', data);
            }
            catch (err) {
                setError(`Failed to connect to server. Make sure backend is running at ${API_URL}.`);
                console.error('Fetch error:', err);
            }
        };

        // call the fetch function
        fetchAnalysis();
    }, [puuid, matchId]);

    const handleClick = () => {
        dispatch({ type: 'RESET' });
        console.log('Reset analysis state');
        navigate('/');
    }

    return (
        <div className="match-analysis">
            {analysis ? (
                <div className="analysis-container">
                    {typeof analysis === 'string' ? (
                        <div className="analysis-section">
                            <div className="analysis-text">
                                {analysis.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {analysis.player_stats && (
                                <div className="analysis-section">
                                    <h3>Player Stats</h3>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Champion:</span>
                                            <span className="stat-value">{analysis.player_stats.champion}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Role:</span>
                                            <span className="stat-value">{analysis.player_stats.role}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Level:</span>
                                            <span className="stat-value">{analysis.player_stats.champLevel}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">K/D/A:</span>
                                            <span className="stat-value">{analysis.player_stats.kills}/{analysis.player_stats.deaths}/{analysis.player_stats.assists}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Gold:</span>
                                            <span className="stat-value">{analysis.player_stats.totalGold.toLocaleString()}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">CS:</span>
                                            <span className="stat-value">{analysis.player_stats.cs}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Damage:</span>
                                            <span className="stat-value">{analysis.player_stats.totalDamage.toLocaleString()}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Vision Score:</span>
                                            <span className="stat-value">{analysis.player_stats.visionScore}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Wards Placed:</span>
                                            <span className="stat-value">{analysis.player_stats.wardsPlaced}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Result:</span>
                                            <span className={`stat-value ${analysis.player_stats.win ? 'win' : 'loss'}`}>
                                                {analysis.player_stats.win ? 'Victory' : 'Defeat'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {analysis.player_stats?.challenge && Object.keys(analysis.player_stats.challenge).length > 0 && (
                                <div className="analysis-section">
                                    <h3>Key Challenges</h3>
                                    <div className="challenges-grid">
                                        {Object.entries(analysis.player_stats.challenge).map(([key, value]) => (
                                            <div key={key} className="challenge-item">
                                                <span className="challenge-label">{key}:</span>
                                                <span className="challenge-value">{typeof value === 'number' ? value.toFixed(2) : value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={handleClick} className="back-button">Back to Homepage</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default MatchAnalysis;

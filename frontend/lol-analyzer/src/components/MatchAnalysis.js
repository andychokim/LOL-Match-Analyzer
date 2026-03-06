import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisContext } from "../hooks/useAnalysisContext";
import { parseBoldText } from "../utils/textUtils";


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
                    const errorData = await response.json();
                    setError(`${errorData.error}`);
                    console.error(response.statusText);
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
            <div className="analysis-container">
                {analysis ? (
                    <div className="analysis-text">
                        {typeof analysis === 'string'
                            ? analysis.split('\n').map((line, index) => (
                                <p key={index}>{parseBoldText(line)}</p>
                            ))
                            : <p>{parseBoldText(analysis)}</p>
                        }
                    </div>
                ) : (
                    <p>Loading analysis...</p>
                )}
            </div>
            <button onClick={handleClick} className="back-button">Back to Homepage</button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default MatchAnalysis;

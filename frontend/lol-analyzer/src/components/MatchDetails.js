import { useState, useEffect } from 'react';
import { useAnalysisContext } from '../hooks/useAnalysisContext';

const MatchDetails = ({ matchId }) => {
    const [matchDetails, setMatchDetails] = useState(null);
    const [error, setError] = useState(null);
    const { puuid, dispatch } = useAnalysisContext();

    // fetch match details on component mount
    useEffect(() => {
        // function to fetch match details
        const fetchMatchDetails = async () => {

            try {
                const response = await fetch(`/api/riot/match/${matchId}`);

                if (!response.ok) {
                    console.error('Error fetching match details:', response.statusText);
                    return;
                }

                const data = await response.json();
                console.log('Raw match data:', data);

                // process the data
                const participants = data.info.participants;
                const player = participants.find(p => p.puuid === puuid);
                const gameDate = new Date(data.info.gameEndTimestamp);
                const processedData = {
                    championName: player.championName,
                    kills: player.kills,
                    deaths: player.deaths,
                    assists: player.assists,
                    win: player.win,
                    gameDate: gameDate.toLocaleDateString(),
                };

                setMatchDetails(processedData);
                console.log('Fetched match details successfully:', processedData);
            }
            catch (err) {
                setError('Failed to connect to server. Make sure backend is running on port 5000.');
                console.error('Fetch error:', err);
            }
        };

        // call the fetch function
        fetchMatchDetails();
    }, [puuid, matchId]);

    // function to handle match selection
    const handleClick = () => {
        dispatch({ type: 'SET_MATCH', payload: matchId });
        console.log('Selected match:', matchId);
    };

    return (
        <div className='match-container'>
            <div className='match-details'>
                {matchDetails ? (
                    <div>
                        <p>Date: {matchDetails.gameDate}</p>
                        <p>Champion: {matchDetails.championName} ({matchDetails.kills}/{matchDetails.deaths}/{matchDetails.assists})</p>
                        <p>Result: {matchDetails.win ? 'Victory' : 'Defeat'}</p>
                    </div>
                ) : (
                    <p>Loading match details...</p>
                )}
                <button onClick={handleClick}>Analyze Match</button>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    )
}

export default MatchDetails;
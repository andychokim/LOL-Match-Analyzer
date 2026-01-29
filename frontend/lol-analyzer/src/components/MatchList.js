import { useEffect, useState } from 'react';
import { useAnalysisContext } from '../hooks/useAnalysisContext';

// components
import MatchDetails from '../components/MatchDetails';

const MatchList = () => {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const { puuid } = useAnalysisContext();

    // fetch match list on component mount
    useEffect(() => {

        // function to fetch and display match list
        const fetchMatches = async () => {

            try {
                const response = await fetch(`/api/riot/matches/${puuid}`);

                if (!response.ok) {
                    console.log('Error fetching match list:', response.statusText);
                    return;
                }
                
                const data = await response.json();
                setMatches(data);
                console.log('Fetched match list successfully:', data);
            }
            catch (err) {
                setError('Failed to connect to server. Make sure backend is running on port 5000.');
                console.error('Fetch error:', err);
            }
        };

        // only fetch if puuid is available
        if (puuid) {
            fetchMatches();
        }
    }, [puuid]);

    return (
        <div className='matches'>
            
            {matches && matches.map((matchId) => (
                <MatchDetails key={matchId} matchId={matchId} /> 
            ))}
            {error && <div className="error">{error}</div>}
        </div>
    )
};

export default MatchList;
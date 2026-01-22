import { useEffect, useState } from 'react';
import { useAnalysisContext } from '../hooks/useAnalysisContext';

// components
import MatchDetails from '../components/MatchDetails';

const MatchList = () => {
    const [matches, setMatches] = useState([]);
    const { puuid, dispatch } = useAnalysisContext();

    useEffect(() => {

        // function to fetch and display match list
        const fetchMatches = async () => {

            const response = await fetch(`/api/riot/matches/${puuid}`);
            const data = await response.json();

            if (response.ok) {
                console.log('Fetched match list successfully:', data, typeof data);

                setMatches(data);
            }
        }

        // call the fetch function
        fetchMatches();
    }, [dispatch, puuid, setMatches]);

    return (
        <div className='matches'>
            <h2>Match List</h2>
            {matches && matches.map((match) => (
                <MatchDetails key={match.id} match={match} /> 
            ))}
        </div>
    )
};

export default MatchList;
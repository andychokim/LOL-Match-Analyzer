import { useAnalysisContext } from '../hooks/useAnalysisContext';

const MatchDetails = ({ match }) => {
    const { dispatch } = useAnalysisContext();

    const handleClick = () => {
        console.log('Selected match:', match);
        
        dispatch({ type: 'SET_MATCH', payload: match });
    }

    return (
        <div className='match-details'>
            <h4>{match}</h4>
            <button onClick={handleClick}>Analyze Match</button>
        </div>
    )
}

export default MatchDetails;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisContext } from '../hooks/useAnalysisContext';
import { API_URL } from '../config';

const UserinfoForm = () => {
    const [summonerName, setSummonerName] = useState('');
    const [tagline, setTagline] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    const { dispatch } = useAnalysisContext();
    const navigate = useNavigate();

    // function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const errors = [];
        if (!summonerName.trim()) errors.push('summonerName');
        if (!tagline.trim()) errors.push('tagline');

        if (errors.length > 0) {
            setEmptyFields(errors);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/riot/summoner/${summonerName}/${tagline}`);

            if (!response.ok) {
                const errorData = await response.json();
                
                setError(errorData.error || 'Error fetching summoner information');
                setEmptyFields([]);
                console.log('Full response:', response.status, errorData);
                return;
            }

            const { puuid } = await response.json();
            console.log('Fetched summoner information successfully:', puuid);

            dispatch({ type: 'SET_PUUID', payload: puuid });

            setSummonerName('');
            setTagline('');
            setError(null);
            setEmptyFields([]);
            navigate('/match-selection');
        } catch (err) {
            setError(`Failed to connect to server. Make sure backend is running at ${API_URL}.`);
            console.error('Fetch error:', err);
        }
    }

    return (
        <form className='signIn' onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Summoner Name:</label>
                <input
                    type="text"
                    value={summonerName}
                    onChange={(e) => setSummonerName(e.target.value)}
                    className={emptyFields.includes('summonerName') ? 'error' : ''}
                    placeholder="Your summoner name"
                />
                {emptyFields.includes('summonerName') && <div className="error">Summoner name is required</div>}
            </div>

            <div className="form-group">
                <label>Tagline:</label>
                <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className={emptyFields.includes('tagline') ? 'error' : ''}
                    placeholder="Your tagline (e.g., NA1)"
                />
                {emptyFields.includes('tagline') && <div className="error">Tagline is required</div>}
            </div>

            <button type="submit">Submit</button>
            {error && <div className="error" style={{ marginTop: '1rem' }}>{error}</div>}
        </form>
    )
}

export default UserinfoForm;
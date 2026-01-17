import { useState } from 'react';

const UserinfoForm = () => {
    const [summonerName, setSummonerName] = useState('');
    const [tagline, setTagline] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        const errors = [];
        if (!summonerName.trim()) errors.push('summonerName');
        if (!tagline.trim()) errors.push('tagline');

        if (errors.length > 0) {
            setEmptyFields(errors);
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`/api/riot/summoner/${summonerName}/${tagline}`, {
                method: 'GET'
            });
            console.log(response);

            if (!response.ok) {
                const errorData = await response.json();
                
                setError(errorData.error || 'Error fetching summoner information');
                setEmptyFields(errorData.emptyFields || []);
                console.log('Error:', errorData.error);
                return;
            }

            const puuid = await response.json();
            console.log('Fetched summoner information successfully:', puuid);

            setSummonerName('');
            setTagline('');
            setError(null);
            setEmptyFields([]);
        } catch (err) {
            setError('Failed to connect to server. Make sure backend is running on port 3000.');
            console.error('Fetch error:', err);
        }
    }

    return (
        <form className='signIn' onSubmit={handleSubmit}>
            <h3>Provide your Summoner Name and Tagline</h3>

            <label>Summoner Name:</label>
            <input
                type="text"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className={emptyFields.includes('summonerName') ? 'error' : ''}
            />

            <label>Tagline:</label>
            <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className={emptyFields.includes('tagline') ? 'error' : ''}
            />

            <button type="submit">Submit</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default UserinfoForm;
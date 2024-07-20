import axios from 'axios';

const getTopArtists = async (access_token) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=50', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return [];
    }
};

export default getTopArtists;

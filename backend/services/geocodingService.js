const axios = require('axios');

const geocodeLocation = async (location) => {
    try {
        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
                params: {
                    address: location,
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            }
        );

        const result = response.data.results[0];
        if (!result) return null;

        const { lat, lng } = result.geometry.location;
        return { lat, lon: lng };
    } catch (err) {
        console.error('Google Maps error:', err.message);
        return null;
    }
};

module.exports = { geocodeLocation };

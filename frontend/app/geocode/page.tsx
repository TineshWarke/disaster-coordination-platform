'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function GeocodePage() {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const extractAndGeocode = async () => {
        if (!description.trim()) return alert('Enter a disaster description');

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/disasters/geocode', {
                description
            });

            setLocation(res.data.location_name);
            setCoordinates(res.data.coordinates);
        } catch (err) {
            console.error(err);
            alert('Failed to geocode location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">AI Geolocation Assistant</h1>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
                <textarea
                    placeholder="Paste or describe a situation (e.g. 'Flooding near Andheri station')"
                    className="textarea textarea-bordered w-full mb-4 h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button
                    className="btn btn-primary w-full mb-6"
                    onClick={extractAndGeocode}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Extract Location & Geocode'}
                </button>

                {location && coordinates && (
                    <div className="space-y-2 bg-base-100 p-4 rounded border">
                        <div><strong>Location Name:</strong> {location}</div>
                        <div><strong>Latitude:</strong> {coordinates.lat}</div>
                        <div><strong>Longitude:</strong> {coordinates.lon}</div>
                    </div>
                )}
            </div>
        </main>
    );
}

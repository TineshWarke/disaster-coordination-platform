'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Resource = {
    id: number;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    distance_meters: number;
};

type Props = {
    disasterId: string;
    lat: number;
    lon: number;
};

export default function ResourceList({ disasterId, lat, lon }: Props) {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `https://disaster-coordination-platform.onrender.com/disasters/${disasterId}/resources`,
                { params: { lat, lon } }
            );
            setResources(res.data);
        } catch (error) {
            console.error('Failed to load resources:', error);
            alert('❌ Could not fetch nearby resources.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (lat && lon) fetchResources();
    }, [lat, lon]);

    return (
        <div className="bg-white rounded shadow p-5 mt-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">🚑 Nearby Resources</h3>

            {loading ? (
                <p className="text-gray-500 italic">Searching for nearby units...</p>
            ) : resources.length === 0 ? (
                <p className="text-gray-500 italic">No resources found within 10 km radius.</p>
            ) : (
                <div className="space-y-4">
                    {resources.map((res) => (
                        <div
                            key={res.id}
                            className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <div className="font-semibold text-gray-800">{res.name}</div>
                            <div className="text-sm text-gray-500 capitalize">
                                🛠️ {res.type} &nbsp; • &nbsp;
                                📍 {(res.distance_meters / 1000).toFixed(2)} km away
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

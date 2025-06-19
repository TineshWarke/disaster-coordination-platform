'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ReportForm from '@/app/components/ReportForm';
import ReportList from '@/app/components/ReportList';
import ResourceList from '@/app/components/ResourceList';
import SocialFeed from '@/app/components/SocialFeed';

type Disaster = {
    id: string;
    title: string;
    location_name: string;
    description: string;
    tags: string[];
    coordinates?: { lat: number; lon: number };
};

export default function DisasterDetailPage() {
    const { id } = useParams();
    const [disaster, setDisaster] = useState<Disaster | null>(null);
    const [reports, setReports] = useState([]);

    const fetchDisaster = async () => {
        const res = await axios.get(`https://disaster-coordination-platform.onrender.com/disasters`);
        const match = res.data.find((d: Disaster) => d.id === id);
        if (match) setDisaster(match);
    };

    const fetchReports = async () => {
        const res = await axios.get(`https://disaster-coordination-platform.onrender.com/disasters/${id}/reports`);
        setReports(res.data);
    };

    useEffect(() => {
        if (id) {
            fetchDisaster();
            fetchReports();
        }
    }, [id]);

    if (!disaster) return <div className="p-6 text-center text-gray-500">Loading disaster...</div>;

    return (
        <main className="p-6 min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-primary">{disaster.title}</h1>

                <div className="bg-white p-4 rounded shadow space-y-1">
                    <p><strong>Location:</strong> {disaster.location_name}</p>
                    <p><strong>Description:</strong> {disaster.description}</p>
                    <p><strong>Tags:</strong> {disaster.tags.join(', ')}</p>
                </div>

                <ReportForm disasterId={disaster.id} onSubmitted={fetchReports} />
                <ReportList reports={reports} />

                {disaster.coordinates && (
                    <ResourceList
                        disasterId={disaster.id}
                        lat={disaster.coordinates.lat}
                        lon={disaster.coordinates.lon}
                    />
                )}

                <SocialFeed disasterId={disaster.id} />
            </div>
        </main>
    );
}

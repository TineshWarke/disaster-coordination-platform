'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import DisasterForm from './components/DisasterForm';
import DisasterList from './components/DisasterList';
import ReportForm from './components/ReportForm';
import ReportList from './components/ReportList';
import ResourceList from './components/ResourceList';
import SocialFeed from './components/SocialFeed';
import { Disaster } from './types/types';

const socket = io('http://localhost:5000');

export default function Home() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [selected, setSelected] = useState<Disaster | null>(null);
  const [reports, setReports] = useState([]);

  const fetchDisasters = async () => {
    try {
      const res = await axios.get('http://localhost:5000/disasters');
      setDisasters(res.data);
    } catch (err) {
      console.error('Failed to fetch disasters', err);
    }
  };

  const fetchReports = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/disasters/${id}/reports`);
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  const handleSelect = (disaster: Disaster) => {
    setSelected(disaster);
    fetchReports(disaster.id);
    scrollToReports();
  };

  const scrollToReports = () => {
    const el = document.getElementById('report-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchDisasters();

    socket.on('disaster_updated', fetchDisasters);

    socket.on('image_verified', (data) => {
      if (selected?.id === data.disaster_id) {
        alert(`Image Verified: ${data.verification_status}`);
      }
    });

    return () => {
      socket.off('disaster_updated');
      socket.off('image_verified');
    };
  }, [selected?.id]); // only re-run alert listener if disaster changes

  return (
    <main className="p-6 min-h-screen bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        🌍 Disaster Response Coordination Platform
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <DisasterForm onCreated={fetchDisasters} />
        <DisasterList
          disasters={disasters}
          onSelect={handleSelect}
          selectedId={selected?.id}
        />
      </div>

      {selected && (
        <section className="mt-10 space-y-8" id="report-section">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold text-blue-600">
              📌 Selected Disaster: {selected.title}
            </h2>
            <p className="text-sm text-gray-600">{selected.description}</p>
            <p className="text-sm text-gray-400 italic">Tags: {selected.tags.join(', ')}</p>
          </div>

          <ReportForm
            disasterId={selected.id}
            onSubmitted={() => fetchReports(selected.id)}
          />
          <ReportList reports={reports} />

          {selected.coordinates && (
            <ResourceList
              disasterId={selected.id}
              lat={selected.coordinates.lat}
              lon={selected.coordinates.lon}
            />
          )}

          <SocialFeed disasterId={selected.id} />
        </section>
      )}
    </main>
  );
}

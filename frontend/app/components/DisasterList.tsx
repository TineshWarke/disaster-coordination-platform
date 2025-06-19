'use client';

import React from 'react';
import { Disaster } from '../types/types';

type Props = {
    disasters: Disaster[];
    onSelect: (disaster: Disaster) => void;
    selectedId?: string; // ✅ Add this prop to enable highlight
};

export default function DisasterList({ disasters, onSelect, selectedId }: Props) {
    return (
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-4">Reported Disasters</h2>

            {disasters.length === 0 ? (
                <p className="text-gray-500">No disasters reported yet.</p>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {disasters.map((disaster) => (
                        <div
                            key={disaster.id}
                            className={`p-3 border rounded cursor-pointer transition 
                hover:bg-gray-100 
                ${disaster.id === selectedId ? 'bg-blue-100 border-blue-500' : ''}`}
                            onClick={() => onSelect(disaster)}
                        >
                            <div className="font-semibold">{disaster.title}</div>
                            <div className="text-sm text-gray-600">{disaster.location_name}</div>
                            <div className="text-xs text-gray-400">
                                Tags: {disaster.tags?.join(', ') || 'None'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

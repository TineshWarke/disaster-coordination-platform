'use client';

import React, { useState } from 'react';
import axios from 'axios';

type Props = {
    onCreated: () => void;
};

export default function DisasterForm({ onCreated }: Props) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !location.trim() || !description.trim()) {
            return alert('Please fill in all fields.');
        }

        try {
            setLoading(true);
            await axios.post('http://localhost:5000/disasters', {
                title: title.trim(),
                location_name: location.trim(),
                description: description.trim(),
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            });

            setTitle('');
            setLocation('');
            setDescription('');
            setTags('');
            onCreated();
        } catch (error) {
            console.error('Failed to create disaster:', error);
            alert('Failed to create disaster. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded shadow p-5 w-full">
            <h2 className="text-xl font-bold mb-4 text-blue-600">📢 Report a New Disaster</h2>

            <div className="form-control mb-3">
                <label className="label text-sm font-medium">Title</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="e.g. Mumbai Flood"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="form-control mb-3">
                <label className="label text-sm font-medium">Location Name</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="e.g. Andheri Station"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>

            <div className="form-control mb-3">
                <label className="label text-sm font-medium">Description</label>
                <textarea
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    placeholder="Describe what happened..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-control mb-4">
                <label className="label text-sm font-medium">Tags (comma separated)</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="e.g. flood, rescue, monsoon"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <button
                className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Disaster'}
            </button>
        </div>
    );
}

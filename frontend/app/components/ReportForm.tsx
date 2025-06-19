'use client';

import React, { useState } from 'react';
import axios from 'axios';

type Props = {
    disasterId: string;
    onSubmitted: () => void;
};

export default function ReportForm({ disasterId, onSubmitted }: Props) {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const submitReport = async () => {
        if (!content.trim()) return alert('📝 Please enter your report details.');

        try {
            setLoading(true);
            await axios.post(`https://disaster-coordination-platform.onrender.com/disasters/${disasterId}/reports`, {
                user_id: 'citizenX', // Replace with dynamic user if needed
                content: content.trim(),
                image_url: imageUrl.trim() || null,
            });

            setContent('');
            setImageUrl('');
            onSubmitted();
        } catch (err) {
            console.error(err);
            alert('❌ Failed to submit report. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyImage = async () => {
        if (!imageUrl.trim()) return alert('📷 Please enter an image URL to verify.');
        try {
            setVerifying(true);
            await axios.post(`http://localhost:5000/disasters/${disasterId}/verify-image`, {
                image_url: imageUrl.trim(),
            });
        } catch (err) {
            console.error(err);
            alert('❌ Image verification failed.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="bg-white rounded shadow p-5 mt-6 w-full">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">🧾 Submit a New Report</h3>

            <div className="form-control mb-4">
                <textarea
                    placeholder="Describe what you're seeing..."
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <div className="form-control mb-4">
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Optional image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>

            <div className="flex gap-3">
                <button
                    className={`btn btn-primary ${loading && 'btn-disabled'}`}
                    onClick={submitReport}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Report'}
                </button>

                <button
                    className={`btn btn-outline ${verifying && 'btn-disabled'}`}
                    onClick={verifyImage}
                    disabled={verifying}
                >
                    {verifying ? 'Verifying...' : 'Verify Image'}
                </button>
            </div>
        </div>
    );
}

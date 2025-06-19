// app/components/SocialPostForm.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';

type Props = {
    disasterId: string;
    onSubmitted: () => void;
};

export default function SocialPostForm({ disasterId, onSubmitted }: Props) {
    const [post, setPost] = useState('');
    const [user, setUser] = useState('');
    const [type, setType] = useState<'need' | 'offer'>('need');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!post.trim() || !user.trim()) {
            return alert('Please enter both post and user name.');
        }

        try {
            setLoading(true);
            await axios.post(`http://localhost:5000/disasters/${disasterId}/social-media`, {
                post: post.trim(),
                user: user.trim(),
                type,
            });
            setPost('');
            setUser('');
            setType('need');
            onSubmitted();
        } catch (err) {
            console.error(err);
            alert('Failed to submit post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded shadow p-5 mt-6">
            <h3 className="text-md font-semibold text-blue-600 mb-4">✍️ Submit to Social Feed</h3>

            <input
                type="text"
                className="input input-bordered w-full mb-3"
                placeholder="Your name or handle"
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />

            <textarea
                className="textarea textarea-bordered w-full mb-3"
                rows={2}
                placeholder="What do you need or offer?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
            />

            <select
                className="select select-bordered w-full mb-4"
                value={type}
                onChange={(e) => setType(e.target.value as 'need' | 'offer')}
            >
                <option value="need">Need</option>
                <option value="offer">Offer</option>
            </select>

            <button
                className={`btn btn-primary w-full ${loading && 'btn-disabled'}`}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Posting...' : 'Post to Feed'}
            </button>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SocialPostForm from './SocialPostForm';
import socket from '../../lib/socket'; // ✅ shared socket instance

type Post = {
    post: string;
    user: string;
    type: 'need' | 'offer';
    created_at: string;
};

type Props = {
    disasterId: string;
};

export default function SocialFeed({ disasterId }: Props) {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(
                `https://disaster-coordination-platform.onrender.com/disasters/${disasterId}/social-media`
            );
            setPosts(res.data);
        } catch (error) {
            console.error('Failed to fetch social feed:', error);
        }
    };

    useEffect(() => {
        fetchPosts();

        const handleSocialUpdate = (data: { disaster_id: string; posts: Post[] }) => {
            if (data.disaster_id === disasterId) {
                console.log('[Socket] Social feed updated:', data);
                setPosts(data.posts);
            }
        };

        socket.on('social_media_updated', handleSocialUpdate);

        return () => {
            socket.off('social_media_updated', handleSocialUpdate);
        };
    }, [disasterId]);

    return (
        <div className="bg-white rounded shadow p-5 mt-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">📢 Live Social Media Feed</h3>

            {posts.length === 0 ? (
                <p className="text-gray-500 italic">No recent posts detected.</p>
            ) : (
                <div className="space-y-4">
                    {posts.map((p, i) => (
                        <div
                            key={i}
                            className="border p-4 rounded bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <p className="text-sm mb-2">{p.post}</p>

                            <div className="flex justify-between text-xs text-gray-500">
                                <span>👤 {p.user}</span>
                                <span>🕒 {new Date(p.created_at).toLocaleString()}</span>
                            </div>

                            <div className="mt-2">
                                <span
                                    className={`badge text-xs ${p.type === 'need'
                                        ? 'badge-error'
                                        : p.type === 'offer'
                                            ? 'badge-success'
                                            : 'badge-neutral'
                                        }`}
                                >
                                    {p.type.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 📩 Form to simulate crowd input */}
            <SocialPostForm disasterId={disasterId} onSubmitted={fetchPosts} />
        </div>
    );
}

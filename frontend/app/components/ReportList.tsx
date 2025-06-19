'use client';

import React from 'react';

type Report = {
    content: string;
    image_url?: string;
    verification_status?: string;
    created_at: string;
};

type Props = {
    reports: Report[];
};

export default function ReportList({ reports }: Props) {
    return (
        <div className="bg-white rounded shadow p-5 mt-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">📄 Disaster Reports</h3>

            {reports.length === 0 ? (
                <p className="text-gray-500 italic">No reports available yet.</p>
            ) : (
                <div className="space-y-4">
                    {reports.map((report, idx) => (
                        <div
                            key={idx}
                            className="border rounded p-4 bg-gray-50 hover:bg-gray-100 transition"
                        >
                            <p className="mb-2 text-sm text-gray-800">{report.content}</p>

                            {report.image_url && (
                                <div className="mb-2">
                                    <img
                                        src={report.image_url}
                                        alt="report evidence"
                                        className="max-h-48 object-cover rounded border"
                                    />
                                </div>
                            )}

                            <div className="flex items-center text-xs text-gray-500 justify-between">
                                <span>
                                    🛡️ Status:{' '}
                                    <span
                                        className={`font-medium ${report.verification_status === 'likely authentic'
                                                ? 'text-green-600'
                                                : report.verification_status === 'likely fake'
                                                    ? 'text-red-600'
                                                    : 'text-yellow-600'
                                            }`}
                                    >
                                        {report.verification_status || 'pending'}
                                    </span>
                                </span>

                                <span>📅 {new Date(report.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
    const [students, setStudents] = useState([]);
    const [batch, setBatch] = useState('all');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [customFields, setCustomFields] = useState([]);
    const [newField, setNewField] = useState('');
    const [editedData, setEditedData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const studentsResponse = await axios.get('/api/students');
                setStudents(studentsResponse.data);
                const fieldsResponse = await axios.get('/api/customFields');
                const fields = fieldsResponse.data.map((f) => f.name);
                setCustomFields(fields);
            } catch (error) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (studentId, field, value) => {
        setEditedData((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value,
            },
        }));
    };


    const handleAddField = async () => {
        const trimmed = newField.trim();
        if (trimmed && !customFields.includes(trimmed)) {
            setCustomFields((prev) => [...prev, trimmed]);
            try {
                const res = await fetch('/api/studentPortal/addExamFieldToStudents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ field: trimmed }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Something went wrong');
                setNewField('');
            } catch (error) {
                setError('❌ Failed to add field');
                console.error('Failed to add field:', error.message);
            }
        }
    };


    const handleDeleteField = async (fieldToDelete) => {
        if (window.confirm(`Delete "${fieldToDelete}" field for all students?`)) {
            setCustomFields((prev) => prev.filter((f) => f !== fieldToDelete));
            try {
                const res = await fetch('/api/deleteExamFieldFromStudents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ field: fieldToDelete }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to delete field');
                console.log(`🗑️ Field "${fieldToDelete}" removed`);
            } catch (error) {
                setError('❌ Failed to delete field');
                console.error('Error deleting field:', error.message);
            }
        }
    };


    const UpdateStudent = async (studentId) => {
        const fieldsToUpdate = editedData[studentId];
        if (!fieldsToUpdate) return;

        try {
            const response = await axios.post('/api/studentPortal/updateExamData', {
                studentId,
                month,
                updates: fieldsToUpdate
            });

            if (response.status === 200) {
                console.log('✅ Student data updated successfully');
                setStudents((prev) =>
                    prev.map((s) =>
                        s._id === studentId
                            ? {
                                ...s,
                                examSummary: {
                                    ...s.examSummary,
                                    [month]: {
                                        ...s.examSummary?.[month],
                                        ...fieldsToUpdate,
                                    },
                                },
                            }
                            : s
                    )
                );
                setEditedData((prev) => {
                    const copy = { ...prev };
                    delete copy[studentId];
                    return copy;
                });
            } else {
                console.error('❌ Failed to update student data:', response.data.error);
            }
        } catch (error) {
            console.error('❌ Error updating student data:', error.message);
        }
    };



    const filtered = batch === 'all' ? students : students.filter((s) => s.batch === batch);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-4 sm:p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen text-gray-900 font-sans">
            {/* Controls */}
            <div className="flex flex-col gap-4 mb-6">
                <select
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 text-sm transition-colors duration-200"
                    aria-label="Select batch"
                >
                    <option value="all">All Batches</option>
                    {[...'1234567'].map((b) => (
                        <option key={b} value={b}>Batch {b}</option>
                    ))}
                </select>
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 text-sm transition-colors duration-200"
                    aria-label="Select month"
                />
            </div>

            {/* Add Custom Activity */}
            <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Custom Subject
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Subject name (e.g., Fiqh, quran)"
                        value={newField}
                        onChange={(e) => setNewField(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm transition-colors duration-200"
                        aria-label="Activity name"
                    />
                    <button
                        onClick={handleAddField}
                        className="w-full sm:w-auto px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm font-medium"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Subject
                        </span>
                    </button>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-green-50 text-green-800 text-xs uppercase font-medium tracking-wide sticky top-0 z-10">
                            <tr>
                                <th className="p-3 sm:p-4">Name</th>
                                <th className="p-3 sm:p-4 hidden sm:table-cell">Roll</th>
                                <th className="p-3 sm:p-4 hidden md:table-cell">Batch</th>
                                {customFields.map((field) => (
                                    <th key={field} className="p-3 sm:p-4 hidden lg:table-cell">
                                        <div className="flex items-center justify-between">
                                            <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                                            <button
                                                onClick={() => handleDeleteField(field)}
                                                className="ml-2 p-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200"
                                                title={`Delete ${field}`}
                                                aria-label={`Delete ${field} field`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H8V5a2 2 0 012-2zM9 9v8m6-8v8"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                <th className="p-3 sm:p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr
                                    key={s._id}
                                    className="border-b last:border-none hover:bg-green-50 transition-colors duration-200"
                                >
                                    <td className="p-3 sm:p-4 text-gray-900">{s.name}</td>
                                    <td className="p-3 sm:p-4 text-gray-900 hidden sm:table-cell">{s.roll}</td>
                                    <td className="p-3 sm:p-4 text-gray-900 hidden md:table-cell">{s.batch}</td>
                                    {customFields.map((field) => (
                                        <td key={field} className="p-3 sm:p-4 hidden lg:table-cell">
                                            <input
                                                type="number"
                                                value={editedData[s._id]?.[field] ?? s.examSummary?.[month]?.[field] ?? ''}
                                                onChange={(e) => handleInputChange(s._id, field, e.target.value)}
                                                className="w-full px-2 py-1.5 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-sm"
                                                aria-label={`${field} score for ${s.name}`}
                                            />
                                        </td>
                                    ))}
                                    <td className="p-3 sm:p-4 text-center">
                                        <button
                                            onClick={() => UpdateStudent(s._id)}
                                            className="w-full sm:w-auto px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm font-medium"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

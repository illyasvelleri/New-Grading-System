import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState('all');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [customFields, setCustomFields] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', batch: '1' });
  const [excelFile, setExcelFile] = useState(null);
  const [newField, setNewField] = useState('');

  useEffect(() => {
    axios.get('/api/students').then((res) => setStudents(res.data));
  }, []);

  const handleAddStudent = async () => {
    const res = await axios.post('/api/addStudent', newStudent);
    setStudents((prev) => [...prev, res.data]);
    setNewStudent({ name: '', batch: '1' });
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    await axios.post('/api/uploadExcel', formData);
    const res = await axios.get('/api/students');
    setStudents(res.data);
  };


  const filtered = batch === 'all' ? students : students.filter((s) => s.batch === batch);

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen text-gray-900 font-sans">
      {/* Filter Section */}
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

      {/* Add Student Section */}
      <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm transition-colors duration-200"
              aria-label="Student name"
            />
            <select
              value={newStudent.batch}
              onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
              className="w-full sm:w-32 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm transition-colors duration-200"
              aria-label="Select student batch"
            >
              {[...'1234567'].map((b) => (
                <option key={b} value={b}>Batch {b}</option>
              ))}
            </select>
            <button
              onClick={handleAddStudent}
              className="w-full sm:w-auto px-5 py: px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm font-medium"
            >
              Add
            </button>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Upload Excel File</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-600 file:hover:bg-green-200 text-sm"
              aria-label="Upload Excel file"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-green-50 text-green-800 text-xs uppercase font-medium tracking-wide sticky top-0">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4 hidden sm:table-cell">Roll</th>
                <th className="p-4 hidden md:table-cell">Batch</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s._id}
                  className="border-b last:border-none hover:bg-green-50 transition-colors duration-200"
                >
                  <td className="p-4 text-gray-900">{s.name}</td>
                  <td className="p-4 text-gray-900 hidden sm:table-cell">{s.roll}</td>
                  <td className="p-4 text-gray-900 hidden md:table-cell">{s.batch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
}

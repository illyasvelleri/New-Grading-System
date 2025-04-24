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
    <div className="p-4 sm:p-6 bg-white min-h-screen text-gray-900 font-sans">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          onChange={(e) => setBatch(e.target.value)}
          className="p-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
          className="p-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Add Student Section */}
      <div className="mb-6 p-6 rounded-2xl bg-gray-900 shadow-lg text-white lg:px-6">
        <h2 className="text-xl font-semibold text-green-400 mb-4">➕ Add Student</h2>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            className="p-3 flex-1 rounded-xl bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
          <select
            value={newStudent.batch}
            onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
            className="p-3 rounded-xl bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            {[...'1234567'].map((b) => (
              <option key={b} value={b}>Batch {b}</option>
            ))}
          </select>
          <button
            onClick={handleAddStudent}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl transition shadow-md"
          >
            Add
          </button>
        </div>

        <div>
          <label className="block mb-2 font-medium text-green-300">📥 Upload Excel File</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
            className="w-full p-3 rounded-xl bg-white text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-50 text-green-800 font-semibold">
            <tr>
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Roll</th>
              <th className="p-4 border-b">Batch</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition">
                <td className="p-4 border-b">{s.name}</td>
                <td className="p-4 border-b">{s.roll}</td>
                <td className="p-4 border-b">{s.batch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";

export default function ViewSectionPage() {
    const router = useRouter();
    const { id } = router.query;
    const [section, setSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tableName, setTableName] = useState("");
    const [rowsCount, setRowsCount] = useState(2);
    const [columns, setColumns] = useState(2);
    const [columnData, setColumnDetails] = useState([]);

    const [tables, setTables] = useState([]);

    useEffect(() => {
        if (id) fetchSectionDetails();
        fetchTables();
    }, [id]);

    useEffect(() => {
        setColumnDetails(
            Array.from({ length: columns }, (_, index) => ({
                name: `Column ${index + 1}`,
                type: "text",
                allowUserInput: true,
            }))
        );
    }, [columns]);

    const fetchSectionDetails = async () => {
        try {
            const res = await axios.get(`/api/admin/sections/view?id=${id}`);
            setSection(res.data.section);
        } catch (error) {
            console.error("Failed to fetch section", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch tables for this section
    const fetchTables = async () => {
        try {
            // Ensure id is defined before making the API call
            if (!id) {
                console.error("Section ID is not defined");
                return;
            }
            const res = await axios.get(`/api/admin/tables/view?id=${id}`);
            setTables(res.data.tables);
        } catch (error) {
            console.error("❌ Error fetching tables:", error);
        }
    };

    const handleCreateTable = async (e) => {
        e.preventDefault();

        if (!id || !tableName.trim() || rowsCount < 1 || columns < 1) {
            console.error("Missing required values:", { id, tableName, rowsCount, columns });
            return;
        }

        const columnsData = columnData.map((col) => ({
            name: col.name,
            type: col.type,
            isEditable: col.allowUserInput,
        }));

        try {
            console.log("Creating table with data:", { sectionId: id, tableName, rowsCount, columnsData });

            await axios.post("/api/admin/tables/create", {
                sectionId: id,
                tableName: tableName.trim(),
                rowsCount: Number(rowsCount),
                columns: columnsData,
            });

            console.log("Table Created Successfully!");
            setTableName("");
            setRowsCount(2);
            setColumns(2);
            fetchTables();
        } catch (error) {
            console.error("Failed to create table:", error.response?.data || error.message);
        }
    };

    // ✅ Handle table deletion
    const handleDeleteTable = async (tableId) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;

        try {
            await axios.delete(`/api/admin/tables/delete?id=${tableId}`);
            setTables(tables.filter(table => table._id !== tableId)); // Remove deleted table
        } catch (error) {
            console.error("❌ Failed to delete table:", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-gray-500">Loading section details...</div>;
    }

    if (!section) {
        return <div className="flex items-center justify-center h-screen text-red-500 font-semibold">Section not found!</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col md:flex-row pb-20 text-sm text-gray-900 font-inter">
            <AdminSidebar />

            <div className="flex-1 p-4 md:p-6 space-y-10">
                {/* Section Header */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{section.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">Category: {section.sectionCategory}</p>

                    {/* Create Table */}
                    <h3 className="mt-10 text-xl font-semibold text-gray-800">Create Table</h3>
                    <form className="mt-5 space-y-6" onSubmit={handleCreateTable}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label>Table Name</label>
                                <input
                                    type="text"
                                    placeholder="Table Name"
                                    value={tableName}
                                    onChange={(e) => setTableName(e.target.value)}
                                    className="p-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Rows</label>
                                <input
                                    type="number"
                                    placeholder="Rows"
                                    min="2"
                                    value={rowsCount}
                                    onChange={(e) => setRowsCount(Number(e.target.value))}
                                    className="p-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Columns</label>
                                <input
                                    type="number"
                                    placeholder="Columns"
                                    min="2"
                                    value={columns}
                                    onChange={(e) => setColumns(Number(e.target.value))}
                                    className="p-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Column Inputs */}
                        <div className="space-y-4">
                            {columnData.map((col, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-4 border rounded-xl shadow-sm">
                                    <input
                                        type="text"
                                        placeholder="Column Name"
                                        value={col.name}
                                        onChange={(e) => {
                                            const newColumns = [...columnData];
                                            newColumns[index].name = e.target.value;
                                            setColumnDetails(newColumns);
                                        }}
                                        className="flex-1 p-2 border rounded-lg w-full focus:outline-none"
                                        required
                                    />
                                    <select
                                        value={col.type}
                                        onChange={(e) => {
                                            const newColumns = [...columnData];
                                            newColumns[index].type = e.target.value;
                                            setColumnDetails(newColumns);
                                        }}
                                        className="p-2 border rounded-lg focus:outline-none"
                                    >
                                        <option value="text">Text</option>
                                        <option value="radio">Radio</option>
                                        <option value="mark">Mark</option>
                                        <option value="max-mark">Max Mark</option>
                                    </select>
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={col.allowUserInput}
                                            onChange={(e) => {
                                                const newColumns = [...columnData];
                                                newColumns[index].allowUserInput = e.target.checked;
                                                setColumnDetails(newColumns);
                                            }}
                                            className="h-5 w-5 text-green-600 border-gray-300 rounded"
                                        />
                                        Allow Input
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Create Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all duration-200"
                        >
                            ➕ Create Table
                        </button>
                    </form>
                </div>

                {/* Created Tables */}
                <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Created Tables</h3>
                    {tables.length === 0 ? (
                        <p className="text-gray-500 mt-3">No tables found.</p>
                    ) : (
                        <div className="overflow-x-auto mt-5">
                            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <thead className="bg-gray-100 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="p-3 border">Table Name</th>
                                        <th className="p-3 border">Rows</th>
                                        <th className="p-3 border">Columns</th>
                                        <th className="p-3 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables.map((table) => (
                                        <tr key={table._id} className="text-center hover:bg-gray-50 transition">
                                            <td className="p-3 border">{table.tableName}</td>
                                            <td className="p-3 border">{table.rowsCount}</td>
                                            <td className="p-3 border">{table.columns.length}</td>
                                            <td className="p-3 border">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteTable(table._id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                                                        onClick={() => router.push(`/admin/view-table/${table._id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>



    );
}

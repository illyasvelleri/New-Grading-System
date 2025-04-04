import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
        <div className="min-h-screen bg-gray-100 p-8">
            <button
                onClick={() => router.push("/admin")}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900 transition"
            >
                ← Back to Dashboard
            </button>

            <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-3xl font-extrabold text-gray-900">{section.name}</h1>
                <p className="text-gray-500 mt-2">Category: {section.sectionCategory}</p>

                <h3 className="mt-8 text-xl font-semibold text-gray-700">Create Table</h3>
                <form className="mt-4 space-y-4" onSubmit={handleCreateTable}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Table Name" value={tableName} onChange={(e) => setTableName(e.target.value)} className="p-3 border rounded-lg w-full" required />
                        <input type="number" placeholder="Rows" min="2" value={rowsCount} onChange={(e) => setRowsCount(Number(e.target.value))} className="p-3 border rounded-lg w-full" required />
                        <input type="number" placeholder="Columns" min="2" value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="p-3 border rounded-lg w-full" required />
                    </div>

                    <div className="space-y-2">
                        {columnData.map((col, index) => (
                            <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border">
                                <input type="text" placeholder="Column Name" value={col.name} onChange={(e) => {
                                    const newColumns = [...columnData];
                                    newColumns[index].name = e.target.value;
                                    setColumnDetails(newColumns);
                                }} className="p-2 border rounded-lg flex-1" required />
                                <select value={col.type} onChange={(e) => {
                                    const newColumns = [...columnData];
                                    newColumns[index].type = e.target.value;
                                    setColumnDetails(newColumns);
                                }} className="p-2 border rounded-lg">
                                    <option value="text">Text</option>
                                    <option value="radio">Radio</option>
                                    <option value="mark">Mark</option>
                                    <option value="max-mark">Max Mark</option>
                                </select>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" checked={col.allowUserInput} onChange={(e) => {
                                        const newColumns = [...columnData];
                                        newColumns[index].allowUserInput = e.target.checked;
                                        setColumnDetails(newColumns);
                                    }} className="h-5 w-5" />
                                    <span>Allow Input</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
                        Create Table
                    </button>
                </form>
            </div>

            {/* ✅ Display Created Tables */}
            <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-700">Created Tables</h3>
                {tables.length === 0 ? (
                    <p className="text-gray-500 mt-2">No tables found.</p>
                ) : (
                    <table className="w-full mt-4 border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 border">Table Name</th>
                                <th className="p-3 border">Rows</th>
                                <th className="p-3 border">Columns</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => (
                                <tr key={table._id} className="text-center">
                                    <td className="p-3 border">{table.tableName}</td>
                                    <td className="p-3 border">{table.rowsCount}</td>
                                    <td className="p-3 border">{table.columns.length}</td>
                                    <td className="p-3 border">
                                        <button
                                            onClick={() => handleDeleteTable(table._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                                            onClick={() => router.push(`/admin/view-table/${table._id}`)}
                                        >
                                            Edit
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


        </div>
    );
}

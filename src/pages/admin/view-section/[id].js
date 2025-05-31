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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-white flex flex-col lg:flex-row text-xs sm:text-sm text-gray-900 font-inter">
            <AdminSidebar />

            <div className="flex-1 p-4 sm:p-6 md:p-8 mx-auto w-full space-y-8">
                {/* Section Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        {section.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 capitalize">
                        Category: {section.sectionCategory}
                    </p>

                    {/* Create Table Form */}
                    <h3 className="mt-8 text-lg sm:text-xl font-semibold text-gray-800">Create Table</h3>
                    <form className="mt-6 space-y-6" onSubmit={handleCreateTable}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2" htmlFor="table-name">
                                    Table Name
                                </label>
                                <input
                                    id="table-name"
                                    type="text"
                                    placeholder="Enter table name"
                                    value={tableName}
                                    onChange={(e) => setTableName(e.target.value)}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                                    required
                                    aria-label="Table name"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2" htmlFor="rows-count">
                                    Rows
                                </label>
                                <input
                                    id="rows-count"
                                    type="number"
                                    placeholder="Number of rows"
                                    min="2"
                                    value={rowsCount}
                                    onChange={(e) => setRowsCount(Number(e.target.value))}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                                    required
                                    aria-label="Number of rows"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2" htmlFor="columns-count">
                                    Columns
                                </label>
                                <input
                                    id="columns-count"
                                    type="number"
                                    placeholder="Number of columns"
                                    min="2"
                                    value={columns}
                                    onChange={(e) => setColumns(Number(e.target.value))}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                                    required
                                    aria-label="Number of columns"
                                />
                            </div>
                        </div>

                        {/* Column Inputs */}
                        <div className="space-y-4">
                            {columnData.map((col, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm"
                                >
                                    <input
                                        type="text"
                                        placeholder={`Column ${index + 1} name`}
                                        value={col.name}
                                        onChange={(e) => {
                                            const newColumns = [...columnData];
                                            newColumns[index].name = e.target.value;
                                            setColumnDetails(newColumns);
                                        }}
                                        className="flex-1 p-3 bg-white border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                                        required
                                        aria-label={`Column ${index + 1} name`}
                                    />
                                    <select
                                        value={col.type}
                                        onChange={(e) => {
                                            const newColumns = [...columnData];
                                            newColumns[index].type = e.target.value;
                                            setColumnDetails(newColumns);
                                        }}
                                        className="p-3 bg-white border border-gray-200 rounded-xl w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 text-sm hover:bg-gray-100 transition-all duration-200"
                                        aria-label={`Column ${index + 1} type`}
                                    >
                                        <option value="text">Text</option>
                                        <option value="radio">Radio</option>
                                        <option value="mark">Mark</option>
                                        <option value="max-mark">Max Mark</option>
                                        <option value="point">Point</option>
                                        <option value="max-point">Max Point</option>
                                    </select>
                                    <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={col.allowUserInput}
                                            onChange={(e) => {
                                                const newColumns = [...columnData];
                                                newColumns[index].allowUserInput = e.target.checked;
                                                setColumnDetails(newColumns);
                                            }}
                                            className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            aria-label={`Allow user input for column ${index + 1}`}
                                        />
                                        Allow Input
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Create Button */}
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
                            aria-label="Create table"
                        >
                            <span>➕ Create Table</span>
                        </button>
                    </form>
                </div>

                {/* Created Tables */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Created Tables</h3>
                    {tables.length === 0 ? (
                        <p className="text-gray-500 text-xs sm:text-sm mt-3">No tables found.</p>
                    ) : (
                        <div className="overflow-x-auto mt-6">
                            <table className="w-full text-xs sm:text-sm border border-gray-100 rounded-xl shadow-sm">
                                <thead className="bg-gray-50 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="p-3 sm:p-4 border-b text-left">Table Name</th>
                                        <th className="p-3 sm:p-4 border-b text-center">Rows</th>
                                        <th className="p-3 sm:p-4 border-b text-center">Columns</th>
                                        <th className="p-3 sm:p-4 border-b text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tables.map((table) => (
                                        <tr key={table._id} className="text-center hover:bg-gray-50 transition-all duration-200">
                                            <td className="p-3 sm:p-4 border-b text-left">{table.tableName}</td>
                                            <td className="p-3 sm:p-4 border-b">{table.rowsCount}</td>
                                            <td className="p-3 sm:p-4 border-b">{table.columns.length}</td>
                                            <td className="p-3 sm:p-4 border-b">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteTable(table._id)}
                                                        className="px-3 py-1.5 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-medium"
                                                        aria-label={`Delete table ${table.tableName}`}
                                                    >
                                                        ❌ Delete
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/admin/view-table/${table._id}`)}
                                                        className="px-3 py-1.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-medium"
                                                        aria-label={`Edit table ${table.tableName}`}
                                                    >
                                                        ✏️ Edit
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

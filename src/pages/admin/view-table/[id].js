import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditTable() {
    const router = useRouter();
    const { id } = router.query;
    const [table, setTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            axios.get(`/api/admin/tables/edit?id=${id}`)
                .then((res) => {
                    setTable(res.data.table);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching table:", err);
                    setError("Failed to load table data.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleInputChange = (rowIdx, colIdx, value) => {
        const updatedTable = { ...table };
        updatedTable.data[rowIdx].columns[colIdx].value = value;
        setTable(updatedTable);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!id || !table) {
            console.error("Table ID or Data is missing.");
            return;
        }

        try {
            console.log("Updating table:", table);
            await axios.put(`/api/admin/tables/update?id=${id}`, { table });

            console.log("Table Updated Successfully!");
            fetchTables(); // Refresh tables after update
        } catch (error) {
            console.error("Failed to update table:", error.response?.data || error.message);
        }
    };


    const calculateTotalMarks = () => {
        let total = 0;
        let maxTotal = 0;
        table.data.forEach(row => {
            row.columns.forEach(col => {
                if (col.type === "mark") {
                    total += Number(col.value) || 0;
                }
                if (col.type === "max-mark") {
                    maxTotal += Number(col.value) || 0;
                }
            });
        });
        return { total, maxTotal, percentage: maxTotal ? ((total / maxTotal) * 100).toFixed(2) : 0 };
    };

    if (loading || !table) return <p className="text-center text-gray-600">Loading table data...</p>;

    const { total, maxTotal, percentage } = calculateTotalMarks();

    return (
        <div className="container mx-auto mt-5 p-5 bg-white shadow-lg rounded-lg">
            <h1 className="text-center text-dark text-2xl font-bold mb-4">Edit Table: {table.tableName}</h1>
            <form onSubmit={handleSave} className="container mt-4 pb-5">
                {/* Table Description */}
                <div className="form-group mb-4 bg-white w-100 shadow-lg py-4 px-3 border-0 rounded-lg">
                    <label className="font-bold text-gray-700 mb-2">Table Description:</label>
                    <textarea
                        name="tableDescription"
                        className="w-full p-2 border rounded"
                        rows="3"
                        placeholder="Enter Table Description"
                        value={table.tableDescription}
                        onChange={(e) => setTable({ ...table, tableDescription: e.target.value })}
                    />
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-2 border">Row Number</th>
                                {table.columns.map((col, colIdx) => (
                                    <th key={colIdx} className="p-2 border">
                                        <input
                                            type="text"
                                            className="p-1 border rounded w-full"
                                            name={`columns[${colIdx}][name]`}
                                            value={col.name}
                                            onChange={(e) => {
                                                const updatedCols = [...table.columns];
                                                updatedCols[colIdx].name = e.target.value;
                                                setTable({ ...table, columns: updatedCols });
                                            }}
                                        />
                                        <label className="flex items-center mt-2">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={col.isEditable}
                                                onChange={() => {
                                                    const updatedCols = [...table.columns];
                                                    updatedCols[colIdx].isEditable = !updatedCols[colIdx].isEditable;
                                                    setTable({ ...table, columns: updatedCols });
                                                }}
                                            />
                                            Editable
                                        </label>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.data.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                    <td className="p-2 border text-center font-bold">{row.rowNumber}</td>
                                    {row.columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-2 border">
                                            <select
                                                className="form-select"
                                                value={col.type}
                                                onChange={(e) => {
                                                    const updatedTable = { ...table };
                                                    updatedTable.data[rowIdx].columns[colIdx].type = e.target.value;
                                                    setTable(updatedTable);
                                                }}
                                            >
                                                <option value="text">Text</option>
                                                <option value="radio">Radio</option>
                                                <option value="mark">Mark</option>
                                                <option value="max-mark">Max Mark</option>
                                            </select>

                                            {/* Input Fields Based on Type */}
                                            <div className="mt-2">
                                                {col.type === "text" && (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={col.value}
                                                        onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
                                                    />
                                                )}
                                                {col.type === "radio" && (
                                                    <div className="flex">
                                                        <label className="mr-3">
                                                            <input
                                                                type="radio"
                                                                name={`data[${rowIdx}][columns][${colIdx}][value]`}
                                                                value="Yes"
                                                                checked={col.value === "Yes"}
                                                                onChange={() => handleInputChange(rowIdx, colIdx, "Yes")}
                                                            /> Yes
                                                        </label>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`data[${rowIdx}][columns][${colIdx}][value]`}
                                                                value="No"
                                                                checked={col.value === "No"}
                                                                onChange={() => handleInputChange(rowIdx, colIdx, "No")}
                                                            /> No
                                                        </label>
                                                    </div>
                                                )}
                                                {(col.type === "mark" || col.type === "max-mark") && (
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={col.value}
                                                        onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="100%">
                                    <div className="mt-3 text-center">
                                        <div className="alert bg-blue-100 text-blue-700">Total Marks: {total}</div>
                                        <div className="alert bg-gray-100 text-gray-700">Max Marks: {maxTotal}</div>
                                        <div className="alert bg-green-100 text-green-700">Percentage: {percentage}%</div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <button type="submit" className="btn btn-primary w-full mt-3">Save Changes</button>
            </form>
        </div>
    );
}

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";

// export default function EditTable() {
//     const router = useRouter();
//     const { id } = router.query;
//     const [table, setTable] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (id) {
//             axios.get(`/api/admin/tables/edit?id=${id}`)
//                 .then((res) => {
//                     setTable(res.data.table);
//                     setLoading(false);
//                 })
//                 .catch((err) => {
//                     console.error("Error fetching table:", err);
//                     setError("Failed to load table data.");
//                     setLoading(false);
//                 });
//         }
//     }, [id]);

//     const handleInputChange = (rowIdx, colIdx, value) => {
//         const updatedTable = { ...table };
//         updatedTable.data[rowIdx].columns[colIdx].value = value;
//         setTable(updatedTable);
//     };

//     const handleSave = async (e) => {
//         e.preventDefault();

//         if (!id || !table) {
//             console.error("Table ID or Data is missing.");
//             return;
//         }

//         try {
//             console.log("Updating table:", table);
//             await axios.put(`/api/admin/tables/update?id=${id}`, { table });

//             console.log("Table Updated Successfully!");
//             fetchTables(); // Refresh tables after update
//         } catch (error) {
//             console.error("Failed to update table:", error.response?.data || error.message);
//         }
//     };


//     const calculateTotalMarks = () => {
//         let total = 0;
//         let maxTotal = 0;
//         table.data.forEach(row => {
//             row.columns.forEach(col => {
//                 if (col.type === "mark") {
//                     total += Number(col.value) || 0;
//                 }
//                 if (col.type === "max-mark") {
//                     maxTotal += Number(col.value) || 0;
//                 }
//             });
//         });
//         return { total, maxTotal, percentage: maxTotal ? ((total / maxTotal) * 100).toFixed(2) : 0 };
//     };

//     if (loading || !table) return <p className="text-center text-gray-600">Loading table data...</p>;

//     const { total, maxTotal, percentage } = calculateTotalMarks();

//     return (
//         <div className="container mx-auto mt-5 p-5 bg-white shadow-lg rounded-lg">
//             <h1 className="text-center text-dark text-2xl font-bold mb-4">Edit Table: {table.tableName}</h1>
//             <form onSubmit={handleSave} className="container mt-4 pb-5">
//                 {/* Table Description */}
//                 <div className="form-group mb-4 bg-white w-100 shadow-lg py-4 px-3 border-0 rounded-lg">
//                     <label className="font-bold text-gray-700 mb-2">Table Description:</label>
//                     <textarea
//                         name="tableDescription"
//                         className="w-full p-2 border rounded"
//                         rows="3"
//                         placeholder="Enter Table Description"
//                         value={table.tableDescription}
//                         onChange={(e) => setTable({ ...table, tableDescription: e.target.value })}
//                     />
//                 </div>

//                 {/* Table Data */}
//                 <div className="overflow-x-auto">
//                     <table className="table-auto w-full border border-gray-300">
//                         <thead className="bg-gray-200">
//                             <tr>
//                                 <th className="p-2 border">Row Number</th>
//                                 {table.columns.map((col, colIdx) => (
//                                     <th key={colIdx} className="p-2 border">
//                                         <input
//                                             type="text"
//                                             className="p-1 border rounded w-full"
//                                             name={`columns[${colIdx}][name]`}
//                                             value={col.name}
//                                             onChange={(e) => {
//                                                 const updatedCols = [...table.columns];
//                                                 updatedCols[colIdx].name = e.target.value;
//                                                 setTable({ ...table, columns: updatedCols });
//                                             }}
//                                         />
//                                         <label className="flex items-center mt-2">
//                                             <input
//                                                 type="checkbox"
//                                                 className="mr-2"
//                                                 checked={col.isEditable}
//                                                 onChange={() => {
//                                                     const updatedCols = [...table.columns];
//                                                     updatedCols[colIdx].isEditable = !updatedCols[colIdx].isEditable;
//                                                     setTable({ ...table, columns: updatedCols });
//                                                 }}
//                                             />
//                                             Editable
//                                         </label>
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {table.data.map((row, rowIdx) => (
//                                 <tr key={rowIdx}>
//                                     <td className="p-2 border text-center font-bold">{row.rowNumber}</td>
//                                     {row.columns.map((col, colIdx) => (
//                                         <td key={colIdx} className="p-2 border">
//                                             <select
//                                                 className="form-select"
//                                                 value={col.type}
//                                                 onChange={(e) => {
//                                                     const updatedTable = { ...table };
//                                                     updatedTable.data[rowIdx].columns[colIdx].type = e.target.value;
//                                                     setTable(updatedTable);
//                                                 }}
//                                             >
//                                                 <option value="text">Text</option>
//                                                 <option value="radio">Radio</option>
//                                                 <option value="mark">Mark</option>
//                                                 <option value="max-mark">Max Mark</option>
//                                             </select>

//                                             {/* Input Fields Based on Type */}
//                                             <div className="mt-2">
//                                                 {col.type === "text" && (
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         value={col.value}
//                                                         onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
//                                                     />
//                                                 )}
//                                                 {col.type === "radio" && (
//                                                     <div className="flex">
//                                                         <label className="mr-3">
//                                                             <input
//                                                                 type="radio"
//                                                                 name={`data[${rowIdx}][columns][${colIdx}][value]`}
//                                                                 value="Yes"
//                                                                 checked={col.value === "Yes"}
//                                                                 onChange={() => handleInputChange(rowIdx, colIdx, "Yes")}
//                                                             /> Yes
//                                                         </label>
//                                                         <label>
//                                                             <input
//                                                                 type="radio"
//                                                                 name={`data[${rowIdx}][columns][${colIdx}][value]`}
//                                                                 value="No"
//                                                                 checked={col.value === "No"}
//                                                                 onChange={() => handleInputChange(rowIdx, colIdx, "No")}
//                                                             /> No
//                                                         </label>
//                                                     </div>
//                                                 )}
//                                                 {(col.type === "mark" || col.type === "max-mark") && (
//                                                     <input
//                                                         type="number"
//                                                         className="form-control"
//                                                         value={col.value}
//                                                         onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
//                                                     />
//                                                 )}
//                                             </div>
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}
//                         </tbody>
//                         <tfoot>
//                             <tr>
//                                 <td colSpan="100%">
//                                     <div className="mt-3 text-center">
//                                         <div className="alert bg-blue-100 text-blue-700">Total Marks: {total}</div>
//                                         <div className="alert bg-gray-100 text-gray-700">Max Marks: {maxTotal}</div>
//                                         <div className="alert bg-green-100 text-green-700">Percentage: {percentage}%</div>
//                                     </div>
//                                 </td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                 </div>

//                 <button type="submit" className="btn btn-primary w-full mt-3">Save Changes</button>
//             </form>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";

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
        if (!id || !table) return;

        try {
            await axios.put(`/api/admin/tables/update?id=${id}`, { table });
            console.log("Table Updated Successfully!");
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

    if (loading || !table) return <p className="text-center text-gray-500 mt-10">Loading table data...</p>;

    const { total, maxTotal, percentage } = calculateTotalMarks();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-white flex flex-col lg:flex-row text-xs sm:text-sm text-gray-900 font-inter">
        <AdminSidebar />
        <div className="flex-1 p-4 sm:p-6 md:p-8 mx-auto w-full space-y-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight">
            Edit: {table.tableName}
        </h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-1 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M12 20h.01M12 4.25c4.25 0 7.75 3.5 7.75 7.75S16.25 19.75 12 19.75 4.25 16.25 4.25 12 7.75 4.25 12 4.25z"
                />
            </svg>
            <div>
                <p className="font-semibold text-sm sm:text-base">⚠️ Important!</p>
                <p className="text-xs sm:text-sm mt-1">
                    Remember, <span className="font-bold">you must fill in the Max Marks now</span>. It will not be possible to update them later.
                </p>
            </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
            {/* Table Description */}
            <div>
                <label htmlFor="table-description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    id="table-description"
                    name="tableDescription"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all duration-200 hover:bg-gray-100"
                    rows="3"
                    placeholder="Enter table description"
                    value={table.tableDescription}
                    onChange={(e) => setTable({ ...table, tableDescription: e.target.value })}
                    aria-label="Table description"
                />
            </div>

            {/* Table Data */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-lg">
                <table className="min-w-full bg-white text-gray-900 text-xs sm:text-sm rounded-xl overflow-hidden">
                    <thead className="bg-green-50 text-green-600 font-semibold text-xs tracking-wide">
                        <tr>
                            <th className="p-3 sm:p-4 border-b text-left">Row</th>
                            {table.columns.map((col, colIdx) => (
                                <th key={colIdx} className="p-3 sm:p-4 border-b text-left">
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-100 transition-all duration-200"
                                        value={col.name}
                                        onChange={(e) => {
                                            const updatedCols = [...table.columns];
                                            updatedCols[colIdx].name = e.target.value;
                                            setTable({ ...table, columns: updatedCols });
                                        }}
                                        aria-label={`Column ${colIdx + 1} name`}
                                    />
                                    <label className="flex items-center mt-2 text-xs text-gray-600">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-2"
                                            checked={col.isEditable}
                                            onChange={() => {
                                                const updatedCols = [...table.columns];
                                                updatedCols[colIdx].isEditable = !updatedCols[colIdx].isEditable;
                                                setTable({ ...table, columns: updatedCols });
                                            }}
                                            aria-label={`Editable for column ${colIdx + 1}`}
                                        />
                                        Editable
                                    </label>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {table.data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-gray-50 transition-all duration-200">
                                <td className="p-3 sm:p-4 border-b font-semibold text-green-600">{row.rowNumber}</td>
                                {row.columns.map((col, colIdx) => (
                                    <td key={colIdx} className="p-3 sm:p-4 border-b">
                                        <select
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-100 transition-all duration-200"
                                            value={col.type}
                                            onChange={(e) => {
                                                const updatedTable = { ...table };
                                                updatedTable.data[rowIdx].columns[colIdx].type = e.target.value;
                                                setTable(updatedTable);
                                            }}
                                            aria-label={`Column ${colIdx + 1} type for row ${rowIdx + 1}`}
                                        >
                                            <option value="text">Text</option>
                                            <option value="radio">Radio</option>
                                            <option value="mark">Mark</option>
                                            <option value="max-mark">Max Mark</option>
                                        </select>

                                        <div className="mt-3">
                                            {col.type === "text" && (
                                                <textarea
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-100 transition-all duration-200 resize-none"
                                                    value={col.value}
                                                    ref={(el) => {
                                                        if (el) {
                                                            el.style.height = 'auto';
                                                            el.style.height = el.scrollHeight + 'px';
                                                        }
                                                    }}
                                                    onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
                                                    aria-label={`Text input for column ${colIdx + 1}, row ${rowIdx + 1}`}
                                                />
                                            )}
                                            {col.type === "radio" && (
                                                <div className="flex items-center gap-3">
                                                    {["Yes", "No"].map((opt) => (
                                                        <label
                                                            key={opt}
                                                            className={`flex items-center px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm ${
                                                                col.value === opt
                                                                    ? 'bg-green-50 text-green-600 border-green-500 shadow-sm'
                                                                    : 'bg-white text-gray-800 border-gray-200 hover:border-green-500'
                                                            } ${!col.isEditable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                className="hidden"
                                                                name={`data[${rowIdx}][columns][${colIdx}][value]`}
                                                                value={opt}
                                                                checked={col.value === opt}
                                                                onChange={() => handleInputChange(rowIdx, colIdx, opt)}
                                                                disabled={!col.isEditable}
                                                                aria-label={`${opt} for column ${colIdx + 1}, row ${rowIdx + 1}`}
                                                            />
                                                            {opt}
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                            {(col.type === "mark" || col.type === "max-mark") && (
                                                <input
                                                    type="number"
                                                    className="w-full p-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-gray-100 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    value={col.value}
                                                    disabled={col.type === 'mark'}
                                                    onChange={(e) => handleInputChange(rowIdx, colIdx, e.target.value)}
                                                    aria-label={`${col.type === 'mark' ? 'Mark' : 'Max Mark'} for column ${colIdx + 1}, row ${rowIdx + 1}`}
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
                            <td colSpan="100%" className="p-4 sm:p-6 bg-gray-50">
                                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                    <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl shadow-sm">
                                        Total Marks: {total}
                                    </div>
                                    <div className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl shadow-sm">
                                        Max Marks: {maxTotal}
                                    </div>
                                    <div className="bg-green-50 text-green-600 px-4 py-2 rounded-xl shadow-sm">
                                        Percentage: {percentage}%
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
                aria-label="Save table changes"
            >
                <span>💾 Save Changes</span>
            </button>
        </form>
    </div>
    </div>
    );
}

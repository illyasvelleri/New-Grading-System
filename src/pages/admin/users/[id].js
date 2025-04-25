import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";

export default function UserDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [tables, setTables] = useState([]);
    const [modifiedTables, setModifiedTables] = useState(new Set());


    useEffect(() => {
        if (id) {
            fetchSections();
        }
    }, [id]);

    const fetchSections = async () => {
        try {
            const res = await axios.get(`/api/admin/users/${id}/sections`);
            setSections(res.data.sections);
        } catch (err) {
            console.error("Error fetching sections:", err);
        }
    };

    const fetchTables = async (sectionId) => {
        const section = sections.find((sec) => sec._id === sectionId)
        setSelectedSection(section);
        try {
            console.log("Fetching tables for", id, sectionId);

            const res = await axios.get(`/api/admin/users/${id}/sectionId/${sectionId}/tables`);
            setTables(res.data.tables);
        } catch (err) {
            console.error("Error fetching tables:", err);
        }
    };
    const handleInputChange = (tableIndex, rowIndex, columnIndex, value) => {
        const updatedTables = [...tables];
        updatedTables[tableIndex].data[rowIndex].columns[columnIndex].value = value;
        setTables(updatedTables);

        // Add this to track modifications
        setModifiedTables(prev => new Set(prev).add(tableIndex));
    };

    const handleSave = async (e, tableIndex) => {
        e.preventDefault();

        const filteredTableData = tables[tableIndex].data.map((row) => ({
            rowNumber: row.rowNumber,
            columns: row.columns
                .filter((col) => col.type === 'mark' || col.type === 'max-mark')
                .map((col) => ({
                    type: col.type,
                    value: col.value,
                })),
        }));

        const payload = {
            userId: id,
            sectionId: selectedSection._id,
            tableId: tables[tableIndex]._id,
            data: filteredTableData,
        };

        // send to backend
        await axios.post("/api/admin/users/update-mark", payload);
    };


    return (
        <div className="min-h-screen w-full bg-white text-gray-900 flex flex-col md:flex-row overflow-x-auto">
            <AdminSidebar />
            <div className="flex-1 p-6 md:p-10 bg-gray-50">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 tracking-tight">
                👤 User Details: <span className="text-accent">{tables[0]?.user?.username || "Unknown User"}</span>
            </h1>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">📁 Sections</h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sections.map((section) => (
                        <li
                            key={section._id}
                            onClick={() => fetchTables(section._id)}
                            className="cursor-pointer bg-base border border-primary/20 hover:shadow-xl hover:border-accent transition-all p-4 rounded-2xl text-gray-900 font-medium hover:bg-accent hover:text-white"
                        >
                            {section.name}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedSection && (
                <>
                    <h3 className="text-2xl font-semibold mb-6">
                        🧾 Tables in Section: <span className="text-accent">{selectedSection?.name}</span>
                    </h3>

                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-12 tracking-tight">
                        {selectedSection.name} <span className="text-accent">Tables</span>
                    </h2>

                    {tables.length ? (
                        tables.map((table, tableIndex) => (
                            <form
                                onSubmit={(e) => handleSave(e, tableIndex)}
                                key={table._id}
                                className="bg-base border border-primary/10 shadow-xl rounded-2xl p-6 md:p-8 mb-12 transition-all hover:shadow-2xl"
                            >
                                <div className="mb-6">
                                    <p className="text-2xl font-semibold text-white">
                                        🧾 Table: <span className="text-accent">{table.tableName}</span>
                                    </p>
                                </div>

                                <input type="hidden" name="sectionId" value={selectedSection._id} />

                                {/* Table Description */}
                                <div className="mb-8">
                                    <label className="block text-white text-sm font-medium mb-2">📝 Table Description</label>
                                    <textarea
                                        disabled
                                        name="tableDescription"
                                        className="w-full no-scrollbar bg-base border border-primary/30 rounded-xl px-4 py-3 text-white shadow-sm resize-none"
                                        rows="3"
                                        placeholder="Enter Table Description"
                                        defaultValue={table.tableDescription}
                                        onInput={(e) => {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                    />
                                </div>

                                {/* Table Content */}
                                <div className="overflow-x-auto rounded-xl border border-primary/20 shadow-lg">
                                    <table className="min-w-full bg-white text-black divide-y divide-primary/30 text-sm rounded-xl overflow-hidden">
                                        <thead className="bg-accent text-white text-bold uppercase font-semibold text-xs tracking-wide">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Row</th>
                                                {table.columns.map((column, columnIndex) => (
                                                    <th key={columnIndex} className="px-6 py-6 text-center">
                                                        {column.name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-primary/10">
                                            {table.data.map((row, rowIndex) => (
                                                <tr key={rowIndex} className="hover:bg-gray-50 transition-all duration-150">
                                                    <td className="px-6 py-4 font-semibold text-primary">{row.rowNumber}</td>

                                                    {row.columns.map((column, columnIndex) => (
                                                        <td key={columnIndex} className={`border border-primary/20 font-semibold align-top p-0 ${['mark', 'max-mark'].includes(column.type) ? 'w-24' : ''
                                                            }`}
                                                            style={{
                                                                backgroundColor: 'transparent',
                                                                width: ['mark', 'max-mark'].includes(column.type) ? '80px' : 'auto',
                                                            }}>
                                                            {/* Textarea */}
                                                            {column.type === 'text' && (
                                                                <textarea
                                                                    className="w-full h-full block no-scrollbar bg-white border-none outline-none px-4 py-2 text-black resize-none"
                                                                    name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                                                    defaultValue={column.value}
                                                                    readOnly={true}
                                                                    ref={(el) => {
                                                                        if (el) {
                                                                            el.style.height = 'auto';
                                                                            el.style.height = el.scrollHeight + 'px';
                                                                        }
                                                                    }}
                                                                    onInput={(e) => {
                                                                        e.target.style.height = 'auto';
                                                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                                                        handleInputChange(tableIndex, rowIndex, columnIndex, e.target.value);
                                                                    }}
                                                                    rows="1"
                                                                />
                                                            )}

                                                            {/* Radio */}
                                                            {column.type === 'radio' && (
                                                                <div className="flex items-center gap-4 mt-2">
                                                                    <input
                                                                        type="hidden"
                                                                        name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                                                        value="No"
                                                                    />
                                                                    {['Yes', 'No'].map((val) => (
                                                                        <label
                                                                            key={val}
                                                                            className={`flex items-center px-4 py-2 rounded-full border transition-all cursor-pointer 
                                  ${column.value === val
                                                                                    ? 'bg-accent text-white border-accent shadow-md'
                                                                                    : 'bg-white text-black border-gray-300 hover:border-accent'
                                                                                } 
                                  ${!column.isEditable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                                                                value={val}
                                                                                defaultChecked={column.value === val}
                                                                                disabled={true}
                                                                                onChange={(e) =>
                                                                                    handleInputChange(tableIndex, rowIndex, columnIndex, e.target.value)
                                                                                }
                                                                                className="hidden"
                                                                            />
                                                                            <span className="text-sm font-medium">{val}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>

                                                            )}

                                                            {/* Marks */}
                                                            {['mark', 'max-mark'].includes(column.type) && (
                                                                <input
                                                                    type="number"
                                                                    className="w-full mt-2 border-none outline-none px-4 py-2 text-black "
                                                                    name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                                                    defaultValue={column.value}
                                                                    disabled={column.type !== 'mark'}
                                                                    onChange={(e) =>
                                                                        handleInputChange(tableIndex, rowIndex, columnIndex, e.target.value)
                                                                    }
                                                                />
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>

                                        <tfoot className="bg-gray-100 text-black text-sm font-medium">
                                            <tr>
                                                <td colSpan="100%" className="px-6 py-4">
                                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                        <div>Total Marks: <span className="text-accent">{table.totalMarks}</span></div>
                                                        <div>Max Marks: <span className="text-accent">{table.maxMarks}</span></div>
                                                        <div>Percentage: <span className="text-accent">{table.percentage}%</span></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        disabled={!modifiedTables.has(tableIndex)}
                                        className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold transition ${modifiedTables.has(tableIndex)
                                            ? 'bg-gradient-to-r from-primary to-accent hover:brightness-110'
                                            : 'bg-gray-600 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        💾 Save Score
                                    </button>
                                </div>
                            </form>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 text-lg">No tables available for this section.</p>
                    )}
                </>
            )}
        </div>
        </div>
    );
}

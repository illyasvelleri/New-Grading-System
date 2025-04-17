// 'use client';
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// const ViewSection = () => {
//   const router = useRouter();
//   const [id, setId] = useState(null);
//   const [section, setSection] = useState(null);
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Wait for router to be ready before accessing query
//   useEffect(() => {
//     if (router.isReady) {
//       setId(router.query.id || null);
//     }
//   }, [router.isReady, router.query]);

//   useEffect(() => {
//     if (!id) return;

//     const fetchSection = async () => {
//       try {
//         const response = await fetch(`/api/user/sections/view-section?id=${id}`);
//         const data = await response.json();

//         if (!response.ok) throw new Error(data.error || "Failed to load");

//         setSection(data.section);
//         setTables(data.tables);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSection();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!section) return <p>Section not found.</p>;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//         {section.name} - Tables
//       </h2>
//       {tables.length ? (
//         tables.map((table) => (
//           <form
//             key={table._id}
//             onSubmit={async (e) => {
//               e.preventDefault();
//               const formData = new FormData(e.target);
//               let payload = {};

//               formData.forEach((value, key) => {
//                 payload[key] = value;
//               });

//               // Ensure all inputs (including radio) are handled
//               document.querySelectorAll("input").forEach((input) => {
//                 const name = input.name;

//                 // Ensure the radio button sends only selected value
//                 if (input.type === "radio" && input.checked) {
//                   payload[name] = input.value;
//                 }

//                 // Assign default values for type and isEditable if missing
//                 if (!payload[`${name}_type`]) {
//                   payload[`${name}_type`] = input.dataset.type || input.type;
//                 }
//                 if (!payload[`${name}_isEditable`]) {
//                   payload[`${name}_isEditable`] = input.dataset.iseditable === "true";
//                 }
//               });

//               try {
//                 const response = await fetch("/api/user/tables/save", {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     sectionId: section._id,
//                     tableId: table._id,
//                     data: payload,
//                   }),
//                 });

//                 if (!response.ok) {
//                   throw new Error("Failed to save table data");
//                 }

//                 alert("Table data saved successfully!");
//               } catch (error) {
//                 console.error(error);
//                 alert("Error saving table data");
//               }
//             }}
//           >


//             <p className="text-lg font-medium text-gray-700 mb-4">Table: {table._id}</p>
//             <input type="hidden" name="sectionId" value={section._id} />

//             {/* Table Description */}
//             <div className="mb-4">
//               <label className="block text-gray-600 font-medium mb-2">Table Description:</label>
//               <textarea
//                 name="tableDescription"
//                 className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
//                 rows="3"
//                 placeholder="Enter Table Description"
//                 defaultValue={table.tableDescription}
//               />
//             </div>

//             {/* Table Content */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
//                 <thead className="bg-gray-200">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-gray-700 font-semibold">Row Number</th>
//                     {table.columns.map((column, columnIndex) => (
//                       <th key={columnIndex} className="px-4 py-2 text-left text-gray-700 font-semibold">
//                         {column.name} {column.isEditable ? '(Editable)' : '(Read-only)'}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {table.data.map((row, rowIndex) => (
//                     <tr key={rowIndex} className="border-t border-gray-300">
//                       <td className="px-4 py-2 font-semibold">{row.rowNumber}</td>
//                       {row.columns.map((column, columnIndex) => (
//                         <td key={columnIndex} className="px-4 py-2">
//                           {column.type === 'text' && (
//                             <input
//                               type="text"
//                               className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
//                               name={`data[${rowIndex}][columns][${columnIndex}][value]`}
//                               defaultValue={column.value}
//                               readOnly={!column.isEditable}
//                             />
//                           )}
//                           {column.type === 'radio' && (
//                             <div className="flex space-x-4">
//                               {/* Hidden input to ensure value is always sent */}
//                               <input
//                                 type="hidden"
//                                 name={`data[${rowIndex}][columns][${columnIndex}][value]`}
//                                 value="No"
//                               />

//                               <label className="flex items-center">
//                                 <input
//                                   type="radio"
//                                   name={`data[${rowIndex}][columns][${columnIndex}][value]`}
//                                   value="Yes"
//                                   defaultChecked={column.value === 'Yes'}
//                                   disabled={!column.isEditable}
//                                   data-type="radio"  // Ensure type is included
//                                   data-iseditable={column.isEditable} // Ensure isEditable is included
//                                 />
//                                 <span className="ml-2">Yes</span>
//                               </label>
//                               <label className="flex items-center">
//                                 <input
//                                   type="radio"
//                                   name={`data[${rowIndex}][columns][${columnIndex}][value]`}
//                                   value="No"
//                                   defaultChecked={column.value === 'No'}
//                                   disabled={!column.isEditable}
//                                   data-type="radio"
//                                   data-iseditable={column.isEditable}
//                                 />
//                                 <span className="ml-2">No</span>
//                               </label>
//                             </div>
//                           )}

//                           {column.type === 'mark' && (
//                             <div className="mt-2">
//                               <input
//                                 type="hidden"
//                                 name={`data[${rowIndex}][columns][${columnIndex}][name]`}
//                                 value={column.name}
//                               />
//                               <input
//                                 type="number"
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
//                                 name={`data[${rowIndex}][columns][${columnIndex}][value]`}
//                                 defaultValue={column.value}
//                                 onInput={() => calculateTotal()} // Ensure this function is defined
//                                 readOnly={!column.isEditable}
//                               />
//                             </div>
//                           )}
//                           {column.type === 'max-mark' && (
//                             <div className="mt-2">
//                               <input
//                                 type="hidden"
//                                 name={`data[${rowIndex}][columns][${columnIndex}][name]`}
//                                 value={column.name}
//                               />
//                               <input
//                                 type="number"
//                                 className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
//                                 name={`data[${rowIndex}][columns][${columnIndex}][value]`}
//                                 defaultValue={column.value}
//                                 onInput={() => calculateTotal()} // Ensure this function is defined
//                                 readOnly={!column.isEditable}
//                               />
//                             </div>
//                           )}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="bg-gray-100 font-semibold">
//                     <td colSpan="100%" className="px-4 py-2 text-gray-700">
//                       <div>Total Marks: {table.totalMarks}</div>
//                       <div>Max Marks: {table.maxMarks}</div>
//                       <div>Percentage: {table.percentage}%</div>
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition"
//             >
//               Save Changes
//             </button>
//           </form>
//         ))
//       ) : (
//         <p className="text-center text-gray-600">No tables available for this section.</p>
//       )}
//     </div>
//   );
// };

// export default ViewSection;






import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditTable() {
  const router = useRouter();
  const { id } = router.query;
  const [section, setSection] = useState({});
  const [tables, setTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modifiedTables, setModifiedTables] = useState(new Set());

  useEffect(() => {
    if (!router.isReady || !id) return;

    axios
      .get(`/api/user/sections/view-section?id=${id}`)
      .then((res) => {
        setSection(res.data.section);
        setTable(res.data.tables);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching table:", err);
        setError("Failed to load table data.");
        setLoading(false);
      });
  }, [router.isReady, id]);

  const handleInputChange = (tableIndex, rowIdx, colIdx, value) => {
    const updatedTables = [...tables];
    updatedTables[tableIndex].data[rowIdx].columns[colIdx].value = value;
    setTable(updatedTables);
    setModifiedTables(prev => new Set(prev).add(tableIndex));
  };

  const handleSave = async (e, tableIndex) => {
    e.preventDefault();
    if (!id || !tables || tableIndex === undefined || !modifiedTables.has(tableIndex)) return;

    try {
      setLoading(true);
      const tableToSave = tables[tableIndex];

      // Structure the data as the backend expects
      const payload = {
        sectionId: id, // Use the section ID from the query
        tableId: tableToSave._id, // Use the table's _id as tableId
        tableRef: tableToSave.table, // "Table" reference ID
        table: {
          columns: tableToSave.columns,
          rowsCount: tableToSave.rowsCount,
          data: tableToSave.data,
          tableDescription: tableToSave.tableDescription || "",
          totalMarks: tableToSave.totalMarks || [],
          maxMarks: tableToSave.maxMarks || [],
          percentage: tableToSave.percentage || []
        }
      };

      console.log("Data being sent to backend:", payload); // Log for debugging
      await axios.put(`/api/user/tables/save?id=${id}`, payload);
      console.log("Table Updated Successfully!");
      setModifiedTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(tableIndex);
        return newSet;
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to update table:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 min-h-screen px-4 py-10 md:px-8 lg:px-16 xl:px-24">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-12 tracking-tight">
        {section.name} <span className="text-accent">Tables</span>
      </h2>

      {tables.length ? (
        tables.map((table, tableIndex) => (
          <form
            onSubmit={(e) => handleSave(e, tableIndex)}
            key={table._id}
            className="bg-secondary border border-primary/10 shadow-xl rounded-2xl p-6 md:p-8 mb-12 transition-all hover:shadow-2xl"
          >
            <div className="mb-6">
              <p className="text-2xl font-semibold text-white">
                🧾 Table: <span className="text-accent">{table.tableName}</span>
              </p>
            </div>

            <input type="hidden" name="sectionId" value={section._id} />

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
                  <tr className="text-lg">
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
                        <td key={columnIndex} className="px-6 py-3 align-top">
                          {/* Textarea */}
                          {column.type === 'text' && (
                            <textarea
                              className="w-full no-scrollbar bg-white border border-primary/40 outline-none rounded-xl px-4 py-2 text-black shadow-sm focus:ring-2 focus:ring-green-800 resize-none"
                              name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                              defaultValue={column.value}
                              readOnly={!column.isEditable}
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
                                  ${
                                    column.value === val
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
                                  disabled={!column.isEditable}
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
                              className="w-24 sm:w-20 mt-2 bg-white border border-primary/40 rounded-xl px-4 py-2 text-black shadow-sm focus:ring-2 focus:ring-primary focus:outline-none text-center"
                              name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                              defaultValue={column.value}
                              readOnly={!column.isEditable}
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
                💾 Save Changes
              </button>
            </div>
          </form>
        ))
      ) : (
        <p className="text-center text-gray-400 text-lg">No tables available for this section.</p>
      )}
    </div>



  );
}
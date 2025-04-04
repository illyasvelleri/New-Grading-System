'use client';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ViewSection = () => {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [section, setSection] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Wait for router to be ready before accessing query
  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id || null);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!id) return;

    const fetchSection = async () => {
      try {
        const response = await fetch(`/api/user/sections/view-section?id=${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to load");

        setSection(data.section);
        setTables(data.tables);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!section) return <p>Section not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {section.name} - Tables
      </h2>
      {tables.length ? (
        tables.map((table) => (
          <form
  key={table._id}
  onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let payload = {};

    formData.forEach((value, key) => {
      payload[key] = value;
    });

    // Ensure all inputs (including radio) are handled
    document.querySelectorAll("input").forEach((input) => {
      const name = input.name;

      // Ensure the radio button sends only selected value
      if (input.type === "radio" && input.checked) {
        payload[name] = input.value;
      }

      // Assign default values for type and isEditable if missing
      if (!payload[`${name}_type`]) {
        payload[`${name}_type`] = input.dataset.type || input.type;
      }
      if (!payload[`${name}_isEditable`]) {
        payload[`${name}_isEditable`] = input.dataset.iseditable === "true";
      }
    });

    try {
      const response = await fetch("/api/user/tables/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sectionId: section._id,
          tableId: table._id,
          data: payload,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save table data");
      }

      alert("Table data saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving table data");
    }
  }}
>


            <p className="text-lg font-medium text-gray-700 mb-4">Table: {table._id}</p>
            <input type="hidden" name="sectionId" value={section._id} />

            {/* Table Description */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">Table Description:</label>
              <textarea
                name="tableDescription"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                rows="3"
                placeholder="Enter Table Description"
                defaultValue={table.tableDescription}
              />
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-700 font-semibold">Row Number</th>
                    {table.columns.map((column, columnIndex) => (
                      <th key={columnIndex} className="px-4 py-2 text-left text-gray-700 font-semibold">
                        {column.name} {column.isEditable ? '(Editable)' : '(Read-only)'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-gray-300">
                      <td className="px-4 py-2 font-semibold">{row.rowNumber}</td>
                      {row.columns.map((column, columnIndex) => (
                        <td key={columnIndex} className="px-4 py-2">
                          {column.type === 'text' && (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                              name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                              defaultValue={column.value}
                              readOnly={!column.isEditable}
                            />
                          )}
                          {column.type === 'radio' && (
                            <div className="flex space-x-4">
                              {/* Hidden input to ensure value is always sent */}
                              <input
                                type="hidden"
                                name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                value="No"
                              />

                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                  value="Yes"
                                  defaultChecked={column.value === 'Yes'}
                                  disabled={!column.isEditable}
                                  data-type="radio"  // Ensure type is included
                                  data-iseditable={column.isEditable} // Ensure isEditable is included
                                />
                                <span className="ml-2">Yes</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                  value="No"
                                  defaultChecked={column.value === 'No'}
                                  disabled={!column.isEditable}
                                  data-type="radio"
                                  data-iseditable={column.isEditable}
                                />
                                <span className="ml-2">No</span>
                              </label>
                            </div>
                          )}

                          {column.type === 'mark' && (
                            <div className="mt-2">
                              <input
                                type="hidden"
                                name={`data[${rowIndex}][columns][${columnIndex}][name]`}
                                value={column.name}
                              />
                              <input
                                type="number"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                                name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                defaultValue={column.value}
                                onInput={() => calculateTotal()} // Ensure this function is defined
                                readOnly={!column.isEditable}
                              />
                            </div>
                          )}
                          {column.type === 'max-mark' && (
                            <div className="mt-2">
                              <input
                                type="hidden"
                                name={`data[${rowIndex}][columns][${columnIndex}][name]`}
                                value={column.name}
                              />
                              <input
                                type="number"
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                                name={`data[${rowIndex}][columns][${columnIndex}][value]`}
                                defaultValue={column.value}
                                onInput={() => calculateTotal()} // Ensure this function is defined
                                readOnly={!column.isEditable}
                              />
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="100%" className="px-4 py-2 text-gray-700">
                      <div>Total Marks: {table.totalMarks}</div>
                      <div>Max Marks: {table.maxMarks}</div>
                      <div>Percentage: {table.percentage}%</div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </form>
        ))
      ) : (
        <p className="text-center text-gray-600">No tables available for this section.</p>
      )}
    </div>
  );
};

export default ViewSection;






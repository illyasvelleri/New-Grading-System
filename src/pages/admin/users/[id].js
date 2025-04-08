import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [tables, setTables] = useState([]);

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
        setSelectedSection(sectionId);
        try {
            const res = await axios.get(`/api/admin/user/${id}/section/${sectionId}/tables`);
            setTables(res.data.tables);
        } catch (err) {
            console.error("Error fetching tables:", err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Details: {id}</h1>

            <h2 className="text-xl font-semibold mb-2">Sections:</h2>
            <ul className="mb-4">
                {sections.map((section) => (
                    <li
                        key={section._id}
                        className="cursor-pointer text-blue-600 hover:underline"
                        onClick={() => fetchTables(section._id)}
                    >
                        {section.name}
                    </li>
                ))}
            </ul>

            {selectedSection && (
                <>
                    <h3 className="text-lg font-medium mb-2">Tables in Section: {selectedSection}</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tables.map((table) => (
                            <div
                                key={table._id}
                                className="p-4 bg-white rounded shadow border"
                            >
                                <h4 className="font-semibold text-gray-700 mb-2">{table.title}</h4>
                                <p className="text-gray-600 text-sm mb-2">Submitted: {table.date}</p>

                                {/* Add mark input */}
                                <input
                                    type="number"
                                    placeholder="Mark"
                                    className="border rounded px-2 py-1 w-full"
                                />
                                <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                    Save Mark
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

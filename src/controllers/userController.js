import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import User from "@/models/User";
import Section from "@/models/Section";
import Table from "@/models/Table";
import UserTableData from "@/models/UserTableData";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;

// 📌 User Registration
export async function registerUser(req, res) {
    // Connect to the database
    await db();

    // Check if method is POST
    if (req.method !== "POST") {
        console.log("Invalid method:", req.method);
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Destructure body
    const { username, email, category, password } = req.body;
    console.log("Request body:", req.body);

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        console.log("Email already registered:", email);
        return res.status(400).json({ error: "Email already registered" });
    }

    // Log before hashing the password
    console.log("Hashing password for:", email);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Log after password is hashed
    console.log("Password hashed for:", email);

    // Create new user
    try {
        const newUser = await User.create({ username, email, category, password: hashedPassword });
        console.log("New user created:", newUser);

        // Respond with success
        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.log("Error creating user:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}


// 📌 User Login
export async function loginUser(req, res) {
    await db();

    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const { identifier, password } = req.body;

    // 🔍 Find user by email OR username
    const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // Generate JWT and store in HTTP-only cookie
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.setHeader("Set-Cookie", `authToken=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`);
    res.status(200).json({ message: "Login successful" });
}

// 📌 Get Logged-in User Profile
export async function getUserProfile(req, res) {
    await db();

    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

export const listSection = async (req, res) => {
    try {
        await db(); // Ensure database connection

        // 1. Get token from cookies
        const token = req.cookies?.authToken;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token" });

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // 3. Filter sections by user's category
        const sections = await Section.find({ sectionCategory: user.category });

        if (!sections.length) {
            return res.status(404).json({ error: "No Sections Found for your category" });
        }

        res.status(200).json({ sections });
    } catch (error) {
        console.error("Error fetching sections:", error);
        res.status(500).json({ error: "Failed to fetch sections" });
    }
};

export const viewSection = async (req, res) => {
    try {
        await db();

        const token = req.cookies?.authToken;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        console.log("👤 Authenticated User ID:", userId);

        const { id } = req.query;
        if (!id) return res.status(400).json({ error: "Missing Section ID." });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid Section ID format." });

        const section = await Section.findById(id);
        console.log("section:", section);
        if (!section) return res.status(404).json({ error: "Section Not Found" });

        const userTables = await UserTableData.find({ section: section._id, user: userId }).populate("user").lean();
        console.log("user tables:", JSON.stringify(userTables, null, 2));

        const adminTables = await Table.find({ section: section._id }).populate("section").lean();
        console.log("admin tables:", JSON.stringify(adminTables, null, 2));

        let tables = [];

        if (userTables.length > 0) {
            userTables.forEach(userTable => {
                const matchingAdminTable = adminTables.find(admin =>
                    admin._id.toString() === userTable.table?.toString()
                );
                console.log(`Matching admin table for user table ${userTable._id}:`, matchingAdminTable);

                let processedTable = userTable;
                if (matchingAdminTable) {
                    processedTable = mergeUserTableWithAdmin(userTable, matchingAdminTable); // No merging
                }
                formatTableData(processedTable);
                tables.push(processedTable);
            });
        }

        const userTableRefs = new Set(userTables.map(ut => ut.table?.toString()));
        const newAdminTables = adminTables.filter(admin =>
            !userTableRefs.has(admin._id.toString())
        );
        console.log("new admin tables:", JSON.stringify(newAdminTables, null, 2));
        newAdminTables.forEach(formatTableData);
        tables.push(...newAdminTables);

        if (!tables.length) {
            return res.status(404).json({ error: "No tables available for this section." });
        }

        res.status(200).json({ section, tables });
    } catch (err) {
        console.error("❌ Error in viewSection:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const mergeUserTableWithAdmin = (userTable, adminTable) => {
    console.log("🔄 Processing User Table (No Merging)");
    console.log("User Table:", JSON.stringify(userTable, null, 2));
    console.log("Admin Table (Reference Only):", JSON.stringify(adminTable, null, 2));

    let updatedTable = { ...userTable };

    console.log("Final Table (Unchanged):", JSON.stringify(updatedTable, null, 2));
    return updatedTable;
};

const formatTableData = (table) => {
    console.log("🎨 Formatting Table Data:", JSON.stringify(table, null, 2));

    table.columns = table.columns.map(col => ({ ...col, isEditable: col.isEditable === true }));

    table.data.forEach(row => {
        row.columns = row.columns.map(col => {
            const matchingColumn = table.columns.find(tc => tc.name === col.columnName);
            console.log(`📌 Formatting Column: ${col.columnName}, Found Matching:`, matchingColumn);

            return {
                name: col.columnName || "Unnamed Column",
                value: col.value || "",
                type: col.type || matchingColumn?.type || "text",
                isEditable: col.isEditable !== undefined ? col.isEditable : matchingColumn?.isEditable || false,
            };
        });
    });

    console.log("✅ Formatted Table Data:", JSON.stringify(table, null, 2));
};

// const mergeUserTableWithAdmin = (userTableData, adminTable) => {
//     let updatedTable = { ...userTableData };

//     let userColumnNames = new Set(userTableData.columns.map(col => col.name));
//     adminTable.columns.forEach(col => {
//         if (!userColumnNames.has(col.name)) {
//             updatedTable.columns.push({ name: col.name, type: col.type || "text", isEditable: false });
//         }
//     });

//     let userRowsById = new Map(userTableData.data.map(row => [row._id, row]));
//     updatedTable.data = adminTable.data.map(adminRow => userRowsById.get(adminRow.id) || adminRow);

//     return updatedTable;
// };

// const checkNewTables = async (userId, sectionId) => {
//     console.log("recive in checkNewTables", userId, sectionId);
//     try {
//         const allTables = await Table.find({ section: sectionId }).lean();
//         console.log("tables in all tables:", allTables);
//         const userSavedTable = await UserTableData.findOne({ user: userId, section: sectionId }).lean();
//         console.log("user saved table under function of tables in all tables:", userSavedTable);
//         if (!userSavedTable) return allTables;
//         return allTables.filter(table => userSavedTable.table && table._id.toString() !== userSavedTable.table.toString());
//     } catch (error) {
//         console.error("❌ Error checking new tables:", error);
//         return [];
//     }
// };

// const formatTableData = (table) => {
//     table.columns = table.columns.map(col => ({ ...col, isEditable: col.isEditable === true }));

//     table.data.forEach(row => {
//         row.columns = row.columns.map(col => {
//             const matchingColumn = table.columns.find(tc => tc.name === col.columnName);
//             return {
//                 name: col.columnName || "Unnamed Column",
//                 value: col.value || "",
//                 type: col.type || matchingColumn?.type || "text",
//                 isEditable: col.isEditable !== undefined ? col.isEditable : matchingColumn?.isEditable || false,
//             };
//         });
//     });
// };


export const saveUserTable = async (req) => {
    try {
        await db();

        const { sectionId, tableId, table } = req.body;
        console.log("Received:", req.body);
        const token = req.cookies?.authToken;

        if (!token) {
            return { status: 401, data: { error: "Unauthorized" } };
        }

        const userId = getUserIdFromToken(token);
        console.log("User (raw):", userId);

        if (!userId || !sectionId || !tableId || !table) {
            return { status: 400, data: { message: "User ID, Section ID, Table ID, and Table Data are required" } };
        }

        console.log("Raw userId:", userId);
        console.log("Raw sectionId:", sectionId);
        console.log("Raw tableId:", tableId);
        console.log("Raw table data:", table);

        const isValidHexString = (str) => {
            return typeof str === 'string' && str.length === 24 && /^[0-9a-fA-F]{24}$/.test(str);
        };

        const userIdStr = String(userId);
        const sectionIdStr = String(sectionId);
        const tableIdStr = String(tableId);

        if (!isValidHexString(userIdStr)) {
            return { status: 400, data: { message: "Invalid userId: must be a 24-character hex string", value: userIdStr } };
        }
        if (!isValidHexString(sectionIdStr)) {
            return { status: 400, data: { message: "Invalid sectionId: must be a 24-character hex string", value: sectionIdStr } };
        }
        if (!isValidHexString(tableIdStr)) {
            return { status: 400, data: { message: "Invalid tableId: must be a 24-character hex string", value: tableIdStr } };
        }

        const userObjectId = new mongoose.Types.ObjectId(userIdStr);
        const sectionObjectId = new mongoose.Types.ObjectId(sectionIdStr);
        const tableObjectId = new mongoose.Types.ObjectId(tableIdStr);
        // Temporary: Using tableId as table reference until frontend sends tableRef
        const tableRefObjectId = new mongoose.Types.ObjectId(tableIdStr);

        console.log("Converted userObjectId:", userObjectId);
        console.log("Converted sectionObjectId:", sectionObjectId);
        console.log("Converted tableObjectId:", tableObjectId);
        console.log("Converted tableRefObjectId (temporary):", tableRefObjectId);

        console.log("Querying UserTableData with:", {
            _id: tableObjectId,
            user: userObjectId,
            section: sectionObjectId
        });
        let existingTable = await UserTableData.findOne({
            _id: tableObjectId,
            user: userObjectId,
            section: sectionObjectId
        });
        console.log("Found existingTable:", existingTable ? "Yes" : "No", existingTable);

        if (!existingTable) {
            const newTableData = {
                _id: tableObjectId,
                user: userObjectId,
                section: sectionObjectId,
                table: tableRefObjectId,
                columns: table.columns || [],
                rowsCount: table.rowsCount !== undefined ? table.rowsCount : 0,
                data: table.data || [],
                tableDescription: table.tableDescription || "",
                totalMarks: table.totalMarks || [],
                maxMarks: table.maxMarks || [],
                percentage: table.percentage || []
            };
            console.log("Creating new UserTableData with:", JSON.stringify(newTableData, null, 2));
            existingTable = new UserTableData(newTableData);
            console.log("New table instance created:", JSON.stringify(existingTable.toObject(), null, 2));
        } else {
            console.log("Updating existing table...");
            existingTable.columns = table.columns || existingTable.columns;
            existingTable.rowsCount = table.rowsCount !== undefined ? table.rowsCount : existingTable.rowsCount;
            existingTable.data = table.data || existingTable.data;
            existingTable.tableDescription = table.tableDescription || existingTable.tableDescription;
            existingTable.totalMarks = table.totalMarks || existingTable.totalMarks;
            existingTable.maxMarks = table.maxMarks || existingTable.maxMarks;
            existingTable.percentage = table.percentage || existingTable.percentage;
            existingTable.table = tableRefObjectId;

            if (Array.isArray(table.data)) {
                console.log("Mapping table.data:", table.data);
                existingTable.data = table.data.map((row) => ({
                    rowNumber: row.rowNumber,
                    columns: row.columns.map((col, colIndex) => ({
                        columnName: table.columns[colIndex]?.name || col.columnName,
                        value: col.value || "",
                        type: col.type || "text",
                        isEditable: table.columns[colIndex]?.isEditable ?? col.isEditable ?? false,
                    })),
                }));
            }
            console.log("Updated existingTable data:", existingTable.data);
        }

        console.log("Saving table...");
        await existingTable.save();
        console.log("Table saved successfully:", existingTable);

        return { status: 200, data: { message: "Table saved successfully", table: existingTable } };
    } catch (error) {
        console.error("Error saving table:", error);
        return { status: 500, data: { message: "Server Error", error: error.message } };
    }
};

function getUserIdFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return String(decoded.userId);
    } catch (error) {
        return null;
    }
}





// export const calcSections = async (req, res) => {
//     console.log("recived!...", req.body);
//     console.log("recived!...", req.query);
//     try {
//         await db();
//         const { category } = req.query;
//         const token = req.cookies?.authToken;

//         if (!token) {
//             return { status: 401, data: { error: "Unauthorized" } };
//         }

//         const userId = getUserIdFromToken(token);
//         console.log("User (raw):", userId);

//         if (!userId || !category) {
//             return { status: 400, data: { message: "User ID, category are required" } };
//         }

//         // Fetch all admin sections for this category
//         const adminSections = await Section.find({ sectionCategory: category });
//         console.log(adminSections);
//         const totalMaxScore = adminSections.reduce(
//             (sum, section) => sum + (section.maxMark || 0),
//             0
//         );
//         console.log("max---", totalMaxScore);
//         const totalSections = adminSections.length;

//         // Fetch all answers from the user
//         const userDatas = await UserTableData.find({ user: userId });
//         console.log('userrrr', userDatas);
//         const totalUserScore = userDatas.reduce(
//             (sum, answer) => sum + (answer.score || 0),
//             0
//         );

//         const sectionsCompleted = userDatas.length;

//         return res.status(200).json({
//             totalMaxScore,
//             totalUserScore,
//             sectionsCompleted,
//             totalSections,
//             avgScore: totalMaxScore
//                 ? Math.round((totalUserScore / totalMaxScore) * 100)
//                 : 0,
//         });
//     } catch (error) {
//         console.error("Error in calcSection:", error);
//         res.status(500).json({ error: "Server Error" });
//     }
// };
// export const calcSections = async (req, res) => {
//     console.log("📥 Received Request Body:", req.body);
//     console.log("📥 Received Query:", req.query);
    
//     try {
//         await db();
//         const { category } = req.query;
//         const token = req.cookies?.authToken;

//         if (!token) {
//             return res.status(401).json({ error: "Unauthorized" });
//         }

//         const userId = getUserIdFromToken(token);
//         console.log("🔐 User ID:", userId);

//         if (!userId || !category) {
//             return res.status(400).json({ message: "User ID and category are required" });
//         }

//         // 🔍 Fetch all sections for this category
//         const adminSections = await Section.find({ sectionCategory: category });
//         const totalSections = adminSections.length;

//         // 📊 Fetch all table data for this user
//         const userDatas = await UserTableData.find({ user: userId });
//         const sectionsCompleted = userDatas.length;

//         // 🔢 Calculate total marks and max marks from user tables
//         let totalUserScore = 0;
//         let totalMaxScore = 0;

//         userDatas.forEach((table) => {
//             const tableTotal = Array.isArray(table.totalMarks) ? Number(table.totalMarks[0] || 0) : 0;
//             const tableMax = Array.isArray(table.maxMarks) ? Number(table.maxMarks[0] || 0) : 0;

//             totalUserScore += tableTotal;
//             totalMaxScore += tableMax;
//         });

//         const avgScore = totalMaxScore
//             ? Math.round((totalUserScore / totalMaxScore) * 100)
//             : 0;

//         return res.status(200).json({
//             totalMaxScore,
//             totalUserScore,
//             sectionsCompleted,
//             totalSections,
//             avgScore, // in percentage
//         });

//     } catch (error) {
//         console.error("❌ Error in calcSections:", error);
//         return res.status(500).json({ error: "Server Error" });
//     }
// };
export const calcSections = async (req, res) => {
    console.log("📥 Received Request Body:", req.body);
    console.log("📥 Received Query:", req.query);

    try {
        await db();
        const { category } = req.query;
        const token = req.cookies?.authToken;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = getUserIdFromToken(token);
        if (!userId || !category) {
            return res.status(400).json({ message: "User ID and category are required" });
        }

        // ✅ Get admin section info for this category
        const adminSections = await Section.find({ sectionCategory: category });
        const totalSections = adminSections.length;

        // Step 1: Find sections for the category
const sections = await Section.find({ sectionCategory: category }).select('_id');
const sectionIds = sections.map((s) => s._id);

// Step 2: Find tables linked to those sections
const adminTable = await Table.find({ section: { $in: sectionIds } });

// Step 3: Calculate total max marks from tables
const totalMaxScore = adminTable.reduce((sum, table) => {
    const tableMax = Array.isArray(table.maxMarks)
        ? table.maxMarks.reduce((acc, val) => acc + (Number(val) || 0), 0)
        : 0;
    return sum + tableMax;
}, 0);


        // ✅ Get user data (saved tables)
        const userDatas = await UserTableData.find({ user: userId });
        const sectionsCompleted = userDatas.length;

        // 🧮 Total user score from saved tables
        let totalUserScore = 0;

        userDatas.forEach((table) => {
            const tableTotal = Array.isArray(table.totalMarks)
                ? Number(table.totalMarks[0] || 0)
                : 0;
            totalUserScore += tableTotal;
        });

        // 📊 Calculate percentage
        const avgScore = totalMaxScore
            ? Math.round((totalUserScore / totalMaxScore) * 100)
            : 0;

        return res.status(200).json({
            totalMaxScore,         // from admin section
            totalUserScore,        // from saved user tables
            sectionsCompleted,
            totalSections,
            avgScore,
        });

    } catch (error) {
        console.error("❌ Error in calcSections:", error);
        return res.status(500).json({ error: "Server Error" });
    }
};

// export const saveUserTable = async (req) => {
//     try {
//         await db(); // Ensure DB connection

//         const { sectionId, table } = req.body; // Expect user & section to find/create the table
//         console.log("recived:", req.body);
//         const token = req.cookies?.authToken;

//         if (!token) {
//             return { status: 401, data: { error: "Unauthorized" } };
//         }

//         const userId = getUserIdFromToken(token);
//         console.log("user:", userId);

//         if (!userId || !sectionId || !table) {
//             return { status: 400, data: { message: "User ID, Section ID, and Table Data are required" } };
//         }

//         let existingTable = await UserTableData.findOne({ user: userId, section: sectionId });

//         if (!existingTable) {
//             // If no table exists, create a new one
//             existingTable = new UserTableData({
//                 user: userId,
//                 section: sectionId,
//                 table: table.tableId,
//                 columns: table.columns,
//                 rowsCount: table.rowsCount || 0,
//                 data: table.data || [],
//                 tableDescription: table.tableDescription || "",
//                 totalMarks: [],
//                 maxMarks: [],
//                 percentage: [],
//             });
//         } else {
//             // If table exists, update it
//             existingTable.columns = table.columns;
//             existingTable.rowsCount = table.rowsCount;

//             if (Array.isArray(table.data)) {
//                 existingTable.data = table.data.map((row) => ({
//                     rowNumber: row.rowNumber,
//                     columns: row.columns.map((col, colIndex) => ({
//                         columnName: table.columns[colIndex]?.name,
//                         value: col.value || "",
//                         type: col.type || "text",
//                         isEditable: table.columns[colIndex]?.isEditable ?? false,
//                     })),
//                 }));
//             }
//         }

//         await existingTable.save();

//         return { status: 200, data: { message: "Table saved successfully", table: existingTable } };
//     } catch (error) {
//         console.error("Error saving table:", error);
//         return { status: 500, data: { message: "Server Error", error: error.message } };
//     }
// };



// function getUserIdFromToken(token) {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         return decoded.userId;
//     } catch (error) {
//         return null;
//     }
// }



// export async function saveUserTable(req, res) {
//     await db(); // Ensure DB connection
//     console.log("📥 Incoming Request Body:", req.body);

//     const token = req.cookies?.authToken;
//     if (!token) return res.status(401).json({ error: "Unauthorized" });

//     try {
//         const userId = getUserIdFromToken(token); // Extract user ID from token
//         const { sectionId, tableId, data: rawData } = req.body;

//         if (!userId || !sectionId || !tableId || typeof rawData !== "object") {
//             return res.status(400).json({ error: "Invalid or missing data." });
//         }

//         // ✅ Convert raw data into a structured format
//         const formattedData = parseTableData(rawData);

//         // 🔍 Find existing user table entry
//         let userTable = await UserTableData.findOne({ user: userId, table: tableId });

//         if (userTable) {
//             userTable.data = formattedData;
//             userTable.rowsCount = formattedData.length; // Update rows count
//             userTable.updatedAt = new Date();
//         } else {
//             userTable = new UserTableData({
//                 user: userId,
//                 section: sectionId,
//                 table: tableId,
//                 rowsCount: formattedData.length,
//                 data: formattedData,
//             });
//         }

//         await userTable.save();
//         return res.status(200).json({ message: "Table data saved successfully!", userTable });
//     } catch (error) {
//         console.error("❌ Error saving user table:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }
// function getUserIdFromToken(token) {
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         return decoded.userId;
//     } catch (error) {
//         return null;
//     }
// }
// function parseTableData(rawData) {
//     const parsedData = [];

//     Object.keys(rawData).forEach((key) => {
//         const match = key.match(/^data\[(\d+)]\[columns]\[(\d+)]\[value]$/);
//         if (match) {
//             const rowIndex = Number(match[1]);
//             const colIndex = Number(match[2]);

//             if (!parsedData[rowIndex]) parsedData[rowIndex] = { rowNumber: rowIndex + 1, columns: [] };

//             parsedData[rowIndex].columns[colIndex] = {
//                 columnName: `Column ${colIndex + 1}`,
//                 value: rawData[key] || "",
//                 type: "text",
//                 isEditable: true, // Adjust if needed
//             };
//         }
//     });

//     return parsedData;
// }

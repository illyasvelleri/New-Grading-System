import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import User from "@/models/User";
import Section from "@/models/Section";
import Table from "@/models/Table";
import UserTableData from "@/models/UserTableData";

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
    const { username, email, password } = req.body;
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
        const newUser = await User.create({ username, email, password: hashedPassword });
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

    const { email, password } = req.body;

    const user = await User.findOne({ email });
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

        const sections = await Section.find();
        if (!sections.length) return res.status(404).json({ error: "No Sections Found" });

        res.status(200).json({ sections });
    } catch (error) {
        console.error("Error fetching sections:", error);
        res.status(500).json({ error: "Failed to fetch sections" });
    }
};


export const viewSection = async (req, res) => {
    await db();

    // 🔐 Extract JWT token from cookies
    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // 🔑 Verify JWT and get user ID
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        console.log("👤 Authenticated User ID:", userId);

        const { id } = req.query; // Section ID from URL
        console.log("📌 Section ID:", id);

        const section = await Section.findById(id);
        if (!section) {
            return res.status(404).json({ error: "Section Not Found" });
        }

        let userTableData = await UserTableData.findOne({ section: section._id, user: userId }).populate("user").lean();
        let tables = [];

        if (userTableData) {
            let adminTable = await Table.findById(section._id).populate("section").lean();
            if (adminTable) {
                userTableData = mergeUserTableWithAdmin(userTableData, adminTable);
            }
            formatTableData(userTableData);
            tables.push(userTableData);
        }

        let newTables = await checkNewTables(userId, section._id);
        newTables.forEach(formatTableData);
        tables.push(...newTables);

        if (!tables.length) {
            return res.status(404).json({ error: "No tables available for this section." });
        }

        res.status(200).json({ section, tables });
    } catch (err) {
        console.error("❌ Error in viewSection:", err);
        res.status(401).json({ error: "Invalid or Expired Token" });
    }
};

const mergeUserTableWithAdmin = (userTableData, adminTable) => {
    let updatedTable = { ...userTableData };

    let userColumnNames = new Set(userTableData.columns.map(col => col.name));
    adminTable.columns.forEach(col => {
        if (!userColumnNames.has(col.name)) {
            updatedTable.columns.push({ name: col.name, type: col.type || "text", isEditable: false });
        }
    });

    let userRowsById = new Map(userTableData.data.map(row => [row.id, row]));
    updatedTable.data = adminTable.data.map(adminRow => userRowsById.get(adminRow.id) || adminRow);

    return updatedTable;
};

const checkNewTables = async (userId, sectionId) => {
    try {
        const allTables = await Table.find({ section: sectionId }).lean();
        const userSavedTable = await UserTableData.findOne({ user: userId, section: sectionId }).lean();

        if (!userSavedTable) return allTables;
        return allTables.filter(table => table._id.toString() !== userSavedTable.table.toString());
    } catch (error) {
        console.error("❌ Error checking new tables:", error);
        return [];
    }
};

const formatTableData = (table) => {
    table.columns = table.columns.map(col => ({ ...col, isEditable: col.isEditable === true }));

    table.data.forEach(row => {
        row.columns = row.columns.map(col => {
            const matchingColumn = table.columns.find(tc => tc.name === col.columnName);
            return {
                name: col.columnName || "Unnamed Column",
                value: col.value || "",
                type: col.type || matchingColumn?.type || "text",
                isEditable: col.isEditable !== undefined ? col.isEditable : matchingColumn?.isEditable || false,
            };
        });
    });
};


// export async function saveUserTable(req, res) {
//     await db(); // Ensure DB connection
//     console.log("📥 Incoming Request Body:", req.body);

//     // 🔐 Extract JWT token from cookies
//     const token = req.cookies?.authToken;
//     if (!token) return res.status(401).json({ error: "Unauthorized" });

//     try {
//         // 🔑 Decode JWT token to get user ID
//         const decoded = jwt.verify(token, JWT_SECRET);
//         const userId = decoded.userId;
//         console.log("👤 Authenticated User ID:", userId);

//         // Extract request body data
//         const { sectionId, tableId, data } = req.body;

//         if (!sectionId || !tableId || !data) {
//             console.error("❌ Missing required fields:", { userId, sectionId, tableId, data });
//             return res.status(400).json({ error: "Missing required fields." });
//         }

//         // ✅ Extract unique column structure
//         const columns = data?.[0]?.columns.map(col => ({
//             name: col.name,
//             type: col.type || "text",
//             isEditable: col.isEditable === "true",
//         })) || [];

//         // ✅ Format and structure the data
//         const formattedData = data.map((row, rowIndex) => ({
//             rowNumber: rowIndex + 1,
//             columns: row.columns.map((col) => {
//                 // 🔹 Match column by name and ensure boolean conversion for isEditable
//                 const columnConfig = columns.find(c => c.name === col.name);

//                 return {
//                     columnName: col.name,
//                     value: col.value || col.radioValue || "",
//                     type: col.type || "text",
//                     isEditable: columnConfig ? !!columnConfig.isEditable : false,  // ✅ Convert to boolean
//                 };
//             }),
//         }));

//         console.log("📝 Formatted Data:", JSON.stringify(formattedData, null, 2));

//         // 📝 Count rows in formatted data
//         const rowsCount = formattedData.length;
//         console.log("📊 Rows Count:", rowsCount);

//         // 🔄 Check if the user already has data for this table
//         let userTable = await UserTableData.findOne({ user: userId, table: tableId });

//         if (userTable) {
//             // 🆙 Update existing table data
//             userTable.data = formattedData;
//             userTable.rowsCount = rowsCount;
//             userTable.updatedAt = new Date();
//             await userTable.save();
//             console.log("✅ Table data updated successfully.");
//         } else {
//             // 🆕 Create new table entry
//             userTable = new UserTableData({
//                 user: userId,
//                 section: sectionId,
//                 table: tableId,
//                 rowsCount,
//                 data: formattedData,
//             });
//             await userTable.save();
//             console.log("✅ New table data saved successfully.");
//         }

//         return res.status(200).json({ message: "Table data saved successfully!", userTable });
//     } catch (error) {
//         console.error("❌ Error saving user table:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }


// export async function saveUserTable(req, res) {
//     await db(); // Ensure DB connection
//     console.log("📥 Incoming Request Body:", req.body);

//     const token = req.cookies?.authToken;
//     if (!token) return res.status(401).json({ error: "Unauthorized" });

//     try {
//         // 🔑 Decode JWT token to get user ID
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.userId;
//         console.log("👤 Authenticated User ID:", userId);

//         // Extract request body data
//         const { sectionId, tableId, data } = req.body;

//         if (!sectionId || !tableId || !data || !Array.isArray(data)) {
//             console.error("❌ Invalid data format:", { userId, sectionId, tableId, data });
//             return res.status(400).json({ error: "Invalid or missing data." });
//         }

//         // 🔍 Check if user already has this table data
//         let userTable = await UserTableData.findOne({ userId, tableId });

//         if (userTable) {
//             // 🆙 Update existing table data
//             userTable.data = data.map((row, rowIndex) => ({
//                 rowNumber: row.rowNumber,
//                 columns: row.columns.map((col, colIndex) => ({
//                     columnName: userTable.columns[colIndex]?.name,
//                     value: col.value || "",
//                     type: col.type || "text",
//                     isEditable: userTable.columns[colIndex]?.isEditable ?? false,
//                 })),
//             }));
//             userTable.updatedAt = new Date();
//             await userTable.save();
//             console.log("✅ Table data updated successfully.");
//         } else {
//             // 🆕 Create new table entry
//             userTable = new UserTableData({
//                 userId,
//                 sectionId,
//                 tableId,
//                 columns: data[0]?.columns || [], // Ensure columns exist
//                 data: data.map((row, rowIndex) => ({
//                     rowNumber: rowIndex + 1,
//                     columns: row.columns.map((col, colIndex) => ({
//                         columnName: data[0]?.columns[colIndex]?.name,
//                         value: col.value || "",
//                         type: col.type || "text",
//                         isEditable: data[0]?.columns[colIndex]?.isEditable ?? false,
//                     })),
//                 })),
//             });
//             await userTable.save();
//             console.log("✅ New table data saved successfully.");
//         }

//         return res.status(200).json({ message: "Table data saved successfully!", userTable });
//     } catch (error) {
//         console.error("❌ Error saving user table:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// }


export async function saveUserTable(req, res) {
    await db(); // Ensure DB connection
    console.log("📥 Incoming Request Body:", req.body);

    const token = req.cookies?.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const userId = getUserIdFromToken(token); // Extract user ID from token
        const { sectionId, tableId, data: rawData } = req.body;

        if (!userId || !sectionId || !tableId || typeof rawData !== "object") {
            return res.status(400).json({ error: "Invalid or missing data." });
        }

        // ✅ Convert raw data into a structured format
        const formattedData = parseTableData(rawData);

        // 🔍 Find existing user table entry
        let userTable = await UserTableData.findOne({ user: userId, table: tableId });

        if (userTable) {
            userTable.data = formattedData;
            userTable.rowsCount = formattedData.length; // Update rows count
            userTable.updatedAt = new Date();
        } else {
            userTable = new UserTableData({
                user: userId,
                section: sectionId,
                table: tableId,
                rowsCount: formattedData.length,
                data: formattedData,
            });
        }

        await userTable.save();
        return res.status(200).json({ message: "Table data saved successfully!", userTable });
    } catch (error) {
        console.error("❌ Error saving user table:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
function getUserIdFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        return null;
    }
}
function parseTableData(rawData) {
    const parsedData = [];

    Object.keys(rawData).forEach((key) => {
        const match = key.match(/^data\[(\d+)]\[columns]\[(\d+)]\[value]$/);
        if (match) {
            const rowIndex = Number(match[1]);
            const colIndex = Number(match[2]);

            if (!parsedData[rowIndex]) parsedData[rowIndex] = { rowNumber: rowIndex + 1, columns: [] };

            parsedData[rowIndex].columns[colIndex] = {
                columnName: `Column ${colIndex + 1}`,
                value: rawData[key] || "",
                type: "text",
                isEditable: true, // Adjust if needed
            };
        }
    });

    return parsedData;
}

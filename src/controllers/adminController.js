import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import db from "@/lib/db";
import Admin from "@/models/Admin";
import Section from "@/models/Section";
import Table from "@/models/Table"; // Assuming you have a Table model
import UserTableData from "@/models/UserTableData";
import User from "@/models/User";
import mongoose from "mongoose";


// Admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Compare with environment variables
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        // Generate JWT token
        const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set token in HTTP-only cookie
        res.setHeader(
            "Set-Cookie",
            cookie.serialize("authToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            })
        );

        res.status(200).json({ message: "Login Successful", admin: { email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};

// Admin Logout
export const logoutAdmin = (req, res) => {
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("authToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(0),
        })
    );

    res.status(200).json({ message: "Logout Successful" });
};


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

// Create Section
export const createSection = async (req, res) => {
    try {
        await db();
        const { number, name, sectionCategory } = req.body;
        const newSection = new Section({ number, name, sectionCategory });
        await newSection.save();
        res.status(201).json({ message: "Section Created Successfully", section: newSection });
    } catch (error) {
        res.status(500).json({ error: "Failed to create section" });
    }
};

// Delete Section
export const deleteSection = async (req, res) => {
    try {
        await db();
        await Section.findByIdAndDelete(req.query.id);
        res.status(200).json({ message: "Section Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete section" });
    }
};

// View Section (Fetch by ID)
export const viewSection = async (req, res) => {
    try {
        await db();
        const section = await Section.findById(req.query.id);
        if (!section) return res.status(404).json({ error: "Section Not Found" });

        const tables = await Table.find({ section: section._id }).populate("section");
        res.status(200).json({ section, tables });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch section" });
    }
};

//create table

// export const createTable = async (req, res) => {
//     try {
//         console.log("Incoming Request Body:", req.body); // Debugging Log
//         const { sectionId, tableName, columnsCount, rowsCount, columnData } = req.body;

//         if (!sectionId || sectionId.trim() === "") {
//             return res.status(400).json({ message: "Section ID is required" });
//         }

//         const section = await Section.findById(sectionId);
//         if (!section) {
//             return res.status(404).send('Section Not Found');
//         }

//         // Create columns array
//         let columns = [];
//         for (let i = 0; i < columnsCount; i++) {
//             columns.push({
//                 name: req.body[`columnName${i}`],
//                 type: req.body[`columnType${i}`],
//                 isEditable: req.body[`isEditable${i}`] === 'on' ? true : false
//             });
//         }

//         // Create table
//         const table = new Table({
//             section: sectionId,
//             tableName,
//             columns,
//             rowsCount,
//             columnData: [] // Initialize the data array
//         });

//         // Populate data array with rows and columns
//         for (let i = 1; i <= rowsCount; i++) {
//             const row = {
//                 rowNumber: i,
//                 columns: columns.map((col) => ({
//                     columnName: col.name,
//                     value: "", // Initialize with empty value
//                     type: col.type, // Add the column type to each column
//                     isEditable: col.isEditable
//                 }))
//             };
//             table.data.push(row); // Add the row to the data array
//         }

//         await table.save();
//         res.status(201).json({ message: "Table Created Successfully", table });
//     } catch (error) {
//         console.error("Error creating table:", error);
//         res.status(500).json({ error: "Failed to create table" });
//     }
// };

export const createTable = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { sectionId, tableName, columns, rowsCount } = req.body;

        if (!sectionId || sectionId.trim() === "") {
            return res.status(400).json({ message: "Section ID is required" });
        }

        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section Not Found" });
        }

        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            return res.status(400).json({ message: "Columns data is required" });
        }
        // Create table
        const table = new Table({
            section: sectionId,
            tableName,
            columns,
            rowsCount: Number(rowsCount),
            data: []
        });

        // Populate data array with rows and columns
        for (let i = 1; i <= table.rowsCount; i++) {
            const row = {
                rowNumber: i,
                columns: columns.map((col) => ({
                    columnName: col.name,
                    value: "",
                    type: col.type,
                    isEditable: col.isEditable
                }))
            };
            table.data.push(row);
        }

        await table.save();
        return res.status(201).json({ message: "Table created successfully", table });
    } catch (error) {
        console.error("Error creating table:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const viewTables = async (sectionId) => {
    try {

        await db(); // Ensure database connection

        if (!sectionId) {
            throw new Error("Missing section ID.");
        }

        const tables = await Table.find({ section: sectionId });

        return tables; // Return data, don't use `res.status()`
    } catch (error) {
        console.error("❌ Error fetching tables:", error);
        throw new Error("Database query failed");
    }
};


export const deleteTable = async (req, res) => {
    try {
        const { id } = req.query; // The table ID to delete
        if (!id) {
            return res.status(400).json({ error: "Missing table ID" });
        }

        // Find and delete the table by ID
        const table = await Table.findByIdAndDelete(id);

        if (!table) {
            return res.status(404).json({ error: "Table not found" });
        }

        return res.status(200).json({ message: "Table deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete table" });
    }
};


export const getEditableTable = async (req, res) => {
    try {
        await db(); // Ensure database connection

        console.log("Received ID:", req.query.id);
        console.log("Type of ID:", typeof req.query.id);

        if (!req.query.id) {
            return res.status(400).json({ error: "Missing Table ID." });
        }

        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            return res.status(400).json({ error: "Invalid Table ID format." });
        }
        const table = await Table.findOne({ _id: req.query.id }).populate('section');
        console.log("Found Table:", table);

        if (!table) {
            return res.status(404).json({ error: "Table not found." });
        }

        return res.status(200).json({ table });
    } catch (error) {
        console.error("❌ Error fetching table:", error);
        return res.status(500).json({ error: "Database query failed" });
    }
};


export const updateTable = async (req, res) => {
    try {
        const { id } = req.query;
        const { table } = req.body;
        console.log(req.body);
        if (!id || !table) {
            return res.status(400).json({ message: "Table ID and Data are required" });
        }

        const existingTable = await Table.findById(id);
        if (!existingTable) {
            return res.status(404).json({ message: "Table not found" });
        }

        // Update table properties
        existingTable.tableName = table.tableName;
        existingTable.columns = table.columns;

        // ✅ Ensure each cell respects the column's `isEditable`
        if (Array.isArray(table.data)) {
            existingTable.data = table.data.map((row, rowIndex) => ({
                rowNumber: row.rowNumber,
                columns: row.columns.map((col, colIndex) => ({
                    columnName: table.columns[colIndex]?.name,
                    value: col.value || "",
                    type: col.type || "text",
                    isEditable: table.columns[colIndex]?.isEditable ?? false, // Ensuring correct editability
                })),
            }));
        }

        await existingTable.save();
        return res.status(200).json({ message: "Table updated successfully", table: existingTable });
    } catch (error) {
        console.error("Error updating table:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const getAllUsers = async (req, res) => {
    console.log("get ALL users:", req.body);
    try {
        await db();
        const users = await User.find({}).lean();
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserSections = async (req, res) => {
    const { id } = req.query;
    console.log("user sections:", req.query);
    try {
        const sections = await Section.find();
        res.status(200).json({ sections });
    } catch (err) {
        console.error("Error fetching user sections:", err);
        res.status(500).json({ error: "Failed to fetch user sections" });
    }
};

export const getTablesByUserAndSection = async (req, res) => {
    console.log("user tablessss", req.query)
    try {
        const tables = await UserTableData.find({ section: sectionId, user: userId }).populate("user").lean();
        return tables;
    } catch (error) {
        console.error("Error in getTablesByUserAndSection:", error);
        throw error;
    }
};
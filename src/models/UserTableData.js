const mongoose = require("mongoose");

const UserTableDataSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    columns: [
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: ["text", "radio", "mark", "max-mark", "point", "max-point"], // Column Type
                required: true,
            },
            isEditable: {
                type: Boolean,
                default: false,
            },
        },
    ],
    rowsCount: {
        type: Number,
        required: true,
    },
    data: [
        {
            rowNumber: Number,
            columns: [
                {
                    columnName: String,
                    value: String, // Editable Value Here
                    type: {
                        type: String,
                        enum: ["text", "radio", "mark", "max-mark", "point", "max-point"], // Type Store in Data Also
                    },
                    isEditable: {
                        type: Boolean
                    },
                },
            ],
        },
    ],
    totalMarks: {
        type: [Number],
        default: [], // Automatically Calculate Total Marks
    },
    maxMarks: {
        type: [Number],
        default: [], // Automatically Calculate Max Marks
    },
    percentage: {
        type: [Number],
        default: [], // Automatically Calculate Percentage
    },
    // Points-related fields
    pointTotal: {
        type: [Number],
        default: [],
    },
    maxPointTotal: {
        type: [Number],
        default: [],
    },
    pointPercentage: {
        type: [Number],
        default: [],
    },
    tableDescription: {
        type: String,
        default: ""
    },
},
    {
        timestamps: true,
        collection: "usertabledata"
    }, // Explicitly set the collection name
);

export default mongoose.models.UserTableData || mongoose.model("UserTableData", UserTableDataSchema);
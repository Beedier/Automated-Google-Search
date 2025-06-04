import { promises as fs } from "fs";
import * as XLSX from "xlsx";
import dataConverter, { DataType } from "./dataConverter";

export interface ColumnSchema {
    name: string; // Column header name to extract from Excel sheet
    type: DataType; // Expected data type for that column
}

/**
 * Reads and parses an Excel file asynchronously, extracting only specified columns,
 * converting each column's value to the given data type.
 *
 * @param filePath - Full absolute path to the Excel file (.xlsx or .xls).
 * @param sheetName - The name of the worksheet to extract data from.
 * @param columns - An array of column schemas specifying which columns to extract and their types.
 * @returns A Promise resolving to an array of objects, each containing filtered and typed data per row.
 * @throws Throws error if file does not exist, sheet is missing, or read fails.
 */
export default async function readExcel(
    filePath: string,
    sheetName: string,
    columns: ColumnSchema[],
): Promise<Record<string, string | number | boolean | Date | null>[]> {
    try {
        // Check if the file exists and is accessible
        await fs.access(filePath);

        // Read the file content into a buffer
        const buffer = await fs.readFile(filePath);

        // Parse the buffer as an Excel workbook
        const workbook = XLSX.read(buffer, { type: "buffer" });

        // Select the specified worksheet by name
        const worksheet = workbook.Sheets[sheetName];

        // Throw an error if the sheet does not exist
        if (!worksheet) throw new Error(`Sheet "${sheetName}" not found.`);

        // Convert worksheet data to JSON array of objects
        const jsonData: Record<string, string | number | boolean | null>[] =
            XLSX.utils.sheet_to_json(worksheet);

        // Map each row object to filtered and typed output based on column schema
        return jsonData.map((row) => {
            // Prepare an object to hold filtered and typed column data
            const filtered: Record<
                string,
                string | number | boolean | Date | null
            > = {};

            // Iterate over the columns requested by the user
            for (const col of columns) {
                // Use dataConverter to convert the raw cell value to desired type
                filtered[col.name] = dataConverter(row[col.name], col.type);
            }

            // Return the filtered and typed row object
            return filtered;
        });
    } catch (err) {
        // Wrap and rethrow errors with contextual message
        throw new Error(`Failed to read Excel file: ${err}`);
    }
}

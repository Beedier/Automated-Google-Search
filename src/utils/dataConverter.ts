// Define a strongly typed enum for supported data types
export enum DataType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Date = "date",
}

// Define the set of valid input types that can be passed to the converter
type SupportedInput = string | number | boolean | Date | null | undefined;

/**
 * Converts a given value to a specified data type.
 *
 * This function provides runtime-safe conversion from loose types to specific types,
 * intended to be used anywhere data transformation is needed (e.g., from APIs, user input, Excel, etc.)
 *
 * @param value - The input value (may be of type string, number, boolean, Date, null, or undefined)
 * @param type - The target type to convert the value into, using the DataType enum
 * @returns The converted value in the desired type, or null if conversion fails
 */
export default function dataConverter(
    value: SupportedInput,
    type: DataType,
): string | number | boolean | Date | null {
    // Handle null or undefined early and return null (safe fallback)
    if (value === null || value === undefined) return null;

    // Perform conversion based on the target data type
    switch (type) {
        case DataType.String: {
            // Convert any type to string using built-in String constructor
            return String(value);
        }

        case DataType.Number: {
            // Attempt to convert value to a number
            const num = Number(value);

            // If conversion results in NaN (invalid number), return null
            return isNaN(num) ? null : num;
        }

        case DataType.Boolean: {
            // If already a boolean, return directly
            if (typeof value === "boolean") return value;

            // If string, normalize to lowercase and match common true/false indicators
            if (typeof value === "string") {
                const lower = value.trim().toLowerCase();
                if (["true", "1", "yes"].includes(lower)) return true;
                if (["false", "0", "no"].includes(lower)) return false;
            }

            // If number, treat 0 as false, any non-zero as true
            if (typeof value === "number") return value !== 0;

            // If none of the above, conversion is invalid
            return null;
        }

        case DataType.Date: {
            // If already a Date object, return as is
            if (value instanceof Date) return value;

            // If string or number, attempt to construct a new Date
            if (typeof value === "string" || typeof value === "number") {
                const date = new Date(value);

                // Check for valid date (getTime() returns NaN if invalid)
                return isNaN(date.getTime()) ? null : date;
            }

            // If type not suitable for date conversion, return null
            return null;
        }

        default: {
            // In case of unknown type (should never occur with enum), return null
            return null;
        }
    }
}

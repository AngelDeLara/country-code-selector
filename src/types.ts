/**
 * Enum: CountryFields
 * 
 * This enum defines the keys used to access properties of a Country object.
 */
export enum CountryFields {
  ID = 'id',                   // Unique identifier for the country
  NAME = 'name',               // Name of the country
  CALLING_CODE = 'calling_code', // International calling code for the country
  PHONE_LENGTH = 'phone_length'  // Length of the phone number in the country
}

/**
 * Interface: Country
 * 
 * This interface represents the structure of a Country object, containing 
 * essential information about a country.
 */
export interface Country {
  [CountryFields.ID]: string;              // The unique identifier for the country
  [CountryFields.NAME]: string;            // The name of the country
  [CountryFields.CALLING_CODE]: string;    // The international calling code
  [CountryFields.PHONE_LENGTH]: string;     // The standard length of phone numbers
}

/**
 * Interface: CountryWithISO
 * 
 * This interface extends the Country interface by adding an additional 
 * property for the ISO code of the country.
 */
export interface CountryWithISO extends Country {
  iso: string;  // ISO code representing the country
}

/**
 * Type Guard: isCountry
 * 
 * This function checks if a given value is a Country object. It ensures 
 * that the value has the required properties defined in the Country interface.
 * 
 * @param {unknown} value - The value to check.
 * @returns {value is Country} - Returns true if the value is a valid Country object, otherwise false.
 */
export function isCountry(value: unknown): value is Country {
  return (
    typeof value === 'object' &&
    value !== null &&
    CountryFields.ID in value &&
    CountryFields.NAME in value &&
    CountryFields.CALLING_CODE in value &&
    CountryFields.PHONE_LENGTH in value
  );
}

import { useState, useMemo, useCallback } from 'react';
import { CountryWithISO } from '../types';

/**
 * usePhoneForm is a custom React hook that manages the state and logic 
 * for a phone number input form, including formatting, validation, and 
 * country selection.
 * 
 * @returns {Object} - An object containing phone form state and handlers:
 * - selectedCountry: The currently selected country object.
 * - phoneNumber: The formatted phone number input by the user.
 * - placeholderMask: The placeholder mask for the phone number input.
 * - handlePhoneChange: Handler function for phone number input changes.
 * - handleCountryChange: Handler function for country selection changes.
 * - isSubmitDisabled: Boolean indicating if the submit button should be disabled.
 * - error: Error message related to phone number validation.
 */
export const usePhoneForm = () => {
  // State for storing the selected country, phone number, and validation error.
  const [selectedCountry, setSelectedCountry] = useState<CountryWithISO | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  /**
   * Formats the phone number based on user input and the selected country's 
   * phone number length.
   * 
   * @param {string} value - The raw input value from the phone number field.
   * @param {number} phoneLength - The required length of the phone number.
   * @returns {string} - The formatted phone number string.
   */
  const formatPhoneNumber = useCallback((value: string, phoneLength: number) => {
    const digits = value.replace(/\D/g, ""); // Remove non-digit characters
    let formatted = "";

    // Format based on the length of the digits
    if (digits.length <= 3) {
      formatted = `(${digits}`; // Initial area code
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`; // Area code + first part of the number
    } else {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, phoneLength)}`; // Full formatting
    }

    return formatted; // Return formatted phone number
  }, []);

  /**
   * Generates a placeholder mask for the phone number input based on the 
   * selected country's phone number length.
   * 
   * @returns {string} - The placeholder mask string.
   */
  const placeholderMask = useMemo(() => {
    if (!selectedCountry) return "(000) 000-0000"; // Default placeholder
    const length = parseInt(selectedCountry.phone_length, 10);
    return `(${"0".repeat(3)}) ${"0".repeat(3)}-${"0".repeat(Math.max(0, length - 6))}`; // Dynamic placeholder
  }, [selectedCountry]);

  /**
   * Handles changes to the phone number input, updating the state and 
   * validating the input.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event 
   * from the phone number input.
   */
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Extract digits
    if (!selectedCountry) return;

    const phoneLength = parseInt(selectedCountry.phone_length, 10);
    const formatted = formatPhoneNumber(inputValue, phoneLength);
    setPhoneNumber(formatted); // Update formatted phone number

    // Validate phone number length
    if (inputValue.length !== phoneLength) {
      setError(`Phone number must be ${phoneLength} digits long.`); // Set error if length is incorrect
    } else {
      setError(null); // Clear error if valid
    }
  }, [selectedCountry, formatPhoneNumber]);

  /**
   * Updates the selected country and resets phone number and error state 
   * when the user selects a new country.
   * 
   * @param {CountryWithISO} country - The newly selected country object.
   */
  const handleCountryChange = useCallback((country: CountryWithISO) => {
    setSelectedCountry(country); // Update selected country
    setPhoneNumber(""); // Reset phone number
    setError(null); // Clear any existing errors
  }, []);

  /**
   * Determines if the submit button should be disabled based on the 
   * selected country and the current phone number length.
   * 
   * @returns {boolean} - True if the submit button should be disabled, 
   * false otherwise.
   */
  const isSubmitDisabled = useMemo(() => {
    if (!selectedCountry) return true; // Disable if no country is selected
    const requiredLength = parseInt(selectedCountry.phone_length, 10);
    const currentLength = phoneNumber.replace(/\D/g, "").length; // Count actual digits
    return currentLength < requiredLength; // Disable if length is insufficient
  }, [selectedCountry, phoneNumber]);

  // Return the state and handlers for use in components.
  return {
    selectedCountry,
    phoneNumber,
    placeholderMask,
    handlePhoneChange,
    handleCountryChange,
    isSubmitDisabled,
    error,
  };
};
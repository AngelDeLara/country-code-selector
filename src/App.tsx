import React, { useState, useMemo, useCallback, Suspense, lazy } from "react";
import axios from "axios";
import { useAccessToken, useCountries } from "./hooks/useApi";
import { CountryWithISO } from "./types";
import ErrorNotification from "./components/ErrorNotification";
import "./App.css";

const CountrySelector = lazy(() => import("./components/CountrySelector"));

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * App Component
 * 
 * The App component serves as the main entry point for the Country Code Selector application.
 * It handles the user interface for entering phone numbers with country-specific formatting,
 * manages API interactions for fetching country data, and initiates two-factor authentication.
 * 
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryWithISO | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const { accessToken, error: accessTokenError } = useAccessToken();
  const { countries, error: countriesError } = useCountries(accessToken);

  /**
   * Formats the phone number based on user input and the selected country's phone length.
   *
   * @function formatPhoneNumber
   * @param {string} value - The raw input value from the user.
   * @param {number} phoneLength - The expected phone number length for the selected country.
   * @returns {string} The formatted phone number with appropriate formatting.
   */
  const formatPhoneNumber = useCallback((value: string, phoneLength: number) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";

    // Format based on the number of digits entered
    if (digits.length <= 3) {
      formatted = `(${digits}`;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, phoneLength)}`;
    }

    return formatted;
  }, []);

  /**
   * Generates a placeholder mask for the phone input field based on the selected country's phone length.
   * 
   * @type {string}
   * @returns {string} The placeholder mask for the phone input.
   */
  const placeholderMask = useMemo(() => {
    if (!selectedCountry) return "(000) 000-0000";
    const length = parseInt(selectedCountry.phone_length, 10);
    return `(${"0".repeat(3)}) ${"0".repeat(3)}-${"0".repeat(Math.max(0, length - 6))}`;
  }, [selectedCountry]);

  /**
   * Handles changes in the phone number input, applying formatting as the user types.
   *
   * @function handlePhoneChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
   */
  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (!selectedCountry) return;

    const phoneLength = parseInt(selectedCountry.phone_length, 10);
    const formatted = formatPhoneNumber(inputValue, phoneLength);
    setPhoneNumber(formatted);
  }, [selectedCountry, formatPhoneNumber]);

  /**
   * Updates the selected country and resets the phone number input when the user selects a new country.
   *
   * @function handleCountryChange
   * @param {CountryWithISO} country - The newly selected country object.
   */
  const handleCountryChange = useCallback((country: CountryWithISO) => {
    setSelectedCountry(country);
    setPhoneNumber("");
  }, []);

  /**
   * Handles the form submission for initiating two-factor authentication.
   *
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry && accessToken) {
      try {
        await axios.post(
          `${API_BASE_URL}/challenges/two_factor_auth`,
          {
            phone_number: phoneNumber.replace(/\D/g, ""),
            country_id: selectedCountry.id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        alert("Two-factor authentication initiated successfully!");
      } catch (error) {
        console.error("Error submitting phone number:", error);
        alert("An error occurred while submitting the phone number.");
      }
    }
  }, [selectedCountry, accessToken, phoneNumber]);

  /**
   * Determines if the submit button should be disabled based on the length of the phone number input.
   * 
   * @type {boolean}
   * @returns {boolean} True if the submit button should be disabled, otherwise false.
   */
  const isSubmitDisabled = useMemo(() => {
    if (!selectedCountry) return true;
    const requiredLength = parseInt(selectedCountry.phone_length, 10);
    const currentLength = phoneNumber.replace(/\D/g, "").length;
    return currentLength < requiredLength;
  }, [selectedCountry, phoneNumber]);

  // Handle error states for access token and country data retrieval
  if (accessTokenError || countriesError) {
    return <ErrorNotification message={(accessTokenError || countriesError) ?? ''} />;
  }

  return (
    <div className="App">
      <h1>Phone Number Input</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="phone-input-container">
            <Suspense fallback={<div>Loading country selector...</div>}>
              <CountrySelector
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={handleCountryChange}
              />
            </Suspense>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={placeholderMask}
              className="phone-input"
              maxLength={selectedCountry ? parseInt(selectedCountry.phone_length, 10) + 4 : 14}
            />
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
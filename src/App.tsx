import React, { useState, useEffect, useMemo, Suspense, lazy } from "react";
import axios from "axios";
import "./App.css";

const CountrySelector = lazy(() => import("./components/CountrySelector"));

function isCountry(value: unknown): value is Country {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'calling_code' in value &&
    'phone_length' in value
  );
}

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
}

interface CountryWithISO extends Country {
  iso: string;
}

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

/**
 * App Component
 * 
 * This component serves as the main entry point for the Country Code Selector application.
 * It manages the state for countries, selected country, phone number input, and handles 
 * API interactions for fetching country data and submitting phone numbers for two-factor authentication.
 * 
 * @component
 */
const App: React.FC = () => {
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryWithISO | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");

  /**
   * Fetches the access token from the API.
   * 
   * @async
   * @function fetchAccessToken
   */
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/access_token?corporate_id=10`,
          {},
          {
            headers: {
              "Api-Key": API_KEY,
            },
          }
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  /**
   * Fetches the list of countries from the API once the access token is available.
   * 
   * @async
   * @function fetchCountries
   */
  useEffect(() => {
    const fetchCountries = async () => {
      if (!accessToken) return;
  
      try {
        const response = await axios.get<Record<string, Country>>(`${API_BASE_URL}/challenges/countries`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCountries(response.data);
        
        const entries = Object.entries(response.data);
        if (entries.length > 0) {
          const [iso, country] = entries[0];
          if (isCountry(country)) {
            setSelectedCountry({ ...country, iso });
          }
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
  
    fetchCountries();
  }, [accessToken]);

  /**
   * Formats the phone number based on the input value and the selected country's phone length.
   * 
   * @function formatPhoneNumber
   * @param {string} value - The raw input value
   * @param {number} phoneLength - The expected phone number length for the selected country
   * @returns {string} The formatted phone number
   */
  const formatPhoneNumber = (value: string, phoneLength: number) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    
    if (digits.length <= 3) {
      formatted = `(${digits}`;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, phoneLength)}`;
    }

    return formatted;
  };

  /**
   * Generates a placeholder mask for the phone input based on the selected country's phone length.
   * 
   * @type {string}
   */
  const placeholderMask = useMemo(() => {
    if (!selectedCountry) return "(000) 000-0000";
    const length = parseInt(selectedCountry.phone_length, 10);
    return `(${"0".repeat(3)}) ${"0".repeat(3)}-${"0".repeat(Math.max(0, length - 6))}`;
  }, [selectedCountry]);

  /**
   * Handles changes in the phone number input, formatting the input as the user types.
   * 
   * @function handlePhoneChange
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (!selectedCountry) return;
    
    const phoneLength = parseInt(selectedCountry.phone_length, 10);
    const formatted = formatPhoneNumber(inputValue, phoneLength);
    setPhoneNumber(formatted);
  };

  /**
   * Updates the selected country and resets the phone number input.
   * 
   * @function handleCountryChange
   * @param {CountryWithISO} country - The newly selected country
   */
  const handleCountryChange = (country: CountryWithISO) => {
    setSelectedCountry(country);
    setPhoneNumber("");
  };

  /**
   * Handles the form submission, initiating the two-factor authentication process.
   * 
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  /**
   * Determines if the submit button should be disabled based on the phone number length.
   * 
   * @type {boolean}
   */
  const isSubmitDisabled = useMemo(() => {
    if (!selectedCountry) return true;
    const requiredLength = parseInt(selectedCountry.phone_length, 10);
    const currentLength = phoneNumber.replace(/\D/g, "").length;
    return currentLength < requiredLength;
  }, [selectedCountry, phoneNumber]);

  console.log('isSubmitDisabled', isSubmitDisabled)

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
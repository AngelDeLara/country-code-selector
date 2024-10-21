import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CountrySelector from "./components/CountrySelector";
import "./App.css";

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

const API_KEY = process.env.REACT_APP_API_KEY;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log('API_KEY', API_KEY)

const App: React.FC = () => {
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryWithISO | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");

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

  const placeholderMask = useMemo(() => {
    if (!selectedCountry) return "(000) 000-0000";
    const length = parseInt(selectedCountry.phone_length, 10);
    return `(${"0".repeat(3)}) ${"0".repeat(3)}-${"0".repeat(Math.max(0, length - 6))}`;
  }, [selectedCountry]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    if (!selectedCountry) return;
    
    const phoneLength = parseInt(selectedCountry.phone_length, 10);
    const formatted = formatPhoneNumber(inputValue, phoneLength);
    setPhoneNumber(formatted);
  };

  const handleCountryChange = (country: CountryWithISO) => {
    setSelectedCountry(country);
    setPhoneNumber("");
  };

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

  return (
    <div className="App">
      <h1>Phone Number Input</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="phone-input-container">
            <CountrySelector
              countries={countries}
              selectedCountry={selectedCountry}
              onSelectCountry={handleCountryChange}
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={placeholderMask}
              className="phone-input"
              maxLength={selectedCountry ? parseInt(selectedCountry.phone_length, 10) + 4 : 14}
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default App;
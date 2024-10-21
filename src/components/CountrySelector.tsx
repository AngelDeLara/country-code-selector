import React, { useState, useRef, useEffect, useMemo } from "react";
import "./CountrySelector.css";

interface Country {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
}

interface CountryWithISO extends Country {
  iso: string;
}

interface CountrySelectorProps {
  countries: Record<string, Country>;
  selectedCountry: CountryWithISO | null;
  onSelectCountry: (country: CountryWithISO) => void;
}

/**
 * CountrySelector Component
 * 
 * A React component that renders a searchable dropdown for country selection. It displays the flag,
 * calling code, and name of each country. It also allows users to filter countries based on their search input.
 *
 * ## Props
 * 
 * @typedef {Object} Country - Represents the basic details of a country.
 * @property {string} id - The unique identifier for the country.
 * @property {string} name - The name of the country.
 * @property {string} calling_code - The country's international calling code.
 * @property {string} phone_length - The expected phone number length for the country.
 * 
 * @typedef {Object} CountryWithISO - Extends the `Country` interface, adding an ISO code.
 * @property {string} iso - The ISO code for the country.
 * 
 * @typedef {Object} CountrySelectorProps - The props expected by the `CountrySelector` component.
 * @property {Record<string, Country>} countries - An object mapping ISO codes to country objects.
 * @property {CountryWithISO | null} selectedCountry - The currently selected country or `null`.
 * @property {function} onSelectCountry - A callback function triggered when a country is selected.
 * 
 * @param {CountrySelectorProps} props - The props passed to the component.
 * 
 * @returns {JSX.Element} The rendered CountrySelector component.
 *
 * ## Behavior
 * - **Dropdown Toggle**: Clicking on the selected country toggles the visibility of the dropdown.
 * - **Search**: Filters countries in real-time based on user input in the search field.
 * - **Outside Click Detection**: Closes the dropdown when the user clicks outside the component.
 * - **Default Selection**: Automatically selects the first country if no country is selected initially.
 *
 * ## Dependencies
 * - `useState`, `useRef`, `useEffect`, `useMemo` from React for state management, refs, and memoization.
 * - External CSS for component styling.
 * - `flagcdn.com` for fetching country flag images using ISO codes.
 *
 * ## Example Usage
 * ```jsx
 * <CountrySelector 
 *   countries={countriesData} 
 *   selectedCountry={selectedCountry} 
 *   onSelectCountry={handleCountrySelect} 
 * />
 * ```
 */
const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to handle closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Memoized array of countries with ISO codes
  const countriesArray = useMemo(() => 
    Object.entries(countries).map(([iso, country]) => ({
      ...country,
      iso,
    })),
    [countries]
  );

  // Memoized array of filtered countries based on search term
  const filteredCountries = useMemo(() => 
    countriesArray.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [countriesArray, searchTerm]
  );

  // Handles the selection of a country
  const handleCountrySelect = (country: CountryWithISO) => {
    onSelectCountry(country);
    setIsOpen(false);
  };

  // Automatically selects the first country if no country is selected initially
  useEffect(() => {
    if (countriesArray.length > 0 && !selectedCountry) {
      onSelectCountry(countriesArray[0]);
    }
  }, [countriesArray, selectedCountry, onSelectCountry]);

  return (
    <div className="country-selector" ref={dropdownRef}>
      <div className="selected-country" onClick={() => setIsOpen(!isOpen)}>
        {selectedCountry && (
          <>
            <img
              src={`https://flagcdn.com/${selectedCountry.iso.toLowerCase()}.svg`}
              alt={`${selectedCountry.name} flag`}
              className="country-flag"
              loading="lazy"
            />
            <span>{selectedCountry.calling_code}</span>
          </>
        )}
      </div>
      {isOpen && (
        <div className="country-dropdown">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {filteredCountries.map((country) => (
              <li key={country.id} onClick={() => handleCountrySelect(country)}>
                <div className="country-option">
                  <img
                    src={`https://flagcdn.com/${country.iso.toLowerCase()}.svg`}
                    alt={`${country.name} flag`}
                    className="country-flag"
                    loading="lazy"
                  />
                  <span>{country.name}</span>
                </div>
                <span>{country.calling_code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
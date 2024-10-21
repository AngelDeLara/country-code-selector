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
 * This component renders a dropdown selector for countries, allowing users to search and select a country.
 * It displays the selected country's flag and calling code, and provides a searchable list of all available countries.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Record<string, Country>} props.countries - An object containing all available countries
 * @param {CountryWithISO | null} props.selectedCountry - The currently selected country
 * @param {function} props.onSelectCountry - Callback function to handle country selection
 */
const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Effect to handle closing the dropdown when clicking outside
   */
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

  /**
   * Memoized array of countries with ISO codes
   * @type {CountryWithISO[]}
   */
  const countriesArray = useMemo(() => 
    Object.entries(countries).map(([iso, country]) => ({
      ...country,
      iso,
    })),
    [countries]
  );

  /**
   * Memoized array of filtered countries based on search term
   * @type {CountryWithISO[]}
   */
  const filteredCountries = useMemo(() => 
    countriesArray.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [countriesArray, searchTerm]
  );

  /**
   * Handles the selection of a country
   * @param {CountryWithISO} country - The selected country
   */
  const handleCountrySelect = (country: CountryWithISO) => {
    onSelectCountry(country);
    setIsOpen(false);
  };

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
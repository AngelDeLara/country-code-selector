import React, { useState, useRef, useEffect } from "react";
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

const CountrySelector: React.FC<CountrySelectorProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const countriesArray: CountryWithISO[] = Object.entries(countries).map(([iso, country]) => ({
    ...country,
    iso,
  }));

  const filteredCountries = countriesArray.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="country-selector" ref={dropdownRef}>
      <div className="selected-country" onClick={() => setIsOpen(!isOpen)}>
        {selectedCountry && (
          <>
            <img
              src={`https://flagcdn.com/${selectedCountry.iso.toLowerCase()}.svg`}
              alt={`${selectedCountry.name} flag`}
              className="country-flag"
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
              <li
                key={country.id}
                onClick={() => {
                  onSelectCountry(country);
                  setIsOpen(false);
                }}
              >
                <div className="country-option">
                  <img
                    src={`https://flagcdn.com/${country.iso.toLowerCase()}.svg`}
                    alt={`${country.name} flag`}
                    className="country-flag"
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
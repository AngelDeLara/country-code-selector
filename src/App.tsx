import React, { useCallback, Suspense, lazy } from "react";
import { useAccessToken, useCountries } from "./hooks/useApi";
import ErrorNotification from "./components/ErrorNotification";
import ErrorBoundary from "./components/ErrorBoundary";
import { usePhoneForm } from "./hooks/usePhoneForm";
import "./App.css";
import { useTwoFactorAuth } from "./hooks/useTwoFactorAuth";

// Lazy load the CountrySelector component for improved performance.
const CountrySelector = lazy(() => import("./components/CountrySelector"));

/**
 * Component: App
 *
 * The main application component that manages the phone number input form.
 * It fetches access tokens and country data, and handles the submission 
 * of phone numbers for two-factor authentication.
 */
const App: React.FC = () => {
  // Fetch access token and handle potential errors.
  const { accessToken, error: accessTokenError } = useAccessToken();
  
  // Fetch country data based on the access token and handle potential errors.
  const { countries, error: countriesError } = useCountries(accessToken);

  // Manage phone number form state and handling.
  const {
    selectedCountry,
    phoneNumber,
    placeholderMask,
    handlePhoneChange,
    handleCountryChange,
    isSubmitDisabled,
    error,
  } = usePhoneForm();

  // Hook to initiate two-factor authentication.
  const initiateTwoFactorAuth = useTwoFactorAuth(accessToken);

  /**
   * Handle form submission to initiate two-factor authentication.
   * 
   * @param {React.FormEvent} e - The form event object.
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry) {
      // Call the two-factor authentication function and handle the result.
      const result = await initiateTwoFactorAuth(phoneNumber, selectedCountry.id);
      if (result.success) {
        alert("Two-factor authentication initiated successfully!");
      } else {
        alert(`An error occurred: ${result.message}`);
      }
    }
  }, [selectedCountry, phoneNumber, initiateTwoFactorAuth]);

  // Render error notification if there is an error fetching access token or countries.
  if (accessTokenError || countriesError) {
    return <ErrorNotification message={(accessTokenError || countriesError) ?? ''} />;
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <h1>Phone Number Input</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit} aria-label="Phone number submission form">
            <div className="phone-input-container">
              <Suspense fallback={<div>Loading country selector...</div>}>
                <CountrySelector
                  countries={countries}
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleCountryChange}
                />
              </Suspense>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={placeholderMask}
                className="phone-input"
                maxLength={selectedCountry ? parseInt(selectedCountry.phone_length, 10) + 4 : 14}
                aria-label="Phone number input"
                aria-invalid={!!error}
                aria-describedby="phone-error"
              />
            </div>
            {error && <p id="phone-error" className="error-message">{error}</p>}
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitDisabled}
              aria-disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
import { useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

/**
 * useTwoFactorAuth is a custom React hook that handles the submission of
 * a phone number and country ID for two-factor authentication.
 * 
 * @param {string | null} accessToken - The access token used for authorization.
 * 
 * @returns {Function} - A callback function that performs the two-factor 
 * authentication request:
 * 
 * - phoneNumber: The user's phone number to authenticate.
 * - countryId: The ID of the country associated with the phone number.
 * 
 * @throws {Error} - Throws an error if the access token is not available.
 */
export const useTwoFactorAuth = (accessToken: string | null) => {
  return useCallback(async (phoneNumber: string, countryId: string) => {
    // Check if access token is available
    if (!accessToken) {
      throw new Error('Access token is not available');
    }
    try {
      // Send a POST request to the two-factor authentication endpoint
      await axios.post(
        `${API_BASE_URL}/challenges/two_factor_auth`, // API endpoint
        {
          phone_number: phoneNumber.replace(/\D/g, ""), // Format phone number by removing non-digit characters
          country_id: countryId, // Include the country ID
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Set authorization header with access token
          },
        }
      );
      return { success: true }; // Return success response if request is successful
    } catch (error) {
      console.error("Error submitting phone number:", error); // Log the error for debugging
      // Check if the error is an Axios error
      if (axios.isAxiosError(error)) {
        return { 
          success: false, 
          message: error.response?.data?.message || error.message // Return error message from response or generic message
        };
      }
      return { 
        success: false, 
        message: "An unexpected error occurred" // Return a generic error message for unexpected errors
      };
    }
  }, [accessToken]); // Dependency array to recompute the callback if accessToken changes
};
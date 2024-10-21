import { useState, useEffect } from 'react';
import axios from 'axios';
import { Country } from '../types';

const API_KEY = process.env.REACT_APP_API_KEY;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const HEADERS = {
  'Api-Key': API_KEY || '',
};

/**
 * Custom Hook: useAccessToken
 * 
 * The useAccessToken hook is responsible for fetching and managing 
 * the access token required for authenticating API requests. 
 * It handles any errors that occur during the token retrieval process 
 * and provides the current access token and error state.
 * 
 * @returns {Object} An object containing the access token and error state.
 * @returns {string} accessToken - The current access token.
 * @returns {string | null} error - An error message if the token fetching fails, otherwise null.
 */
export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/access_token?corporate_id=10`,
          {},
          { headers: HEADERS }
        );
        setAccessToken(response.data.access_token);
      } catch (err) {
        setError('Error fetching access token');
        console.error("Error fetching access token:", err);
      }
    };

    fetchAccessToken();
  }, []);

  return { accessToken, error };
};

/**
 * Custom Hook: useCountries
 * 
 * The useCountries hook retrieves a list of countries using the provided 
 * access token for authentication. It handles errors during the 
 * fetching process and provides the fetched countries and error state.
 * 
 * @param {string} accessToken - The access token used for authenticating the API request.
 * @returns {Object} An object containing the countries data and error state.
 * @returns {Record<string, Country>} countries - The fetched countries data.
 * @returns {string | null} error - An error message if fetching countries fails, otherwise null.
 */
export const useCountries = (accessToken: string) => {
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      if (!accessToken) return;

      try {
        const response = await axios.get<Record<string, Country>>(`${API_BASE_URL}/challenges/countries`, {
          headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
        });
        setCountries(response.data);
      } catch (err) {
        setError('Error fetching countries');
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, [accessToken]);

  return { countries, error };
};

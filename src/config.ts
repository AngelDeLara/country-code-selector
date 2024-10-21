// Define the base URL for the API by retrieving it from the environment variables
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Check if the API base URL is defined
if (!API_BASE_URL) {
  // Throw an error if the REACT_APP_API_BASE_URL environment variable is not set
  throw new Error('REACT_APP_API_BASE_URL is not defined in the environment');
}

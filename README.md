# Country Code Selector Challenge

This project is a mobile-first React application that implements an efficient country code selector and phone number input system. It is designed to provide a lightweight alternative to existing flag selector packages, significantly reducing bundle size and improving load times.

## Features

- **Mobile-first UI design**: Optimized for mobile devices for a seamless user experience.
- **Built with TypeScript and React**: Leveraging TypeScript's static typing to enhance code quality and maintainability.
- **Dynamic country code selector**: Displays the selected country's flag alongside its code.
- **Searchable country list dropdown**: Enables users to easily find and select a country.
- **Phone number input**: Features dynamic formatting based on the selected country, improving user interaction.
- **Real-time phone number validation**: Ensures the input meets the specific requirements of the selected country's phone format.
- **Integration with SoftPoint developer API**: Utilizes this API for fetching country data and handling two-factor authentication.
- **Optimized bundle size**: The gzipped project size is under 806 KB, ensuring fast load times.

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AngelDeLara/country-code-selector.git
   cd country-code-selector-challenge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add your API credentials:
   ```env
   REACT_APP_API_KEY=your_api_key_here
   REACT_APP_API_BASE_URL=your_api_base_url_here
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

## Available Scripts

In the project directory, you can run:

- **`npm start`**: Runs the app in development mode.
- **`npm test`**: Launches the test runner.
- **`npm run build`**: Builds the app for production.
- **`npm run eject`**: Ejects from Create React App (this is a one-way operation).

## Technical Details

- The country selector component displays the currently selected country's flag and code.
- The dropdown menu includes a search field for filtering countries by name.
- The phone number input field updates its placeholder and validation based on the selected country.
- On submission, the app sends the phone number and country ID to the SoftPoint developer API.
- Country data is retrieved from the SoftPoint developer API for dynamic use.

## Bonus Features

- **Dynamic phone number masking**: The input field includes a mask that formats the number as the user types.
- **Adaptive mask length and format**: The mask adjusts based on the selected country's specific phone number length and format requirements.

## Learn More

To learn more about the technologies used in this project, visit the following links:

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
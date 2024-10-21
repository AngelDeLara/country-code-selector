# Country Code Selector Challenge

This project is a mobile-first React application that implements an efficient country code selector and phone number input system. It's designed to provide a lightweight alternative to existing flag selector packages, significantly reducing bundle size and improving load times.

## Features

- Mobile-first UI design
- Built with TypeScript and React
- Dynamic country code selector with flag display
- Searchable country list dropdown
- Phone number input with dynamic formatting based on selected country
- Real-time phone number validation
- Integration with SoftPoint developer API for country data and two-factor authentication
- Optimized bundle size (gzipped project under 806kb)

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   git clone https://github.com/AngelDeLara/country-code-selector.git
   cd country-code-selector-challenge

2. Install dependencies:
   npm install

3. Create a `.env` file in the root directory and add your API credentials:
   REACT_APP_API_KEY=your_api_key_here
   REACT_APP_API_BASE_URL=your_api_base_url_here

4. Start the development server:
   npm start

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

## Technical Details

- The country selector component displays the currently selected country's flag and code
- The dropdown menu includes a search field for filtering countries by name
- Phone number input field updates its placeholder and validation based on the selected country
- Submission sends the phone number and country ID to the SoftPoint developer API
- The app retrieves country data from the SoftPoint developer API

## Bonus Features

- Phone number input field includes a dynamic mask that formats the number as the user types
- The mask's length and format adjust based on the selected country's phone number length

## Learn More

To learn more about the technologies used in this project:

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
# Dynamic Form Builder

A React-based application that allows students to login and fill out dynamic forms with multiple sections.

## Features

- Student login with roll number and name
- Dynamic form rendering based on API response
- Multi-section form with validation
- Support for various field types:
  - Text
  - Email
  - Telephone
  - Textarea
  - Date
  - Dropdown
  - Radio
  - Checkbox
- Section-by-section validation
- Responsive design with Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `POST /create-user` - Register a user
  ```json
  {
    "rollNumber": "string",
    "name": "string"
  }
  ```

- `GET /get-form` - Get form structure
  ```json
  {
    "rollNumber": "string"
  }
  ```

## Technologies Used

- Next.js
- TypeScript
- React Hook Form
- Yup
- Tailwind CSS
- Axios 
# Twiddly

Twiddly is a modern web application built with SvelteKit, designed for social interaction through posts and comments. This README provides instructions on how to set up and run Twiddly locally.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (version 20 or later)
- PostgreSQL (version 16 or later)
- [pnpm](https://pnpm.io/) (recommended package manager)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lucien-n/twiddly.git
cd twiddly
```

### 2. Install Dependencies

Use pnpm to install the required dependencies:

```bash
pnpm i
```

### 3. Set Up PostgreSQL Database

1. Create a new PostgreSQL database (for example, `twiddly_db`).
2. Update your PostgreSQL connection settings in the `.env` file.

### 4. Create a .env File

In the root of your project, create a `.env` file and add the following environment variables. Use your local settings for the database and API keys.

```dotenv
POSTGRES_PRISMA_URL="postgres://url"
MJ_APIKEY_PUBLIC="your_public_api_key_here"
MJ_APIKEY_PRIVATE="your_private_api_key_here"
PUBLIC_ORIGIN="http(s)://host:port?"
```

Make sure to replace the API keys with your actual Mailgun API keys and adjust the database URL if necessary.

### 5. Migrate the Database

Run the Prisma migrations to set up the database schema:

```bash
pnpm prisma migrate dev --name init
```

### 6. Run the Development Server

Start the local development server:

```bash
pnpm dev
```

You can now access the application at `http://localhost:5173`. (default vite dev server)

### 7. Running Tests

To run the tests for Twiddly, use the following command:

```bash
pnpm test
```

## Contributing

If you would like to contribute to Twiddly, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

---

For any questions or issues, please open an issue in the GitHub repository.

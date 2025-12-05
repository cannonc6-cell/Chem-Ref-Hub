# Chemical Reference Hub

**Version 1.3.0**

A comprehensive chemical reference and inventory management system built with React and Vite.

## Features

- Chemical database with search and filtering
- Inventory tracking
- QR code generation
- PDF export capabilities
- Dynamic logbook system
- Advanced analytics
- Global search (Cmd/Ctrl+K)
- Dark mode support
- PWA capabilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` from template:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Firebase credentials to `.env.local`

5. Run development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
├── config/          # Configuration files
├── docs/            # Documentation
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom React hooks
│   ├── utils/       # Utility functions
│   ├── styles/      # CSS files
│   ├── context/     # React context
│   ├── config/      # App configuration
│   └── data/        # Static data
└── ...

```

## Security

- Firebase credentials should be stored in `.env.local`
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data

## License

Private project - All rights reserved

## Contributing

This is a private project. For questions or issues, contact the maintainer.

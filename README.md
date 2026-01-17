# RoadReady - Car Garage Frontend

Platformă completă pentru managementul inspecțiilor tehnice periodice (ITP) auto.

## 🚀 Features

- **Dashboard Interactiv**: Statistici și rapoarte detaliate
- **Gestionare Inspecții**: CRUD complet pentru inspecții tehnice
- **Management Clienți**: Bază de date clienți și vehicule
- **Reminder-uri SMS**: Notificări automate pentru ITP-uri ce expiră
- **Multi-language**: Suport pentru Română și Engleză
- **Responsive Design**: Optimizat pentru desktop, tablet și mobile

## 🔍 SEO Implementation

Aplicația este optimizată complet pentru motoarele de căutare:

- ✅ Meta tags SEO (Title, Description, Keywords)
- ✅ Open Graph tags pentru social media
- ✅ Structured Data (JSON-LD) cu Schema.org
- ✅ Dynamic meta tags cu React Helmet Async
- ✅ robots.txt și sitemap.xml
- ✅ PWA support cu manifest.json

**Pentru detalii complete despre SEO, vezi:**
- [SEO_GUIDE.md](./SEO_GUIDE.md) - Ghid complet de implementare
- [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) - Checklist pentru deployment

## 🛠️ Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **i18next** - Internationalization
- **React Helmet Async** - SEO meta tags

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://api.roadready.ro
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
```

## 📱 PWA Support

The application supports Progressive Web App features:
- Installable on mobile devices
- Offline support (coming soon)
- Fast loading with service workers

## 🎨 Project Structure

```
src/
├── components/       # React components
│   ├── shared/      # Reusable components
│   ├── forms/       # Form components
│   └── ...
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── rtk/             # Redux Toolkit setup
│   ├── services/    # RTK Query services
│   └── stores/      # Redux stores
├── utils/           # Utility functions
├── translations/    # i18n translations
└── assets/          # Static assets
```

## 🔐 Authentication

The app uses JWT-based authentication with:
- Access tokens (short-lived)
- Refresh tokens (long-lived)
- Automatic token refresh
- Protected routes

## 📊 Features by Role

### Admin
- View all companies and branches
- System-wide statistics
- User management

### Owner (Service Owner)
- Manage inspections for their service
- View branch statistics
- Manage inspectors
- SMS reminders for customers

### Inspector
- Add/edit inspections
- View assigned inspections
- Customer management

## 🌍 Internationalization

Supported languages:
- 🇷🇴 Română (Romanian)
- 🇬🇧 English

## 📈 Analytics & SEO

After deployment, set up:
1. **Google Search Console** - Monitor search performance
2. **Google Analytics 4** - Track user behavior
3. **Google My Business** - Local SEO for service locations

See [SEO_CHECKLIST.md](./SEO_CHECKLIST.md) for complete setup instructions.

## 🧪 Testing

```bash
# Run linter
npm run lint

# Fix linting errors
npm run lint:fix
```

## 📝 License

Private - All rights reserved

## 👥 Team

Developed by the RoadReady team

## 📞 Support

For support, email support@roadready.ro

---

Made with ❤️ for the automotive industry in Romania

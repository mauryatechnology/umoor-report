# Umoor Report Dashboard

A comprehensive, multi-lingual reporting platform built for the Dawoodi Bohra community to track and display Umoor achievements, improvements, and galleries across various cities. 

## 🚀 Key Features

*   **Public Reporting Pages (`/[location]`)**: Beautiful, public-facing report dashboards automatically generated for each location (e.g., `/bhopal-city`).
*   **Secure Admin Dashboard (`/dashboard`)**: A fully authenticated admin panel to manage report data, user profiles, and settings.
*   **Multi-Lingual Support**: Seamlessly toggle between English and Urdu. Includes custom typography support with the official **Kanz-ul-Marjaan** font for authentic Urdu calligraphy.
*   **Dynamic Data Editor**: Complex, nested JSON data management using an intuitive Umoor Table interface. Supports adding, editing, and deleting nested achievements, improvements, tags, and image galleries.
*   **Customizable Branding**: Users can upload their own logo and set a custom title/subtitle via the settings page. The application dynamically updates the public header, dashboard sidebar, and browser favicon to match the branding.
*   **Responsive & Premium UI**: Built with Tailwind CSS, Lucide Icons, and Framer Motion for a polished, glassmorphic, and highly interactive user experience.

## 🛠️ Technology Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Frontend**: React 19, Tailwind CSS
*   **Backend**: Next.js API Routes (Serverless)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Authentication**: Custom JWT-based authentication
*   **Icons & Animations**: `lucide-react`, `framer-motion`

## 📦 Prerequisites

Before running the project locally, ensure you have the following installed:
*   Node.js (v18.x or later)
*   npm or yarn
*   A MongoDB database (local or MongoDB Atlas)

## ⚙️ Environment Variables

Create a `.env.local` file in the root of your project and configure the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/umoor-report?retryWrites=true&w=majority

# JWT Secret for Authentication (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key
```

## 🚀 Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd umoor-report
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure Overview

```
src/
├── app/
│   ├── [location]/         # Public reporting pages per city/tenant
│   ├── api/                # Next.js API routes (auth, reports, profile, upload)
│   ├── dashboard/          # Authenticated admin panel and settings
│   ├── login/              # User authentication
│   └── register/           # User registration
├── components/
│   ├── common/             # Reusable UI (Header, Dialogs, Tables)
│   ├── dashboard/          # Dashboard-specific components (DataEditor, Forms)
│   └── animations/         # Framer motion wrappers (FadeIn)
├── context/                # React Contexts (LanguageContext, DashboardContext)
├── lib/                    # Utilities (MongoDB connection, JWT auth)
└── models/                 # Mongoose database schemas (User, Report)
```

## 📜 Font Configuration
The application relies on the `KANZ-AL-MARJAAN.TTF` font for Urdu text. This font is served statically from the `/public` directory. Users can also download this font directly from their Dashboard Settings to install on their local devices for native rendering support.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

# CostGuard AI

CostGuard AI is an enterprise cost intelligence and autonomous FinOps platform. It continuously monitors cloud and operational data to detect anomalies, identify waste (e.g., idle resources, duplicate SaaS seats), and safely execute approved remediation workflows.

## Core Capabilities

*   **Continuous Spend Intelligence**: Ingests operational data (CSV/JSON/API) to flag irregularities, duplicate licenses, and runaway costs in real-time.
*   **SLA & Penalty Prevention**: Monitors system telemetry to predict and prevent SLA breaches before financial penalties are incurred.
*   **Actionable Recommendations**: Generates specific, quantifiable optimization strategies with root-cause attribution.
*   **Human-in-the-loop Execution**: Provides a secure Approval Center where enterprise admins can review, reject, or approve autonomous remediation actions.

## Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, React Router, Lucide Icons, Recharts
*   **Backend**: Node.js, Express.js
*   **Database**: MySQL (using `mysql2/promise` for connection pooling)
*   **AI Engine**: Custom rules-based inference engine with OpenAI fallback integration

## Prerequisites

Before running the platform locally, ensure you have the following installed:
*   Node.js (v16 or higher)
*   MySQL (v8.0+)
*   npm or yarn

## Local Setup

### 1. Database Configuration
Ensure your local MySQL instance is running. The application expects a `costguard` database to exist.
Update the database connection strings in your backend `.env` file if your local MySQL credentials differ from the defaults (user: `root`, no password).

### 2. Backend Initialization
Navigate to the backend directory, install dependencies, and start the development server.

```bash
cd backend
npm install
npm run dev
```
*Note: The backend normally runs on `http://localhost:5000`.*

### 3. Frontend Initialization
In a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite dev server.

```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend will be accessible at `http://localhost:5173`.*

## Platform Usage

1. **Authentication**: Access the web interface at `http://localhost:5173`. You can create a new local account via the register tab, or log in with pre-seeded credentials if you have run the database seed scripts.
2. **Data Ingestion**: Navigate to the **Data Upload** module. You can upload the provided `sample-data.csv` to trigger an ingestion pipeline.
3. **Analysis**: Hit "Run AI Analysis" on the dashboard. The backend agents will process the records and populate the **Insights** and **Recommendations** modules.
4. **Execution Workflow**: Navigate to the **Approval Center** to review the generated actions. Once an action is approved, you can execute it, which will update the system's impact metrics and save the event to the **Execution Logs**.

## Project Architecture

```
costguard-ai/
├── backend/
│   ├── controllers/      # Route logic (auth, data ingestion, metrics)
│   ├── middleware/       # JWT authentication validation
│   ├── models/           # MySQL Schema interfaces
│   ├── routes/           # Express API endpoints
│   ├── services/         # Core AI rules engine & execution logic
│   └── server.js         # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Shared UI elements
│   │   ├── hooks/        # Custom React hooks (useAuth, useTheme)
│   │   ├── pages/        # Main route views (Dashboard, Insights, etc.)
│   │   └── services/     # Axios API client setup
│   ├── index.html        # App entry document
│   └── tailwind.config.cjs # Design system and animations
└── sample-data.csv       # Test dataset for local evaluation
```

## License
Proprietary. Internal use only.

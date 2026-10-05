# Courier Employee Management System - Frontend

A complete, production-grade React frontend application built for the **Courier Employee Management System** academic project.

- **Framework**: React 19 + Vite 8
- **Routing**: React Router 7 (`react-router-dom`)
- **HTTP Client**: Axios with central API configuration & response interceptors
- **Icons**: Lucide React
- **Design System**: Custom CSS design system with Dark Navy sidebar, accessible status indicators, responsive cards, modals, and toasts.

---

## 🚀 Running the Application

### 1. Ensure the Spring Boot Backend is Running
The backend must be running at:
```
http://localhost:8080
```
With base API path:
```
http://localhost:8080/api
```

### 2. Environment Configuration
The frontend uses `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Frontend Development Server
From the `frontend` folder:
```bash
npm install
npm run dev
```
The application will be live at:
```
http://localhost:5173
```

---

## 📁 Project Architecture

```
frontend/
├── .env                               # Central API configuration (VITE_API_BASE_URL)
├── index.html                         # HTML template with Inter typography
├── package.json
├── vite.config.js                     # Vite dev server configuration (port 5173)
└── src/
    ├── api/
    │   └── api.js                     # Central Axios instance with error interceptors
    ├── context/
    │   └── ToastContext.jsx           # Global toast notifications context
    ├── services/
    │   ├── employeeService.js         # Employee REST API service
    │   ├── parcelService.js           # Parcel REST API service
    │   ├── routeService.js            # Route REST API service
    │   └── deliveryService.js         # Delivery REST API service
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.jsx             # Shell wrapper
    │   │   ├── Sidebar.jsx            # Dark navy collapsible navigation
    │   │   └── Header.jsx             # Top bar with API status & user indicator
    │   ├── common/
    │   │   ├── StatCard.jsx           # Analytical dashboard cards
    │   │   ├── StatusBadge.jsx        # Standardized color-coded status badges
    │   │   ├── Modal.jsx              # Accessible modal dialog
    │   │   ├── ConfirmDialog.jsx      # Delete & action confirmation modal
    │   │   ├── LoadingSpinner.jsx     # Loading states
    │   │   └── EmptyState.jsx         # Search and empty data placeholders
    │   └── modules/
    │       ├── EmployeeFormModal.jsx  # Add / Edit Employee modal with validation
    │       ├── EmployeeViewModal.jsx  # Employee profile details modal
    │       ├── AboveAverageModal.jsx  # SQL subquery above-average performers
    │       ├── EmployeeDeliveryCountModal.jsx # Stored function delivery count
    │       ├── ParcelFormModal.jsx    # Add / Edit Parcel modal
    │       ├── ParcelViewModal.jsx    # Full parcel details modal
    │       ├── RouteFormModal.jsx     # Add / Edit Route modal
    │       ├── RouteViewModal.jsx     # Route info modal
    │       ├── AssignDeliveryModal.jsx # Stored procedure delivery assignment
    │       ├── UpdateDeliveryStatusModal.jsx # Status updater (MySQL trigger aware)
    │       └── DeliveryViewModal.jsx  # Full joined delivery details modal
    ├── pages/
    │   ├── DashboardPage.jsx          # Live KPI metrics, status charts, recent deliveries
    │   ├── EmployeesPage.jsx          # Staff table, CRUD, subquery modal, count function
    │   ├── ParcelsPage.jsx            # Parcel inventory, CRUD, weight metrics
    │   ├── RoutesPage.jsx             # Transit corridors, CRUD, distance metrics
    │   ├── DeliveriesPage.jsx         # Joined delivery management, assign & status flow
    │   └── ReportsPage.jsx            # Operational analytics & SQL subquery reports
    ├── App.jsx                        # Client-side routing configuration
    ├── App.css                        # Application styles, responsive layout, cards
    ├── index.css                      # Global resets and CSS variables
    └── main.jsx                       # React entry point
```

---

## 🔗 Integrated REST Endpoints

### Employees
- `GET /api/employees` - Retrieve all employees
- `GET /api/employees/{id}` - Retrieve single employee
- `POST /api/employees` - Register employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/employees/above-average` - SQL Subquery: Staff handling above-average deliveries

### Parcels
- `GET /api/parcels` - Retrieve all parcels
- `GET /api/parcels/{id}` - Retrieve single parcel
- `POST /api/parcels` - Register parcel
- `PUT /api/parcels/{id}` - Update parcel
- `DELETE /api/parcels/{id}` - Delete parcel

### Routes
- `GET /api/routes` - Retrieve all routes
- `GET /api/routes/{id}` - Retrieve single route
- `POST /api/routes` - Add transit corridor
- `PUT /api/routes/{id}` - Update route
- `DELETE /api/routes/{id}` - Delete route

### Deliveries
- `GET /api/deliveries` - Retrieve raw delivery records
- `GET /api/deliveries/details` - Multi-table SQL JOIN: employee, parcel, route details
- `POST /api/deliveries/assign` - Invokes Stored Procedure `assign_delivery`
- `PATCH /api/deliveries/{id}/status` - Updates delivery status (Triggers `after_delivery_status_update` to set parcel to `DELIVERED`)
- `DELETE /api/deliveries/{id}` - Remove delivery record
- `GET /api/deliveries/employee/{id}/count` - Invokes Stored Function `count_employee_deliveries`

---

## 📱 Features & Highlights
1. **Zero Mock Data**: Operates directly with the Spring Boot REST services and MySQL database.
2. **Database Integration Aware**:
   - Explicit notifications when the `assign_delivery` stored procedure runs.
   - Highlights the MySQL trigger `after_delivery_status_update` automatically syncing parcel status to `DELIVERED`.
   - Visualizes the `count_employee_deliveries` stored function on the staff table.
   - Showcases the SQL Subquery top-performer rankings.
3. **Responsive UI**: Dark navy navigation with collapsible drawer on mobile/tablet screens.
4. **Resilient Error Handling**: User-friendly alerts and toasts for network outages and validation conflicts without dumping Java stack traces.

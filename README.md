# DentaVera — Design Preview

A simple local server to browse all UI screens in one place.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Then open **http://localhost:3000** in your browser.

For live-reload during development:
```bash
npm run dev
```

## Screens included

### Shared
| Screen | Route |
|--------|-------|
| Login | `/dv_01_login` |

### Admin
| Screen | Route |
|--------|-------|
| Dashboard | `/dv_02_admin_dashboard` |
| Team | `/dv_03_team` |
| Usage Metrics | `/dv_04_usage_metrics` |
| Billing | `/dv_05_billing` |
| Org Settings | `/dv_06_org_settings` |

### User
| Screen | Route |
|--------|-------|
| Dashboard | `/dv_u02_user_dashboard` |
| Upload Image | `/dv_u03_upload` |
| Select Simulation | `/dv_u04_sim_select` |
| Processing | `/dv_u05_processing` |
| Result | `/dv_u06_result` |
| Compare | `/dv_u07_compare` |
| My Simulations | `/dv_u08_history` |
| Profile | `/dv_u09_profile` |

## Project structure

```
dentavera/
├── server.js         # Express server + navigation shell
├── package.json
├── README.md
└── screens/          # All HTML screen files
    ├── dv_01_login.html
    ├── dv_02_admin_dashboard.html
    ├── dv_03_team.html
    ├── dv_04_usage_metrics.html
    ├── dv_05_billing.html
    ├── dv_06_org_settings.html
    ├── dv_u02_user_dashboard.html
    ├── dv_u03_upload.html
    ├── dv_u04_sim_select.html
    ├── dv_u05_processing.html
    ├── dv_u06_result.html
    ├── dv_u07_compare.html
    ├── dv_u08_history.html
    └── dv_u09_profile.html
```

## Adding new screens

1. Drop the `.html` file into the `screens/` folder
2. Add an entry to the `screens` array in `server.js`
3. Restart the server

# North Coast job-management dashboard

A demo operations workspace for **North Coast Heating & Cooling**, a fictional residential HVAC company in Cleveland, Ohio. The frontend uses React, TypeScript, MUI, Vite, Tailwind CSS and Prettier. The REST API uses Spring Boot 3.5.16, Java 21, Maven and an in-memory H2 database.

The dashboard includes an overview with KPIs and a generated week summary, a filterable jobs table with a status-update drawer, a new-job form, a weekly schedule, and searchable customers with their job histories. Sample data contains **12 customers, 15 jobs and 4 technicians** across Cleveland and nearby suburbs.

This is a public demo without authentication. Use fictional data only. The API's in-memory records reset on restart; it is not a production customer-management system.

## Project structure

```text
north_coast_dashboard/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/resources/
│       ├── application.properties
│       ├── schema.sql
│       └── data.sql
└── frontend/
    ├── .env.example
    ├── package.json
    ├── vercel.json
    └── src/
```

`backend/src/main/resources/data.sql` contains the SQL seed data. Job dates are relative to the current Cleveland week so a fresh demo stays relevant. The frontend also includes equivalent sample data for its standalone browser demo.

## Run the backend locally

Install a **Java 21 JDK** and **Maven 3.6.3 or newer**; Maven 3.9.16 is a suitable current version. Then, from this project directory:

```sh
cd backend
mvn spring-boot:run
```

The API starts at [http://localhost:8080](http://localhost:8080). Open [the health endpoint](http://localhost:8080/api/health) to check it is running. Stop the process with `Ctrl+C`.

The backend does not need a database installation or an API key. It creates its H2 tables and loads the sample records at startup. Restarting or redeploying the process discards edits and restores the seed data.

The backend's `.env.example` documents available environment variables. **Spring Boot does not automatically load a `.env` file**; set these variables in the terminal or hosting service instead.

| Backend variable       | Default                                       | Purpose                                                                       |
| ---------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| `PORT`                 | `8080`                                        | HTTP port; also accepts the hosting platform's assigned port                  |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5175,http://127.0.0.1:5175` | Comma-separated exact frontend origins, without trailing slashes or wildcards |
| `OPENAI_API_KEY`       | Empty                                         | Optional server-only key for live week summaries                              |
| `OPENAI_MODEL`         | `gpt-5.6-luna`                                | Optional model override                                                       |

For example, in PowerShell:

```powershell
$env:CORS_ALLOWED_ORIGINS = 'http://localhost:5175,http://127.0.0.1:5175'
mvn spring-boot:run
```

Optional Docker alternative, from `backend/`:

```sh
docker build -t north-coast-api .
docker run --rm -p 8080:8080 north-coast-api
```

## Run the frontend locally

Install **Node.js 22.13 or newer**. In a second terminal, from this project directory:

```sh
cd frontend
npm install
```

To connect it to your running Spring Boot API, copy the example environment file. In PowerShell:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

On macOS or Linux, use `cp .env.example .env.local` instead. The copied file contains:

```dotenv
VITE_API_URL=http://localhost:8080
```

Open [http://127.0.0.1:5175](http://127.0.0.1:5175). `VITE_API_URL` is the backend origin, without an `/api` suffix. Restart Vite after changing it.

### Standalone browser demo

For a demo without Java running, omit `.env.local` or set `VITE_API_URL=`. The interface explicitly identifies this as **Browser demo** mode. It uses local sample records and saves job changes in this browser's localStorage, under `north-coast-dashboard-jobs-v1`.

Browser-demo changes do not sync to Spring Boot or other browsers. To restore fresh sample jobs, remove only that storage key in your browser's developer tools and reload. Once saved, job dates remain as saved until this reset.

With a nonempty API URL, failed server requests remain visible and can be retried. The app does not silently switch to local sample data or report a failed API write as a successful demo save.

## AI week summary and metric definitions

The overview's summary is generated from current job totals. Without an OpenAI key, a deterministic summary works immediately and is labeled **Data-generated demo · no AI model**. With a backend `OPENAI_API_KEY`, successful responses are labeled **AI-generated from job totals**; provider errors or timeouts fall back to a current rules-based summary.

Only aggregate totals and date boundaries are sent to OpenAI. Customer names, contact details and free-form job notes are not included. Unchanged AI results are cached for five minutes, with at most one provider attempt per minute per API instance. Keep the key on the backend; never use a `VITE_` variable for it.

| Metric          | Definition                                                                                   |
| --------------- | -------------------------------------------------------------------------------------------- |
| Today's jobs    | Jobs scheduled for today, excluding cancelled jobs                                           |
| Weekly revenue  | Amounts on completed jobs scheduled this Monday–Sunday week; not cash collected              |
| Completion rate | Completed jobs divided by non-cancelled jobs scheduled this week; rounded to a whole percent |
| Jobs by status  | All jobs across all dates                                                                    |

Dates and weekly boundaries use Cleveland's `America/New_York` time zone.

## REST endpoints

| Method     | Path                     | Purpose                                        |
| ---------- | ------------------------ | ---------------------------------------------- |
| GET        | `/api/health`            | Runtime health check                           |
| GET / POST | `/api/jobs`              | List jobs / create a job                       |
| GET / PUT  | `/api/jobs/{id}`         | Read / update a job                            |
| GET        | `/api/customers`         | List customers                                 |
| GET        | `/api/technicians`       | List technicians                               |
| GET        | `/api/dashboard/summary` | KPIs, status counts and generated week summary |

Statuses are `scheduled`, `in-progress`, `completed` and `cancelled`. POST and PUT accept the complete editable job object. See [the backend README](backend/README.md) for the request format, validation rules and response details.

## Deploy the frontend to Vercel

1. Push the project to a Git repository, then import that repository in Vercel.
2. If the repository contains the surrounding portfolio folders, set **Root Directory** to `north_coast_dashboard/frontend`. If this project itself is the repository root, use `frontend`.
3. Select the **Vite** framework preset. Use `npm run build` as the build command and `dist` as the output directory.
4. For the connected dashboard, set `VITE_API_URL` to the deployed API's public HTTPS origin, for example `https://your-api.onrender.com`. For the standalone browser demo, leave it unset.
5. Deploy. The included `vercel.json` provides the SPA rewrites needed for direct links to dashboard pages.
6. Add the resulting Vercel origin to the API's `CORS_ALLOWED_ORIGINS` and restart or redeploy the API. Use exact origins, including `https://`, without trailing slashes. Add preview origins separately if needed.

Vite embeds `VITE_API_URL` at build time. Changing it in Vercel requires another frontend deployment. [Official Vite deployment documentation](https://vercel.com/docs/frameworks/frontend/vite)

## Deploy the API to Render Free

1. In Render, create a **Web Service** connected to your Git repository.
2. Set the root directory to `north_coast_dashboard/backend`, or `backend` if this project is the repository root.
3. Select the **Docker** runtime and the **Free** instance type. Use the included `Dockerfile` and its default start command.
4. Set `CORS_ALLOWED_ORIGINS=https://your-dashboard.vercel.app`. Optionally add `OPENAI_API_KEY` and `OPENAI_MODEL` as backend environment variables.
5. Set the health check path to `/api/health`, then deploy. The app listens on `0.0.0.0` and uses Render's `PORT` automatically.
6. Check `https://your-api.onrender.com/api/health`, then put the API origin in Vercel's `VITE_API_URL` and redeploy the frontend.

As checked on **September 14, 2026**, Render Free provides 750 instance hours per workspace per month. Services sleep after 15 minutes without inbound traffic and typically need about a minute to wake. A sleeping API may cause the dashboard's first request to time out; wait briefly and retry. Every process restart, including a sleep/wake cycle, resets this in-memory H2 demo. [Render Free limitations](https://render.com/docs/free), [Docker deployment](https://render.com/docs/docker)

## Deploy the API to Railway Free or Trial

1. Create a Railway project from your Git repository.
2. Set the service's root directory to `north_coast_dashboard/backend`, or `backend` if this project is the repository root. Railway detects the included `Dockerfile`.
3. Add `CORS_ALLOWED_ORIGINS=https://your-dashboard.vercel.app`. Optionally add the server-only OpenAI variables.
4. Set the health check path to `/api/health`, then deploy. The app honors Railway's `PORT` variable.
5. Under **Settings → Networking → Public Networking**, choose **Generate Domain**. Check `/api/health` at that public address.
6. Set Vercel's `VITE_API_URL` to the public HTTPS origin and redeploy the frontend. A browser cannot reach Railway's private `railway.internal` address.

As checked on **September 14, 2026**, Railway's trial offers $5 in usage credit for up to 30 days. It then reverts to Free with $1 of nonrolling credit per month. Free permits up to 0.5 GB RAM and 1 vCPU per service; available runtime depends on usage. The $5/month Hobby plan is paid. H2 edits reset whenever the API restarts or redeploys. [Current Railway plans](https://docs.railway.com/pricing/plans), [trial terms](https://docs.railway.com/pricing/free-trial), [Dockerfiles](https://docs.railway.com/builds/dockerfiles), [public networking](https://docs.railway.com/networking/public-networking)

## Checks and formatting

From `backend/`:

```sh
mvn test
mvn package
```

From `frontend/`:

```sh
npm test
npm run lint
npm run build
npm run format:check
```

With the local demo API running, `npm run test:integration` checks the real frontend HTTP client against Spring Boot. It temporarily completes one scheduled job, verifies the updated totals, and restores the original status. Set `TEST_API_URL` to use a different demo API origin.

Run `npm run format` to apply Prettier to the frontend. The production frontend can be inspected locally with `npm run preview` at [http://127.0.0.1:4175](http://127.0.0.1:4175). For API-connected previews, add that exact origin to `CORS_ALLOWED_ORIGINS` before starting the backend.

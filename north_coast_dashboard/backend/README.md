# North Coast REST API

Spring Boot 3.5.16, Java 21, Maven, Spring JDBC and an in-memory H2 database.

## Local development

Install a Java 21 JDK and Maven 3.6.3 or newer, then run from this directory:

```sh
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Check `GET /api/health` to confirm it is running. Run `mvn test` for the automated tests, or `mvn package` to build the executable JAR in `target/`.

The root project README covers frontend setup and deployment to Vercel, Render and Railway. The included Dockerfile builds and runs the API with Java 21.

## Configuration

Set environment variables on the backend process or hosting service. `.env.example` documents them; Spring Boot does not automatically read a `.env` file.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `8080` | HTTP port, also honored when assigned by a host |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5175,http://127.0.0.1:5175` | Comma-separated exact frontend origins, without trailing slashes |
| `OPENAI_API_KEY` | Empty | Optional server-only key for the week summary |
| `OPENAI_MODEL` | `gpt-5.6-luna` | Optional model override |

The summary works without an API key. When configured, the backend sends only numeric totals and date boundaries to the Responses API. No customer names, contact details or free-form job notes are sent. AI calls have a five-second timeout, unchanged results are cached for five minutes, and each API instance attempts at most one provider request per minute. A missing key, error, rate limit or incomplete output produces a current rules-based summary with `mode: "rules"`.

## Endpoints

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/health` | Runtime status |
| GET | `/api/jobs` | All jobs, ordered by date and time |
| POST | `/api/jobs` | Creates a job; returns `201` and a `Location` header |
| GET | `/api/jobs/{id}` | One job, or `404` |
| PUT | `/api/jobs/{id}` | Replaces the editable fields of one job |
| GET | `/api/customers` | All 12 seeded customers |
| GET | `/api/technicians` | All four seeded technicians |
| GET | `/api/dashboard/summary` | Current-week metrics and summary text |

POST and PUT both accept the complete editable object:

```json
{
  "title": "Replace thermostat",
  "description": "Install and test the approved thermostat.",
  "serviceType": "thermostat",
  "status": "scheduled",
  "scheduledDate": "2026-09-16",
  "scheduledTime": "10:30",
  "durationMinutes": 60,
  "amount": 295,
  "customerId": 1,
  "technicianId": 4
}
```

Statuses: `scheduled`, `in-progress`, `completed`, `cancelled`.

Service types: `ac-repair`, `furnace-installation`, `maintenance`, `heat-pump`, `thermostat`, `diagnostic`.

Dates must be valid calendar dates between 2000 and 2100. Times use `HH:mm`, durations are 15–480 minutes, and amounts are $0–$100,000 with at most two decimal places. Customer and technician IDs must exist. Validation errors return `400` with `{ "message": "...", "errors": { "field": "reason" } }`.

## Metrics and storage

- Cleveland's `America/New_York` time zone is authoritative for today and the Monday–Sunday week.
- Today's jobs exclude cancelled jobs.
- Weekly revenue adds the amounts on completed jobs scheduled this week. It does not represent cash collected.
- Completion rate is completed jobs divided by all non-cancelled jobs this week, rounded to the nearest whole percent. An empty denominator gives zero.
- The status breakdown counts all jobs, across all dates.
- `schema.sql` creates the tables; `data.sql` seeds 12 customers, 15 jobs and four technicians using dates relative to the current Cleveland week.

This is a public, fictional demo with no authentication. H2 data exists only in memory: restarting or redeploying the API resets edits and restores the seed data. Use fictional data when trying it. A production admin tool would need authentication, authorization and persistent storage before handling real customer records.

## Official references

- [Spring Boot 3.5 system requirements](https://docs.spring.io/spring-boot/3.5/system-requirements.html)
- [OpenAI Responses API text generation](https://developers.openai.com/api/docs/guides/text)
- [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)
- [H2 date functions](https://www.h2database.com/html/functions.html)

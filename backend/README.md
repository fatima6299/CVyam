# Backend deployment notes

## CORS configuration

The server reads the `CORS_ORIGIN` environment variable (comma-separated list) to allow cross-origin requests. Example values:

- Local development:

```
CORS_ORIGIN=http://localhost:5173
```

- Production (Render example):

```
CORS_ORIGIN=https://cvyam-frontend.onrender.com
```

If you need to allow multiple origins, separate them with commas (no spaces):

```
CORS_ORIGIN=http://localhost:5173,https://cvyam-frontend.onrender.com
```

## How to set environment variable on Render

1. Open your service on Render.
2. Go to the "Environment" or "Environment Variables" section.
3. Add a new variable named `CORS_ORIGIN` with the appropriate value.
4. Redeploy the service.


## Local setup

Copy `.env.example` to `.env` and edit the `CORS_ORIGIN` value.

```
cp .env.example .env
# edit .env
```

Restart the backend after changes.

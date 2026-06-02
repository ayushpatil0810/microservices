# 📝 Microservices Blog

A full-stack blog application built from the ground up using a **microservices architecture**. Each feature is an independently deployable service communicating through a custom event bus. The entire app runs on **Kubernetes** with **Nginx Ingress** routing, and supports hot-reload development via **Skaffold**.

---

## 🏗️ Architecture Overview

```
                        ┌─────────────────────┐
                        │   Browser / Client  │
                        │   (posts.com)       │
                        └────────┬────────────┘
                                 │
                        ┌────────▼────────────┐
                        │   Nginx Ingress     │
                        │   (posts.com:80)    │
                        └──┬──────┬───────┬───┘
                           │      │       │
              ┌────────────▼─┐  ┌─▼────┐ ┌▼──────────┐
              │ posts-svc    │  │query │ │comments   │
              │ :4000        │  │:4002 │ │:4001      │
              └──────┬───────┘  └──┬───┘ └─────┬─────┘
                     │             │           │
                     └──────────┬──┘           │
                                │              │
                      ┌─────────▼──────────┐   │
                      │    Event Bus       │◄──┘
                      │    :4005           │
                      └─────────┬──────────┘
                                │
                      ┌─────────▼──────────┐
                      │   Moderation       │
                      │   :4003            │
                      └────────────────────┘
```

### Services

| Service | Port | Runtime | Description |
|---|---|---|---|
| **client** | 5173 | React + Vite | Frontend UI |
| **posts** | 4000 | Bun + Express | Create & store posts |
| **comments** | 4001 | Bun + Express | Create & manage comments per post |
| **query** | 4002 | Bun + Express | Aggregated read model (posts + comments) |
| **moderation** | 4003 | Bun + Express | Auto-moderates comments |
| **event-bus** | 4005 | Bun + Express | Broadcasts events to all services |

---

## 🔄 Event Flow

```
User creates post
  └─► POST /posts/create (posts-svc)
        └─► emit PostCreated
              └─► event-bus
                    └─► query-svc  (adds post to read model)

User creates comment
  └─► POST /posts/:id/comments (comments-svc)
        └─► emit CommentCreated (status: "pending")
              └─► event-bus
                    ├─► query-svc      (adds comment as "pending")
                    └─► moderation-svc
                          └─► emit CommentModerated (approved/rejected)
                                └─► event-bus
                                      └─► comments-svc
                                            └─► emit CommentUpdated
                                                  └─► event-bus
                                                        └─► query-svc (updates status)
```

> **Moderation rule:** Comments containing the word `orange` are automatically **rejected**. All others are **approved**.

---

## 🗂️ Project Structure

```
microservices/
├── client/              # React + Vite frontend (TypeScript)
│   ├── src/
│   │   └── components/  # PostList, CreatePost, CommentList, CreateComment
│   ├── Dockerfile
│   ├── .dockerignore
│   └── vite.config.ts
│
├── posts/               # Posts service (Bun + Express)
├── comments/            # Comments service (Bun + Express)
├── query/               # Query/read-model service (Bun + Express)
├── moderation/          # Moderation service (Bun + Express)
├── event-bus/           # Event bus service (Bun + Express)
│
├── infra/
│   └── k8s/             # Kubernetes manifests
│       ├── client-depl.yaml
│       ├── posts-depl.yaml
│       ├── comments-depl.yaml
│       ├── query-depl.yaml
│       ├── moderation-depl.yaml
│       ├── event-bus-depl.yaml
│       └── ingress-srv.yaml
│
├── skaffold.yaml        # Dev workflow (build + deploy + sync)
├── build-images.sh      # Build all Docker images (Linux/macOS)
└── run-all.ps1          # Run all services locally (Windows)
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with **Kubernetes enabled**
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/)
- [Skaffold](https://skaffold.dev/docs/install/) (for dev mode)
- [Bun](https://bun.sh/) (for running services locally)
- [Node.js](https://nodejs.org/) (for the client)

### 1. Add `posts.com` to your hosts file

On **Windows**, edit `C:\Windows\System32\drivers\etc\hosts` as Administrator:

```
127.0.0.1  posts.com
```

On **macOS/Linux**, edit `/etc/hosts`:

```
127.0.0.1  posts.com
```

### 2. Install the Nginx Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.3/deploy/static/provider/cloud/deploy.yaml
```

---

## ▶️ Running the App

### Option A — Kubernetes with Skaffold (Recommended)

Skaffold builds images, applies all K8s manifests, and syncs file changes automatically:

```bash
skaffold dev
```

Then open **http://posts.com** in your browser.

### Option B — Kubernetes (manual)

Build and push all images, then apply the manifests:

```bash
# Build & push each service image
docker build -t ayushpatil0810/client:latest ./client
docker push ayushpatil0810/client:latest
# ... repeat for posts, comments, query, moderation, event-bus

# Apply all manifests
kubectl apply -f ./infra/k8s/

# Verify everything is running
kubectl get pods
```

### Option C — Run locally (no Kubernetes)

> ⚠️ Services will not use Kubernetes DNS names in local mode — you may need to update service URLs in each `index.ts`.

**Windows (PowerShell):**
```powershell
.\run-all.ps1
```

**Linux/macOS (bash):**
```bash
# Start each service manually
cd event-bus && bun run dev &
cd posts     && bun run dev &
cd comments  && bun run dev &
cd moderation && bun run dev &
cd query     && bun run dev &
cd client    && npm run dev
```

---

## 🌐 API Reference

### Posts Service (`:4000`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/posts` | List all posts |
| `POST` | `/posts/create` | Create a new post |
| `POST` | `/events` | Receive events from event bus |

### Comments Service (`:4001`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/posts/:id/comments` | Get comments for a post |
| `POST` | `/posts/:id/comments` | Add a comment to a post |
| `POST` | `/events` | Receive events from event bus |

### Query Service (`:4002`)

| Method | Path | Description |
|---|---|---|
| `GET` | `/posts` | Get all posts with their comments |
| `POST` | `/events` | Receive events from event bus |

### Event Bus (`:4005`)

| Method | Path | Description |
|---|---|---|
| `POST` | `/events` | Broadcast an event to all services |
| `GET` | `/events` | Retrieve all past events |

---

## ☸️ Kubernetes Ingress Routing

All traffic to `posts.com` is routed by the Nginx Ingress controller:

| Path | Service | Port |
|---|---|---|
| `/posts/create` | `posts-clusterip-service` | 4000 |
| `/posts` | `query-service` | 4002 |
| `/posts/:id/comments` | `comments-service` | 4001 |
| `/*` (catch-all) | `client-service` | 5173 |

---

## 🐳 Docker Images

| Image | Docker Hub |
|---|---|
| `ayushpatil0810/client` | React frontend |
| `ayushpatil0810/posts` | Posts service |
| `ayushpatil0810/comments` | Comments service |
| `ayushpatil0810/query` | Query service |
| `ayushpatil0810/moderation` | Moderation service |
| `ayushpatil0810/event-bus` | Event bus |

> **Note for Windows users:** Always make sure a `.dockerignore` file excluding `node_modules` exists in each service directory before building images, to avoid broken symlinks inside Linux containers.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | Bun, Express 5, TypeScript |
| Containerization | Docker |
| Orchestration | Kubernetes (Docker Desktop) |
| Ingress | Nginx Ingress Controller |
| Dev Workflow | Skaffold |

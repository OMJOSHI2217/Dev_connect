# DevCollab Fullstack & Git Collaboration Platform Setup Guide

This guide walks you through connecting **DevCollab** to the **MySQL** database backend and running the **Integrated Git Collaboration System** directly on your own server.

---

## 🏗 Architecture Overview

DevCollab features a decoupled, fullstack architecture:
1. **Frontend (Vite + React + TypeScript)**: Runs on `http://localhost:5173` with proxy forwarding `/api` and `/git` requests to the backend.
2. **Backend Server (Express + TypeScript + mysql2)**: Runs on `http://localhost:5000` with connection pooling, healthcheck, REST APIs, and native Git execution.
3. **Real Git Version Control Engine**:
   - Repositories are stored as native server-managed Git bare repositories on disk in `server/git-repositories/:owner/:repo.git`.
   - **Git Smart HTTP Protocol**: Full Git-over-HTTP transport allowing `git clone`, `git push`, `git pull`, and `git fetch` from terminal, VS Code, and IDEs via `http://localhost:5000/git/:owner/:repo.git`.
   - **Web Code Editor & Commits**: Direct in-browser file creation, editing, and committing using Git plumbing (`hash-object`, `write-tree`, `commit-tree`, `update-ref`).
   - **Pull Request Engine**: Real branch diffing and automated server-side merges with conflict detection via `git merge-tree`.
4. **Database (MySQL 8.0 / MariaDB)**: Default database `devcollab_db` with relational tables for repositories, branches, pull requests, reviews, line-level comments, issues, and activities.
5. **Profile Picture Storage**:
   - `avatar` in `users` and `sender_avatar` in `messages` are defined as **`LONGTEXT`** (supporting up to 4GB).
   - Accommodates both high-resolution local file uploads (Base64 data URLs) and web image URLs without size limits.

---

## ⚙️ Configuration (`server/.env`)

The database connection is configured in `server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=devcollab_db
```

> **Note**: If using **XAMPP** or **WAMP**, the default user is `root` with an **empty** password (`DB_PASSWORD=`).

---

## 🚀 Step 1: Ensure MySQL Service is Running

Make sure your local MySQL service is started using any of the following:
- **XAMPP Control Panel**: Click **Start** on the `MySQL` module.
- **Windows Services**: Press `Win + R`, type `services.msc`, locate `MySQL` / `MySQL80`, and click **Start**.
- **Docker** (optional):
  ```bash
  docker run -d --name devcollab-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=devcollab_db mysql:8.0
  ```

---

## 📦 Step 2: Initialize Database & Git Schema

Run the automated database setup script from the root directory:

```bash
npm run db:setup
```

This creates all database tables:
- `users`: Developer profiles, skills, phone, and `avatar LONGTEXT` for profile pictures
- `repositories`: Git repository metadata, visibility, stars, default branch
- `repository_members`: Collaborator roles (owner, collaborator, reviewer)
- `repository_branches`: Branch metadata and protected branch rules
- `pull_requests`: PR workflow (Open, Merged, Closed), mergeable states, source/target branches
- `pull_request_reviews`: Review decisions (Approved, Changes Requested, Commented)
- `pull_request_comments`: Line-level code review comments and general discussion
- `issues`: Issue tracking, priorities (low, medium, high, urgent), assignees
- `issue_labels` & `issue_label_mappings`: Custom repository labels (bug, enhancement, etc.)
- `issue_comments`: Threaded discussions on issues
- `repository_activities`: Live event stream (pushes, branch creation, PR merges, issues)
- `projects`, `conversations`, `messages`, `project_history`

---

## 🌱 Step 3: Seed Real Git Repositories & Data

Initialize disk repositories and seed initial files, branches, PRs, and issues:

```bash
npm run db:seed
```

What gets seeded:
- **4 Real Git Repositories** initialized on server disk:
  1. `alexrivera_dev/devpulse-engine.git`: Go + eBPF telemetry engine with branches `main`, `feature/theme-tokens`, `feature/ebpf-grpc`, Pull Request #1 with line code reviews, and Issues #1 & #2.
  2. `elena_codes/neural-canvas-studio.git`: Visual AI prompt engineering canvas repository.
  3. `marcus_cloud/cloudkube-mesh.git`: Kubernetes mTLS service mesh repository.
  4. `david_sys/devsync-cli.git`: Rust terminal pair programming CLI repository.
- **10 Developers** with complete profiles and pictures.
- **Connection Requests**, **Team Channels**, **Messages**, and **Project Portfolio History**.

---

## ⚡ Step 4: Start the Backend Server

Start the backend API & Git server:

```bash
npm run server
```

The server runs on `http://localhost:5000` and serves:
- Full Web App (served from `dist/`)
- API Health Check: `http://localhost:5000/api/health`
- API Dashboard: `http://localhost:5000/api`
- Git Smart HTTP Transport: `http://localhost:5000/git/:owner/:repo.git`

---

## 💻 Step 5: Start the Frontend Application

In a separate terminal, start the frontend:

```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🛠 Using Git from Terminal or VS Code

You can interact with your server-hosted repositories using the standard Git CLI:

```bash
# 1. Clone any project repository
git clone http://localhost:5000/git/alexrivera_dev/devpulse-engine.git
cd devpulse-engine

# 2. Check branches and commit history
git branch -a
git log --oneline

# 3. Create a feature branch and commit
git checkout -b feature/my-cool-feature
echo "console.log('Hello DevCollab');" >> index.js
git add index.js
git commit -m "Add cool feature"

# 4. Push directly to your DevCollab server
git push origin feature/my-cool-feature
```

The new branch and commits will immediately appear in the **DevCollab** web UI under **Branches**, **Commits**, and ready to open a **Pull Request**!

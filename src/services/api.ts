// Frontend MySQL API Client for DevCollab

const API_BASE = '/api';

export async function checkBackendHealth(): Promise<{ status: string; mysqlConnected: boolean } | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  // Auth
  async login(email: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProfile(id: string, updates: any) {
    const res = await fetch(`${API_BASE}/auth/profile/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async updateAvatar(id: string, avatar: string) {
    const res = await fetch(`${API_BASE}/auth/profile/${encodeURIComponent(id)}/avatar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar })
    });
    return res.json();
  },

  // Developers
  async getDevelopers(params?: { search?: string; role?: string; location?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/developers?${query}`);
    return res.json();
  },

  // Connections
  async getConnectionRequests(userId: string) {
    const res = await fetch(`${API_BASE}/connections/requests?userId=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async sendConnectionRequest(data: { fromUserId: string; toUserId: string; message?: string; projectInterest?: string }) {
    const res = await fetch(`${API_BASE}/connections/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateConnectionRequest(id: string, status: 'accepted' | 'declined') {
    const res = await fetch(`${API_BASE}/connections/requests/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },

  async createProject(project: any) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    return res.json();
  },

  async completeProject(projectId: string, liveUrl?: string) {
    const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(projectId)}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liveUrl })
    });
    return res.json();
  },

  async getProjectHistory() {
    const res = await fetch(`${API_BASE}/projects/history/all`);
    return res.json();
  },

  // Messages & Project Chats
  async getConversations(userId: string) {
    const res = await fetch(`${API_BASE}/messages/conversations?userId=${encodeURIComponent(userId)}`);
    return res.json();
  },

  async getMessages(conversationId: string) {
    const res = await fetch(`${API_BASE}/messages/conversations/${encodeURIComponent(conversationId)}/messages`);
    return res.json();
  },

  async sendMessage(data: any) {
    const res = await fetch(`${API_BASE}/messages/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async assignProjectRole(data: { projectId: string; userId: string; newRole: string; senderName?: string }) {
    const res = await fetch(`${API_BASE}/messages/assign-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Real Git Collaboration API
  git: {
    async getRepositories(params?: { search?: string; projectId?: string; userId?: string }) {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/git/repos?${query}`);
      return res.json();
    },

    async getRepository(owner: string, repo: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
      return res.json();
    },

    async createRepository(data: any) {
      const res = await fetch(`${API_BASE}/git/repos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async updateRepository(id: string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async addCollaborator(repoId: string, userId: string, role: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(repoId)}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      });
      return res.json();
    },

    async removeCollaborator(repoId: string, userId: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(repoId)}/collaborators/${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
      return res.json();
    },

    // Tree, Files & Readme
    async getTree(owner: string, repo: string, branch = 'main', path = '') {
      const query = new URLSearchParams({ branch, path }).toString();
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tree?${query}`);
      return res.json();
    },

    async getFile(owner: string, repo: string, branch = 'main', path: string) {
      const query = new URLSearchParams({ branch, path }).toString();
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/blob?${query}`);
      return res.json();
    },

    async getReadme(owner: string, repo: string, branch = 'main') {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme?branch=${encodeURIComponent(branch)}`);
      return res.json();
    },

    // Branches
    async getBranches(owner: string, repo: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`);
      return res.json();
    },

    async createBranch(owner: string, repo: string, data: { newBranch: string; baseBranch?: string; userId?: string }) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async deleteBranch(owner: string, repo: string, branch: string, userId?: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches/${encodeURIComponent(branch)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      return res.json();
    },

    // Commits & Web Editor
    async getCommits(owner: string, repo: string, branch = 'main', limit = 50) {
      const query = new URLSearchParams({ branch, limit: String(limit) }).toString();
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?${query}`);
      return res.json();
    },

    async getCommitDetails(owner: string, repo: string, hash: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${encodeURIComponent(hash)}`);
      return res.json();
    },

    async createWebCommit(owner: string, repo: string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    // Pull Requests
    async getPullRequests(owner: string, repo: string, status = 'all') {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls?status=${encodeURIComponent(status)}`);
      return res.json();
    },

    async getPullRequest(owner: string, repo: string, number: number | string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${encodeURIComponent(number)}`);
      return res.json();
    },

    async getPullRequestDiff(owner: string, repo: string, number: number | string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${encodeURIComponent(number)}/diff`);
      return res.json();
    },

    async createPullRequest(owner: string, repo: string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async submitReview(owner: string, repo: string, number: number | string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${encodeURIComponent(number)}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async addComment(owner: string, repo: string, number: number | string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${encodeURIComponent(number)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async mergePullRequest(owner: string, repo: string, number: number | string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${encodeURIComponent(number)}/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async closePullRequest(owner: string, repo: string, number: number | string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${encodeURIComponent(number)}/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    // Issues
    async getIssues(owner: string, repo: string, params?: { status?: string; priority?: string }) {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?${query}`);
      return res.json();
    },

    async getIssue(owner: string, repo: string, number: number | string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${encodeURIComponent(number)}`);
      return res.json();
    },

    async createIssue(owner: string, repo: string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async updateIssue(owner: string, repo: string, number: number | string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${encodeURIComponent(number)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async addIssueComment(owner: string, repo: string, number: number | string, data: any) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues/${encodeURIComponent(number)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },

    async getLabels(owner: string, repo: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/labels`);
      return res.json();
    },

    // Activity Feed
    async getActivities(owner: string, repo: string) {
      const res = await fetch(`${API_BASE}/git/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/activities`);
      return res.json();
    }
  }
};

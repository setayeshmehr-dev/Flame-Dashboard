export const kanbanColumns = [
  {
    id: "backlog",
    title: "Backlog",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "in-review",
    title: "In Review",
  },
  {
    id: "done",
    title: "Done",
  },
]

export const kanbanTasks = [
  {
    id: "task-1",
    column: "backlog",
    category: "designux",
    title: "Design new onboarding flow",
    description:
      "Create wireframes and high-fidelity mockups for the updated user onboarding experience targeting a 20% improvement in activation rate.",
    priority: "High",
    date: "Mar 5",
    assignee: "SC",
  },
  {
    id: "task-2",
    column: "backlog",
    category: "research",
    title: "Evaluate third-party analytics providers",
    description:
      "Compare Mixpanel, Amplitude, and PostHog for our product analytics needs. Prepare a recommendation document.",
    priority: "Medium",
    date: "",
    assignee: "JW",
  },
  {
    id: "task-3",
    column: "backlog",
    category: "i18n",
    title: "Add multi-language support to email templates",
    description:
      "Implement i18n for transactional emails — at minimum English, Spanish, and French.",
    priority: "Low",
    date: "Apr 1",
    assignee: "",
  },
  {
    id: "task-4",
    column: "backlog",
    category: "backendsecurity",
    title: "Audit API rate-limiting configuration",
    description:
      "Review current rate limits across all public endpoints and adjust for the upcoming enterprise tier launch.",
    priority: "Medium",
    date: "",
    assignee: "PP",
  },

  {
    id: "task-5",
    column: "in-progress",
    category: "backendbilling",
    title: "Implement Stripe subscription webhooks",
    description:
      "Handle subscription.created, updated, and deleted events to keep billing status in sync.",
    priority: "High",
    date: "Feb 25",
    assignee: "AR",
  },
  {
    id: "task-6",
    column: "in-progress",
    category: "frontend",
    title: "Build dashboard activity feed component",
    description:
      "Real-time feed showing team activity — deployments, comments, and status changes.",
    priority: "Medium",
    date: "",
    assignee: "SC",
  },
  {
    id: "task-7",
    column: "in-progress",
    category: "infra",
    title: "Migrate user avatars to CDN",
    description:
      "Move avatar storage from local disk to Cloudflare R2 with automatic resizing.",
    priority: "Low",
    date: "Mar 10",
    assignee: "JW",
  },

  {
    id: "task-8",
    column: "in-review",
    category: "securityfrontend",
    title: "Add role-based access control to team settings",
    description:
      "Restrict settings pages based on user roles (owner, admin, member). Includes middleware and UI guards.",
    priority: "High",
    date: "Feb 20",
    assignee: "PP",
  },
  {
    id: "task-9",
    column: "in-review",
    category: "backendperformance",
    title: "Optimize SQL queries for the reports page",
    description:
      "Several queries on the monthly report exceed 500ms. Add proper indexes and refactor N+1 patterns.",
    priority: "Medium",
    date: "",
    assignee: "AR",
  },

  {
    id: "task-10",
    column: "done",
    category: "devops",
    title: "Set up CI/CD pipeline with GitHub Actions",
    description:
      "Automated lint, test, build and deploy steps for staging and production environments.",
    priority: "Medium",
    date: "",
    assignee: "JW",
  },
  {
    id: "task-11",
    column: "done",
    category: "frontendux",
    title: "Implement dark mode theme toggle",
    description:
      "System/light/dark mode support using next-themes with smooth transitions.",
    priority: "Low",
    date: "",
    assignee: "SC",
  },
  {
    id: "task-12",
    column: "done",
    category: "docs",
    title: "Create API documentation with OpenAPI spec",
    description:
      "Write Swagger/OpenAPI 3.1 spec for all public endpoints and publish to docs site.",
    priority: "High",
    date: "Feb 15",
    assignee: "PP",
  },
]
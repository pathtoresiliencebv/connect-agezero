export type AppCategory =
  | "Productivity"
  | "Communication"
  | "CRM"
  | "Marketing"
  | "Developer"
  | "Analytics"
  | "Storage"
  | "AI";

export interface AppEntry {
  /** Unique key — also used as Nango `providerConfigKey` */
  id: string;
  name: string;
  description: string;
  icon: string;
  iconBg?: string;
  category: AppCategory;
  /** Auth methods offered by Nango for this provider */
  authModes: ("OAUTH2" | "OAUTH1" | "API_KEY" | "BASIC" | "APP" | "MCP")[];
  /** Sample call shape for the playground */
  sampleMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  sampleEndpoint: string;
  sampleBody?: Record<string, unknown>;
  docsUrl?: string;
}

export const apps: AppEntry[] = [
  {
    id: "gmail",
    name: "Gmail",
    description: "Gmail is an email service that sends and receives messages.",
    icon: "M",
    iconBg: "#EA4335",
    category: "Communication",
    authModes: ["OAUTH2"],
    sampleMethod: "POST",
    sampleEndpoint: "/gmail/v1/users/me/messages/send",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description:
      "Google Calendar is a scheduling tool that tracks events and appointments.",
    icon: "📅",
    iconBg: "#4285F4",
    category: "Productivity",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/calendar/v3/calendars/primary/events",
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description:
      "Google Docs is a word processor for creating and editing documents online.",
    icon: "📝",
    iconBg: "#4285F4",
    category: "Productivity",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/docs/v1/documents",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description:
      "Google Drive is a cloud storage service for storing and sharing files.",
    icon: "▲",
    iconBg: "#FBBC04",
    category: "Storage",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/drive/v3/files",
  },
  {
    id: "notion",
    name: "Notion",
    description:
      "Notion is a workspace for notes, docs, wikis, and project management.",
    icon: "N",
    iconBg: "#FFFFFF",
    category: "Productivity",
    authModes: ["OAUTH2", "API_KEY"],
    sampleMethod: "GET",
    sampleEndpoint: "/v1/users/me",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description:
      "Google Sheets is a spreadsheet tool that organizes data in rows and columns.",
    icon: "📊",
    iconBg: "#0F9D58",
    category: "Productivity",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/sheets/v4/spreadsheets",
  },
  {
    id: "slack",
    name: "Slack",
    description:
      "Slack is a messaging app where teams can chat and share files.",
    icon: "#",
    iconBg: "#4A154B",
    category: "Communication",
    authModes: ["OAUTH2"],
    sampleMethod: "POST",
    sampleEndpoint: "/chat.postMessage",
    sampleBody: { channel: "C0123456", text: "Hello from Agezero Connect" },
  },
  {
    id: "google-search-console",
    name: "Google Search Console",
    description:
      "Google Search Console monitors website performance in Google Search results.",
    icon: "🔎",
    iconBg: "#4285F4",
    category: "Analytics",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/webmasters/v3/sites",
  },
  {
    id: "outlook",
    name: "Outlook",
    description:
      "Outlook is an email and calendar service for managing messages, contacts, and schedules.",
    icon: "O",
    iconBg: "#0078D4",
    category: "Communication",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/me/messages",
  },
  {
    id: "airtable",
    name: "Airtable",
    description:
      "Airtable is a spreadsheet-database hybrid that stores information in tables with rows and columns.",
    icon: "A",
    iconBg: "#FCB400",
    category: "Productivity",
    authModes: ["OAUTH2", "API_KEY"],
    sampleMethod: "GET",
    sampleEndpoint: "/v0/meta/bases",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description:
      "HubSpot is a platform that tracks customer interactions and manages sales pipelines.",
    icon: "🧡",
    iconBg: "#FF7A59",
    category: "CRM",
    authModes: ["OAUTH2", "API_KEY"],
    sampleMethod: "GET",
    sampleEndpoint: "/crm/v3/objects/contacts",
  },
  {
    id: "youtube",
    name: "YouTube",
    description:
      "YouTube is a video sharing platform for uploading, viewing, and managing video content.",
    icon: "▶",
    iconBg: "#FF0000",
    category: "Marketing",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/youtube/v3/channels?part=snippet&mine=true",
  },
  {
    id: "google-analytics-admin",
    name: "Google Analytics Admin",
    description:
      "Google Analytics Admin manages account settings, properties, and user permissions.",
    icon: "📈",
    iconBg: "#F9AB00",
    category: "Analytics",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/analyticsadmin/v1beta/accounts",
  },
  {
    id: "google-analytics-data",
    name: "Google Analytics Data",
    description:
      "Google Analytics Data provides access to website traffic and user behavior metrics.",
    icon: "📈",
    iconBg: "#E37400",
    category: "Analytics",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/v1beta/properties",
  },
  {
    id: "jira",
    name: "Jira",
    description:
      "Jira is a project management tool for tracking issues and agile development.",
    icon: "J",
    iconBg: "#0052CC",
    category: "Developer",
    authModes: ["OAUTH2", "API_KEY"],
    sampleMethod: "GET",
    sampleEndpoint: "/rest/api/3/search",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description:
      "Google Ads is an advertising platform for creating and managing online ad campaigns.",
    icon: "G",
    iconBg: "#FBBC04",
    category: "Marketing",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/v17/customers",
  },
  {
    id: "calendly",
    name: "Calendly",
    description:
      "Calendly is a scheduling tool that simplifies meeting bookings and appointment management.",
    icon: "C",
    iconBg: "#006BFF",
    category: "Productivity",
    authModes: ["OAUTH2", "API_KEY"],
    sampleMethod: "GET",
    sampleEndpoint: "/users/me",
  },
  {
    id: "google-slides",
    name: "Google Slides",
    description:
      "Google Slides is a presentation tool for creating and sharing slideshows.",
    icon: "S",
    iconBg: "#FBBC04",
    category: "Productivity",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/slides/v1/presentations",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Code hosting, pull requests, issues, and Actions.",
    icon: "🐙",
    iconBg: "#1B1F23",
    category: "Developer",
    authModes: ["OAUTH2"],
    sampleMethod: "GET",
    sampleEndpoint: "/user",
  },
  {
    id: "linear",
    name: "Linear",
    description: "Issue tracking for high-velocity product teams.",
    icon: "L",
    iconBg: "#5E6AD2",
    category: "Productivity",
    authModes: ["OAUTH2", "API_KEY"],
    sampleMethod: "POST",
    sampleEndpoint: "/issues",
    sampleBody: { teamId: "REPLACE", title: "New issue" },
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payments, customers, subscriptions, and payouts.",
    icon: "S",
    iconBg: "#635BFF",
    category: "Developer",
    authModes: ["API_KEY"],
    sampleMethod: "GET",
    sampleEndpoint: "/v1/customers",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude via the Messages API.",
    icon: "✴",
    iconBg: "#D97757",
    category: "AI",
    authModes: ["API_KEY"],
    sampleMethod: "POST",
    sampleEndpoint: "/v1/messages",
    sampleBody: {
      model: "claude-3-5-sonnet-latest",
      max_tokens: 256,
      messages: [{ role: "user", content: "Hello from Agezero Connect" }],
    },
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Chat, completions, embeddings, and image generation.",
    icon: "✺",
    iconBg: "#10A37F",
    category: "AI",
    authModes: ["API_KEY"],
    sampleMethod: "POST",
    sampleEndpoint: "/v1/chat/completions",
    sampleBody: {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello from Agezero Connect" }],
    },
  },
];

export const categoryLabels: AppCategory[] = [
  "Productivity",
  "Communication",
  "CRM",
  "Marketing",
  "Developer",
  "Analytics",
  "Storage",
  "AI",
];
import {
  IconDashboard,
  IconFile,
  IconHelp,
  IconMessage,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

const route = "admin";

export const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: `/${route}`,
      icon: IconDashboard,
    },
    {
      title: "Documents",
      url: `/${route}/documents`,
      icon: IconFile,
    },
    {
      title: "Comments",
      url: `/${route}/comments`,
      icon: IconMessage,
    },
    {
      title: "Users",
      url: `/${route}/users`,
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: `/${route}/setting`,
      icon: IconSettings,
    },
    {
      title: "Help",
      url: `/${route}/help`,
      icon: IconHelp,
    },
  ],
};

export const routeTitles: Record<string, string> = {
  [`/${route}`]: "Dashboard Overview",
  [`/${route}/documents`]: "Document Management",
  [`/${route}/comments`]: "Comment Management",
  [`/${route}/users`]: "User Management",
  [`/${route}/setting`]: "Configuration",
  [`/${route}/help`]: "Help & Support",
};
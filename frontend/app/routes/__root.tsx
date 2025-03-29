// app/routes/__root.tsx
import type { ReactNode } from "react";
import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import "../styles/home.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Inventory Management Application",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="navigation-container">
          <Link
            to="/"
            activeProps={{
              className: "navigation-link navigation-link-active",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/inventories"
            activeProps={{
              className: "navigation-link navigation-link-active",
            }}
          >
            Inventories
          </Link>{" "}
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

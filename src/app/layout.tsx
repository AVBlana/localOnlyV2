"use client";

import { GlobalStyle } from "@/styles/globalStyles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <GlobalStyle />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

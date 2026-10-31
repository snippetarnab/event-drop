import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Event-drop — Event Planning & Operations',
  description: 'AI-assisted event planning, budget tracking, vendor execution, and schedules for weddings, birthdays, and community events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className="min-h-screen text-[#18181B] bg-[#EDECE7] antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

/** 
 * @author Zachary Kornbluth <github.com/zkornbluth>
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: 'Fantrax Cap Tracker',
  icons: {
    icon: `${basePath}baseball.png`, // This lets the tab icon work both locally and hosted via GitHub Pages
  }
}

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900">{children}</body>
    </html>
  )
}

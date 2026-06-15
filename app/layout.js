import './globals.css';

export const metadata = {
  title: 'Google Ads Setup Guide | Rithaler Consulting',
  description: 'Get a custom Google Search Ad setup guide built around your business.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

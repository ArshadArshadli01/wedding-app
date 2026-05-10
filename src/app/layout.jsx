import "./globals.css";

export const metadata = {
  title: "Vasif & Aygün | Toy Günü Dəvətnaməsi",
  description: "Vasif & Aygün | Toy Günü Dəvətnaməsi",
  manifest: "/manifest.json",
  icons: {
    icon: "/AMPage.png",
    apple: "/logo192.png",
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@300;400&family=Cormorant+Garamond:ital,wght@1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

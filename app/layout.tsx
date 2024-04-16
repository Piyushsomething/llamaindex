import "./globals.css";
import { Poppins } from "next/font/google";

const publicSans = Poppins({ subsets: ["latin"], weight:["300"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pilnu PDF CHATBOT</title>
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col p-4 md:p-12 h-[100vh]">{children}</div>
      </body>
    </html>
  );
}

import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import { AuthenticationProvider } from "@/context/Authentication";
import { ProfileProvider } from "@/context/ProfileContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Talentro | Skill Exchange Platform",
  description:
    "Learn new skills and teach others - A platform for skill exchange and growth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthenticationProvider>
          <ProfileProvider>
            {children}
            <ToastContainer />
          </ProfileProvider>
        </AuthenticationProvider>
      </body>
    </html>
  );
}

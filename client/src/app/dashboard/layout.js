import { ProfileProvider } from "@/context/ProfileContext";
import DashboardNavbar from "./components/DashboardNavbar";
export const metadata = {
  title: "Talentro | Dashboard",
  description: "Manage your skills and exchanges",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
}

import { ProfileView } from "@/components/profile/ProfileView";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProfilePage() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading
  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">Loading...</div>
    );
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <ProfileView />
    </div>
  );
}

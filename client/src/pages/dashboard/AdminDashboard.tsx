import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (user && user.role !== "admin") {
      // Redirect non-admin users to regular dashboard
      navigate("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by the redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrator</CardTitle>
              <CardDescription>
                {user.firstName} {user.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Role: <span className="font-medium capitalize">{user.role}</span></p>
              <p>Email: {user.email}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Platform statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Total Users: <span className="font-medium">0</span></li>
                <li>Total Products: <span className="font-medium">0</span></li>
                <li>Pending Orders: <span className="font-medium">0</span></li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="text-primary hover:underline cursor-pointer">Manage Users</li>
                <li className="text-primary hover:underline cursor-pointer">Manage Products</li>
                <li className="text-primary hover:underline cursor-pointer">View Orders</li>
                <li className="text-primary hover:underline cursor-pointer">System Settings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
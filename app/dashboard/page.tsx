"use client"
import { useAuth } from "@/lib/auth-context";
import StudentDashboardPage from "./(student)/home"
import AdminDashboardPage from "./(admin)/home";

export default function DashboardPage() {
    const {user } = useAuth();

    const role = user?.role

    if (role === "student") return <StudentDashboardPage />
    if(role === "admin") return <AdminDashboardPage />

    return <div className="container mx-auto p-4 md:p-6 pb-20 md:pb-6 space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>Your role "{role}" does not have a dashboard implemented yet.</p>
    </div>
}
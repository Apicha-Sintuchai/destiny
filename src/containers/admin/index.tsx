"use client";

import { useState } from "react";
import { Users, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminUserTab } from "./users.tab";
import { AdminSettingTab } from "./settings.tab";

export const AdminContainer = () => {
    const [activeTab, setActiveTab] = useState<"users" | "settings">("users");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen">
            <aside
                className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-[var(--sidebar)] border-r  overflow-hidden`}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === "users"
                                    ? "bg-blue-50 text-blue-600"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <Users size={20} />
                            <span className="font-medium">Users</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                activeTab === "settings"
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Settings size={20} />
                            <span className="font-medium">Settings</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-[var(--card)] border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                        <h2 className="text-xl font-semibold">
                            {activeTab === "users" ? "User Management" : "Settings"}
                        </h2>
                    </div>
                </header>

                <div className="p-6">
                    {activeTab === "users" && (
                        <AdminUserTab />
                    )}

                    {activeTab === "settings" && (
                        <AdminSettingTab />
                    )}
                </div>
            </main>
        </div>
    );
};

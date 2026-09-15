'use client'
import React from 'react'
import Header from "../../components/layout/header"
import Sidebar from "../../components/layout/sidebar"
import SearchModal from '@/components/layout/searchModal'
import Appearance from '@/components/layout/appearance'
import TopNav from "@/components/layout/topNav"
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { NotificationProvider } from "@/context/notificationContext";

import { useState, useEffect } from "react";

export default function DashboardLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isCollapsed = isDesktop && collapsed;
  const [searchOpen, setSearchOpen] = useState(false)
  const [appearanceOpen, setAppearanceOpen] = useState(false)
  const [layoutMode, setLayoutMode] = useState(null)

  useEffect(() => {
    const handlePreferencesChange = () => {
      const savedLayout = localStorage.getItem("layoutMode") || "sidebar"
      const savedColor = localStorage.getItem("colorPreset") || "red"

      setLayoutMode(savedLayout)
      document.documentElement.dataset.colorPreset = savedColor
    }

    window.addEventListener("preferencesChange", handlePreferencesChange)

    return () => {
      window.removeEventListener("preferencesChange", handlePreferencesChange)
    }
  }, [])

  useEffect(() => {
    const savedLayout = localStorage.getItem("layoutMode") || "sidebar"
    const savedColor = localStorage.getItem("colorPreset") || "red"

    document.documentElement.dataset.colorPreset = savedColor
    setLayoutMode(savedLayout)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!layoutMode) {
    return <div className="min-h-screen bg-background" />
  }

  const changeLayout = (value) => {
    setLayoutMode(value)
    localStorage.setItem("layoutMode", value)
  }
  return (
    <NotificationProvider>
      <div className="flex min-h-screen h-dvh  overflow-hidden">
        {layoutMode === "sidebar" && (
          <Sidebar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
            collapsed={isCollapsed} 
            setCollapsed={setCollapsed}
          />
        )}

        {/* Mobile overlay */}
        <div 
          onClick={() => setSidebarOpen(false)} 
          className={`fixed inset-0 transition-opacity duration-300 z-40 bg-black/40 lg:hidden ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Main area — flex-col + overflow-hidden */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-500">

          <Header 
            setSidebarOpen={setSidebarOpen} 
            setSearchOpen={setSearchOpen} 
            setAppearanceOpen={setAppearanceOpen} 
            layoutMode={layoutMode} 
          />

          {layoutMode === "topnav" && (
            <TopNav />
          )}

          {/* Main content — flex-1 + overflow-y-auto + pb-safe */}
          <main
            className={`flex-1 overflow-y-auto p-4 sm:p-6 pb-24 sm:pb-6 ${layoutMode === "topnav" ? "mt-12" : ""}`}>
            {children}
          </main>

        </div>

        {searchOpen && (
          <SearchModal setSearchOpen={setSearchOpen} />
        )}

        {appearanceOpen && (
          <Appearance
            layoutMode={layoutMode}
            setLayoutMode={changeLayout}
            setAppearanceOpen={setAppearanceOpen}
          />
        )}

      </div>
    </NotificationProvider>
  );
}
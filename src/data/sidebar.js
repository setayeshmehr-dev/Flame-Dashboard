// this is sidebar.js in data foulder

import { 
    LayoutDashboard, 
    ChartColumn, 
    Handshake,  
    ChartNoAxesCombined, 
    ShoppingCart, 
    Package, 
    Users, 
    FileText, 
    Mail, 
    MessageSquare, 
    Kanban, 
    Calendar, 
    ListChecks, 
    UserRoundCog, 
    Bell, 
    Settings, 
    CircleQuestionMark, 
    } from "lucide-react";

export const sidebarGroups = [
    {
        group: "OVERVIEW",
        items: [
            {title: "Dashboard", icon: LayoutDashboard, href: "/dashboard"},
            {title: "Analytics", icon: ChartColumn, href: "/analytics"},
            {title: "CRM", icon: Handshake, href: "/crm"},
            {title: "Charts", icon: ChartNoAxesCombined, href: "/charts"}
        ]
    },

    {
        group: "COMMERCE",
        items: [
            {title: "Orders", icon: ShoppingCart, href: "/orders"},
            {title: "Products", icon: Package, href: "/products"}
        ]
    },

    {
        group: "APPS",
        items: [
            {title: "Chat", icon: MessageSquare, href: "/chat"},
            {title: "Kanban", icon: Kanban, href: "/kanban"},
        ]
    },

    {
        group: "SYSTEM",
        items: [
            {title: "Notification", icon: Bell, href: "/notification"},
            {title: "Settings", icon: Settings, href: "/settings"},
            {title: "Help & Support", icon: CircleQuestionMark, href: "/helpAndSupport"}
        ]

    },
];
import { ChevronRight, ChevronLeft, Flame, X, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

import React from 'react'
import Link from "next/link";
import SidebarGroup from "./sidebarGroup";
import { sidebarGroups } from "@/data/sidebar";

export default function Sidebar({ sidebarOpen, setSidebarOpen, setCollapsed, collapsed }) {

  return (
    <aside
      style={{ width: collapsed ? "75px" : "256px" }}
      className={`
        fixed lg:sticky z-50 transition-all duration-500 lg:transition-none lg:top-0 lg:left-0
        h-dvh lg:h-screen border-r flex flex-col border-border bg-background 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
    >
      {/* Collapse button (desktop only) */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        variant="ghost"
        className="w-6! h-6 rounded-full hidden lg:flex bg-background border p-0 border-border absolute z-50 -right-3 top-20"
      >
        {collapsed ? (
          <ChevronRight className="size-3" />
        ) : (
          <ChevronLeft className="size-3" />
        )}
      </Button>

      {/* ─── Logo — فیکس بالا ─── */}
      <div className={`
        h-16 px-4 flex items-center border-b border-border shrink-0
        ${collapsed ? "justify-center" : "justify-start"}
      `}>
        <div className="flex bg-linear-to-br from-primary to-secondary from-25% to-85% w-9 h-9 items-center justify-center rounded-lg shrink-0">
          <Flame className="size-4.5 text-white" />
        </div>
        <div className={`
          flex flex-col ps-2.5 transition-all duration-300 overflow-hidden
          ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
        `}>
          <span className="bg-linear-to-br from-primary from-25% to-secondary to-85% bg-clip-text text-transparent text-sm font-semibold whitespace-nowrap">
            Flame
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">DASHBOARD</span>
        </div>
      </div>

      {/* Close button (mobile only) */}
      <Button
        onClick={() => setSidebarOpen(false)}
        variant="ghost"
        size="icon"
        className="absolute top-4 lg:hidden right-2.5"
      >
        <X />
      </Button>

      {/* ─── Navigation — اسکرول‌خور ─── */}
      <ScrollArea className="group/scroll flex-1 min-h-0 w-full">
        <div className={`py-2 ${collapsed ? "px-0" : "px-2"}`}>
          <Accordion multiple defaultValue={sidebarGroups.map((group) => group.group)}>
            {sidebarGroups.map((group) => (
              <SidebarGroup
                key={group.group}
                collapsed={collapsed}
                group={group.group}
                items={group.items}
              />
            ))}
          </Accordion>
        </div>
      </ScrollArea>

      {/* ─── Footer — فیکس پایین ─── */}
      <div className={`
        border-t border-border px-3 py-3 flex items-center gap-1 shrink-0
        ${collapsed ? "justify-center" : "justify-start"}
      `}>
        <Link
          href="/profile"
          className="hover:bg-muted cursor-pointer flex items-center justify-center px-2 py-2 rounded-[15px] min-w-0"
        >
          <Avatar className="shrink-0">
            <AvatarFallback className="bg-linear-to-br from-primary from-25% to-85% to-secondary font-semibold text-primary-foreground text-xs">
              AS
            </AvatarFallback>
          </Avatar>
          <div className={`
            flex flex-col ps-2.5 transition-all duration-300 overflow-hidden
            ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
          `}>
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">
              Amirali Setayeshmehr
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">Admin</span>
          </div>
        </Link>

        <Link
          href="/"
          className={`
            hover:bg-muted cursor-pointer w-8 h-8 items-center justify-center rounded-full shrink-0
            ${collapsed ? "hidden" : "flex"}
          `}
        >
          <LogOut className="size-4 text-muted-foreground" />
        </Link>
      </div>
    </aside>
  )
}
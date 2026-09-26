"use client";

import { useState } from "react";
import { CheckCheck, Inbox } from "lucide-react";

import { useNotifications } from "@/context/notificationContext";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "unread") {
      return notification.unread;
    }

    if (activeFilter === "read") {
      return !notification.unread;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Notifications</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex  gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Notifications
          </h1>

          <p className="text-muted-foreground">
            Stay up to date with your latest alerts and messages.
          </p>
        </div>

        
      </div>

      {/* Notifications Card */}
      <Card>
        {/* Card Header */}
        <div className="flex w-full flex-col px-6 gap-4  items-center justify-center">
          <div className="w-full">
            <div className="flex items-center justify-start gap-3">
              <div>
                <h2 className="font-semibold">All Notifications</h2>

                <p className="text-sm text-muted-foreground">
                  {unreadCount} unread
                </p>
              </div>

              {unreadCount > 0 && (
                <Badge className="bg-primary w-16 h-5">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row w-full justify-between gap-2 items-start">
            <div className="flex w-fit items-center rounded-full border p-1">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                All
              </Button>

              <Button
                variant={activeFilter === "unread" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter("unread")}
              >
                Unread
              </Button>

              <Button
                variant={activeFilter === "read" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter("read")}
              >
                Read
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          </div>
        </div>

        <Separator />

        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <div>
              {filteredNotifications.map((notification, index) => {
                const Icon = notification.icon;

                return (
                  <div key={notification.id}>
                    <div
                      onClick={() => markAsRead(notification.id)}
                      className={`flex gap-4 px-6 py-5 transition-colors ${
                        notification.unread
                          ? "bg-primary/5"
                          : "bg-transparent"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          notification.unread
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`text-sm ${
                                  notification.unread
                                    ? "font-semibold"
                                    : "font-medium"
                                }`}
                              >
                                {notification.title}
                              </h3>

                              {notification.unread && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                              )}
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {notification.description}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {index < filteredNotifications.length - 1 && (
                      <Separator />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="font-medium">No notifications</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                There are no notifications in this category.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
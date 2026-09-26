'use client';

import { Menu, CheckCheck, Search, LogOut, Settings, Bell, Palette, Moon, Sun, User, Flame} from "lucide-react";

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback} from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

import { useEffect, useState } from "react";
import { useTheme } from "next-themes"
import Link from "next/link";

import { useNotifications } from "@/context/notificationContext";



export default function Header({setSidebarOpen , setSearchOpen, setAppearanceOpen, layoutMode}) {
    const [darkMode, setDarkMode] = useState(false)
    const { notifications, unreadCount, markAllAsRead} = useNotifications();
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
    setMounted(true);
    }, []);
  return (
    <header className="w-full h-16 px-6 flex bg-background/80 backdrop-blur-lg backdrop-saturate-180 items-center justify-between border-b border-border z-30 sticky top-0 left-0 right-0 " >
        <div className=" flex gap-2.5 ">
            <Button onClick={()=> setSidebarOpen(true)} variant="ghost" size="icon" className=" lg:hidden rounded-xl">
                <Menu className="size-5" />
            </Button>

            {layoutMode === "topnav" && (
                <div className={` flex items-center justify-start `}>
                    <div className="flex bg-linear-to-br from-primary to-secondary from-25%  to-85% w-9 h-9 items-center justify-center rounded-lg "> 
                        <Flame className="size-4.5 text-white"></Flame>
                    </div>
                    <span className="bg-linear-to-br from-primary from-25% to-secondary to-85% bg-clip-text text-transparent text-sm ps-2.5 font-semibold">Flame</span>
                    <div className="h-6 w-px mx-2.5 bg-border" />
                </div>
            )}

            <Button onClick={()=> setSearchOpen(true)} variant="outline" className="justify-between  w-52.5 md:w-[288px] h-9 rounded-lg hidden sm:flex">
                <div className="flex text-muted-foreground items-center gap-2.5">
                    <Search className="size-4" />
                    <span>Search anything...</span>
                </div>

                <kbd className="pointer-events-none rounded border bg-muted px-1.5 py-0.5 hidden md:flex text-xs text-muted-foreground">⌘K</kbd>
            </Button>

        </div>
        <div className=" flex items-center gap-2 ">

            <InteractiveHoverButton href="/orders/new" className="hidden text-[14px] sm:flex" >New order</InteractiveHoverButton>

            <div className="h-6 w-px hidden sm:flex bg-border" />
            {mounted && (
                <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} variant="ghost" size="icon" className="rounded-xl">
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </Button>
            )}

            <Button onClick={()=> setAppearanceOpen(true)} variant="ghost" size="icon" className="rounded-xl">
              <Palette className="size-4" />
            </Button>

            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>

                <PopoverTrigger className=" **:select-none relative inline-flex size-9 items-center justify-center rounded-xl hover:bg-muted">
                    <Bell className="size-5"/>
                    { unreadCount > 0 && <span className=" absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium " > {unreadCount} </span> }
                </PopoverTrigger>

                <PopoverContent align="end" className="**:select-none w-[calc(100vw-2rem)] max-w-95 p-0 overflow-hidden " >

                    {/* Header */}

                    <div className=" flex items-center justify-between px-4 py-3 " >
                        <div className=" flex items-center gap-2 " >
                            <h3 className=" font-semibold text-sm " > Notifications </h3>
                            <Badge className="bg-primary/20 rounded-full text-xs font-semibold text-primary " > {unreadCount} </Badge>
                        </div>
                        <div onClick={markAllAsRead} className="flex gap-1 text-muted-foreground hover:text-foreground text-xs cursor-pointer">
                            <CheckCheck className="size-4" />
                            <span className="  " > Mark all read </span>
                        </div>
                    </div>
                    
                    <Separator/>

                    {/* Content */}

                    <ScrollArea className=" h-75 " >

                        <div>
                            {notifications.slice(0, 5).map((item)=>{
                                const Icon = item.icon
                                return(
                                    <Link onClick={() => setNotificationOpen(false)} href="/notification" key={item.id} className={`relative flex gap-3 items-center px-4 py-3 hover:bg-primary/30 transition-colors ${item.unread ? "bg-primary/20" : ""} cursor-pointer `} >

                                        { item.unread && <span className=" absolute right-5 top-1/2 translate-y-[-50%] items-center size-2 rounded-full bg-primary " /> }


                                        <div className=" flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 " >
                                            <Icon className="flex size-4 text-primary" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={` text-sm font-medium ${item.unread ? "" : "text-muted-foreground"} `} > {item.title} </p>
                                            <p className=" text-xs text-muted-foreground " > {item.description} </p>
                                            <p className=" text-xs text-muted-foreground " > {item.time} </p>
                                        </div>

                                    </Link>
                                )
                            })}
                        </div>

                    </ScrollArea>

                    <Separator/>

                    {/* Footer */}

                    <Link onClick={() => setNotificationOpen(false)} href="/notification" className=" w-full p-3 cursor-pointer hover:bg-primary/5" >
                        <span className="w-full flex  justify-center items-center text-primary" > Show all notifications </span>
                    </Link>


                </PopoverContent>

            </Popover>

            <DropdownMenu>

                <DropdownMenuTrigger
                    render={
                        <button className="rounded-full outline-none">
                            <Avatar className="cursor-pointer">
                                <AvatarFallback className="bg-linear-to-br from-primary from-25%  to-85%  to-secondary font-semibold text-primary-foreground">
                                    AS
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    }
                />

                <DropdownMenuContent align="end" className="w-56">

                    <div className="px-3 py-2">
                        <p className="text-sm font-medium">
                            Amirali Setayeshmehr
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Setayeshmehr@example.com
                        </p>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem >
                        <Link href="/profile"  className="w-full flex gap-2.5" >
                            <User />
                            Profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem >
                        <Link href="/settings"  className="w-full flex gap-2.5" >
                            <Settings />
                            Settings
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        <Link href="/notification" className="w-full flex gap-2.5" >
                            <Bell />
                            Notifications
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive">
                        <Link href="/" className="w-full flex gap-2.5" >
                            <LogOut />
                            Log out
                        </Link>
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

        </div>
    </header>
  )
}

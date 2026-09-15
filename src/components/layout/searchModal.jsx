"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { sidebarGroups } from "@/data/sidebar";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function SearchModal({setSearchOpen}) {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [search, setSearch] = useState("");
    const [inputMode, setInputMode] = useState("mouse");
    const router = useRouter();

    const pages = sidebarGroups.flatMap(
        (group) => group.items
    );

    const filteredPages = pages.filter((item)=>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(()=>{

        const handleKeyDown = (e)=>{

            if(e.key === "ArrowDown" || e.key === "ArrowUp") {
                setInputMode("keyboard");
            }

            if(e.key === "ArrowDown"){
                e.preventDefault();
                setSelectedIndex((prev)=> prev < filteredPages.length - 1 ? prev + 1 : prev);
            }

            if(e.key === "ArrowUp"){
                e.preventDefault();
                setSelectedIndex((prev)=>prev > 0 ? prev - 1 : prev);
            }

            if(e.key === "Enter"){
                e.preventDefault();
                const selectedPage = filteredPages[selectedIndex];
                if(selectedPage){
                    router.push(selectedPage.href);
                    setSearchOpen(false);
                }
            }

        }
        window.addEventListener("keydown", handleKeyDown);

        return ()=> window.removeEventListener( "keydown", handleKeyDown )
        
    },[filteredPages, selectedIndex]);

    return (
        <>
            <div onClick={() => setSearchOpen(false)} className="fixed inset-0 isolate z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"></div>


            <div onClick={(e)=> e.stopPropagation()} className=" fixed top-[50%] overflow-hidden left-[50%] translate-[-50%] z-60 w-[90%]  max-w-127.5 rounded-xl bg-background shadow-xl border">
                <div className="flex items-center gap-2 border-b  w-full bg-background  border-border px-4 pt-3 pb-1">

                    <Search className="size-6 text-muted-foreground"/>

                    <Input  autoFocus value={search} onChange={(e)=>{setSearch(e.target.value); setSelectedIndex(0)}}  placeholder="Type a command or search..." className="border-0 bg-transparent focus-visible:ring-0"/>

                    <Button onClick={()=>setSearchOpen(false)} variant="ghost" size="icon" >
                        <X />
                    </Button>

                </div>

                <ScrollArea className="flex gap-1 px-4 h-87.5 ">
                    <span className="text-muted-foreground text-sm " >pages</span>
                    {
                        filteredPages.length > 0 ? (

                            filteredPages.map((item,index)=>{

                                const Icon = item.icon;
                                const isSelected = index === selectedIndex;

                                return (
                                    <Link onClick={()=>setSearchOpen(false)} onMouseEnter={() =>{setInputMode("mouse"), setSelectedIndex(index)}} href={item.href}  key={item.title} className={`flex items-center gap-3 p-3 rounded-lg ${inputMode === "mouse" ? "hover:bg-muted" : ""} cursor-pointer ${isSelected ? "bg-muted" : ""} `} >

                                        <Icon className="size-4" />

                                        <span> {item.title} </span>

                                    </Link>
                                )

                            })

                        ) : (

                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-sm text-foreground">
                                    No results found.
                                </p>
                            </div>

                        )

                        }

                </ScrollArea>
            </div>
        
        </>
        
    )
}


"use client"

import { conversations } from "@/data/chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function ConversationList({ selectedConversation, onSelectConversation}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-3 py-3">
        <Input placeholder="Search conversations..." className="mt-3 rounded-xl m-0 "/>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((conversation) => (
            <button onClick={() => onSelectConversation(conversation)} key={conversation.id} className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${selectedConversation.id === conversation.id ? "bg-muted" : "hover:bg-muted"}`}>
                <div className="relative">
                    <Avatar>
                        <AvatarFallback>{conversation.initials}</AvatarFallback>
                    </Avatar>

                    {conversation.status === "online" && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-green-500" />
                    )}
                </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {conversation.name}
                  </p>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {conversation.time}
                  </span>
                </div>

                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {conversation.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
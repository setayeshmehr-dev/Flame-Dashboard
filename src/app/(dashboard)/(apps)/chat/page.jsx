"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { conversations, messages } from "@/data/chat"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ConversationList from "@/components/chat/conversationList"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreHorizontal, Paperclip, Phone, Send, Video,} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  )
  const [chatMessages, setChatMessages] = useState(messages)
  const [messageText, setMessageText] = useState("")
  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setChatMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...prev[selectedConversation.id],
        newMessage,
      ],
    }))

    setMessageText("")
  }
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, selectedConversation])
  const [mobileView, setMobileView] = useState("conversations")
  return (
    <div>
      <div className="space-y-4 md:space-y-6 px-3 md:px-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="dashboard" />}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>chat</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Chat</h1>
            <p className="text-sm text-muted-foreground">Messages and conversations.</p>
          </div> 
        </div>
      </div>
      <Card className="mt-6 h-137.5 overflow-hidden p-0">
        <div className="h-full lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
          
          {/* Conversations */}
          <div className={`h-full border-border lg:block lg:border-r ${mobileView === "chat" ? "hidden" : "block"}`}>
            <ConversationList
              selectedConversation={selectedConversation}
              onSelectConversation={(conversation) => {
                setSelectedConversation(conversation)
                setMobileView("chat")
              }}
            />
          </div>

          {/* Chat */}
          <div className={`h-full min-h-0 min-w-0 flex-col ${mobileView === "chat" ? "flex" : "hidden"} lg:flex`}>
            <div className="flex h-15.25 items-center justify-between border-b px-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileView("conversations")}>
                  <ArrowLeft />
                </Button>
                <Avatar>
                  <AvatarFallback>{selectedConversation.initials}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-medium">{selectedConversation.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedConversation.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone />
                </Button>

                <Button variant="ghost" size="icon">
                  <Video />
                </Button>

                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-4 p-6">
                {chatMessages[selectedConversation.id].map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start" }`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p className="text-sm">{message.text}</p>

                      <p className={`mt-1 text-[10px] ${message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}> {message.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip />
                </Button>

                <Input value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={(e) => {if (e.key === "Enter") handleSendMessage()}} placeholder="Write a message..." className="flex-1"/>

                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="size-4 translate-y-px -translate-x-px" />
                </Button>
              </div>
            </div>
          </div>

        </div>
      </Card>
    </div>
  )
}
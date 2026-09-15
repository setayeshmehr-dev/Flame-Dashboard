export const conversations = [
  {
    id: "1",
    name: "Emma Wilson",
    initials: "EW",
    status: "online",
    lastMessage: "Hey! Can you check the latest update?",
    time: "10:42 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "James Chen",
    initials: "JC",
    status: "offline",
    lastMessage: "The dashboard looks great.",
    time: "09:18 AM",
    unread: 0,
  },
  {
    id: "3",
    name: "Sophia Miller",
    initials: "SM",
    status: "online",
    lastMessage: "I'll send the files shortly.",
    time: "Yesterday",
    unread: 4,
  },
  {
    id: "4",
    name: "Daniel Brown",
    initials: "DB",
    status: "away",
    lastMessage: "Are you available for a call?",
    time: "Yesterday",
    unread: 0,
  },
]

export const messages = {
  "1": [
    {
      id: "1",
      sender: "other",
      text: "Hey! How is the new dashboard coming along?",
      time: "10:38 AM",
    },
    {
      id: "2",
      sender: "me",
      text: "It's going really well. I'm working on the chat page now.",
      time: "10:39 AM",
    },
    {
      id: "3",
      sender: "other",
      text: "Nice! The new layout looks great.",
      time: "10:40 AM",
    },
  ],

  "2": [
    {
      id: "4",
      sender: "other",
      text: "The dashboard looks great.",
      time: "09:18 AM",
    },
    {
      id: "5",
      sender: "me",
      text: "Thanks! I'm still polishing a few things.",
      time: "09:20 AM",
    },
  ],

  "3": [
    {
      id: "6",
      sender: "other",
      text: "I'll send the files shortly.",
      time: "Yesterday",
    },
    {
      id: "7",
      sender: "me",
      text: "Perfect, I'll check them when they arrive.",
      time: "Yesterday",
    },
  ],

  "4": [
    {
      id: "8",
      sender: "other",
      text: "Are you available for a call?",
      time: "Yesterday",
    },
    {
      id: "9",
      sender: "me",
      text: "Sure, I'm available this afternoon.",
      time: "Yesterday",
    },
  ],
}
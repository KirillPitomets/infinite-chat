export interface IChatItem {
  id: string
  name: string
  photo: string
  lastMessage: string
  messageCreatedAt: number
  status: "online" | "offline"
}

export const chats: IChatItem[] = [
   {
    id: "chat-1",
    name: "John Doe",
    photo: "https://randomuser.me/api/portraits/men/11.jpg",
    lastMessage: "How are you?",
    messageCreatedAt: 1640881380,
    status: "online",
  },
  {
    id: "chat-2",
    name: "Kate Wilson",
    photo: "https://randomuser.me/api/portraits/women/21.jpg",
    lastMessage: "See you tomorrow!",
    messageCreatedAt: 1640879880,
    status: "offline",
  },
  {
    id: "chat-3",
    name: "Alex Brown",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Got it 👍",
    messageCreatedAt: 1640878800,
    status: "online",
  },
  {
    id: "chat-4",
    name: "Emily Clark",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    lastMessage: "Can you send the files?",
    messageCreatedAt: 1640877720,
    status: "offline",
  },
  {
    id: "chat-5",
    name: "Michael Scott",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    lastMessage: "That's what she said 😄",
    messageCreatedAt: 1640877000,
    status: "online",
  },
  {
    id: "chat-6",
    name: "Sarah Johnson",
    photo: "https://randomuser.me/api/portraits/women/60.jpg",
    lastMessage: "Thanks!",
    messageCreatedAt: 1640876100,
    status: "offline",
  },
  {
    id: "chat-7",
    name: "David Miller",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    lastMessage: "I'll check it later",
    messageCreatedAt: 1640875260,
    status: "offline",
  },
  {
    id: "chat-8",
    name: "Olivia Smith",
    photo: "https://randomuser.me/api/portraits/women/72.jpg",
    lastMessage: "Sounds good 👌",
    messageCreatedAt: 1640874600,
    status: "online",
  },
  {
    id: "chat-9",
    name: "Chris Evans",
    photo: "https://randomuser.me/api/portraits/men/81.jpg",
    lastMessage: "Let's do it",
    messageCreatedAt: 1640873880,
    status: "offline",
  },
  {
    id: "chat-10",
    name: "Anna Taylor",
    photo: "https://randomuser.me/api/portraits/women/88.jpg",
    lastMessage: "I'm on my way I'm on my wayI'm on my wayI'm on my wayI'm on my way",
    messageCreatedAt: 1640873100,
    status: "online",
  },
  {
    id: "chat-11",
    name: "Robert King",
    photo: "https://randomuser.me/api/portraits/men/93.jpg",
    lastMessage: "Perfect",
    messageCreatedAt: 1640872320,
    status: "offline",
  },
  {
    id: "chat-12",
    name: "Sophia Martinez",
    photo: "https://randomuser.me/api/portraits/women/95.jpg",
    lastMessage: "Can we reschedule?",
    messageCreatedAt: 1640871600,
    status: "offline",
  },
  {
    id: "chat-13",
    name: "Daniel Lee",
    photo: "https://randomuser.me/api/portraits/men/98.jpg",
    lastMessage: "No problem",
    messageCreatedAt: 1640870880,
    status: "online",
  },
  {
    id: "chat-14",
    name: "Emma Davis",
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
    lastMessage: "Haha 😅",
    messageCreatedAt: 1640870100,
    status: "online",
  },
  {
    id: "chat-15",
    name: "James Anderson",
    photo: "https://randomuser.me/api/portraits/men/17.jpg",
    lastMessage: "I'll call you later",
    messageCreatedAt: 1640869320,
    status: "offline",
  },
];

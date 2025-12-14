export type User = {
    id: string;
    phone: string;
    profile: {
        name: string;
        username: string;
        avatar: string;
        bio: string;
    };
};

export type Message = {
    id: string;
    content: string;
    authorId: String;
    createdAt: number;
    read: boolean;
    chatId: string;
    image?: string;
    video?: string;
};

export type Chat = {
    id: string;
    messages: Message[];
    user: User;
    newChat: boolean;
};
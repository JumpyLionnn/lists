export interface ListData{
    id: number;
    creatorId: number;
    name: string;
    joinCode: string;
}

export interface ItemData{
    id: number;
    listId: number;
    content: string;
    checked: boolean;
}

// TODO: share enums and interfaces between the server and the client
export enum Status {
    Online,
    Idle,
    Offline
};

export interface MemberData{
    userId: number;
    username: string;
    status: Status;
}




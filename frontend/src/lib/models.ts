export interface ListData{
    id: number;
    creatorId: number;
    name: string;
}


export interface ItemData{
    id: number;
    listId: number;
    content: string;
    checked: boolean;
}

export interface MemberData{
    userId: number;
    username: string;
}
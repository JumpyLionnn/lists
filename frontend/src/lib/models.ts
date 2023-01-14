export interface ListData{
    id: number;
    creatorId: number;
    name: string;
}


export interface ItemData{
    id: number;
    listId: number;
    content: string;
}
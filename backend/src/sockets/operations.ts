import { lists, members } from "./state";

export function sendMessageToList<T>(listId: number, eventName: string, data: T){
    const collection = lists.get(listId);
    const eventData = JSON.stringify({type: eventName, data: data});
    if(collection){
        for (const member of collection) {
            member.send(eventData);
        }
    }
}

export function joinListGroup(listId: number, userId: number){
    const collection = lists.get(listId);
    if(collection){
        const member = members.get(userId);
        if(member){
            collection.add(member);
        }
    }
}

export function disconnectMember(userId: number){
    const member = members.get(userId);
    if(member){
        member.disconnectSockets();
        for (const listId of member.listIds) {
            const list = lists.get(listId);
            if(list){
                list.remove(member.userId);
            }
            else{
                console.warn(`List ${listId} was registered in the member but didnt exist.`);
            }
        }
        members.delete(userId);
    }
    
}
import { MemberSocket, Status } from "./memberSocket";
import { sendMessageToMemberLists } from './operations';

const memberTimers: Map<number, ReturnType<typeof setTimeout>> = new Map();

// 5 minutes
const onlineCooldown: number = 5 * 60 * 1000;

export function registerMemberStatus(member: MemberSocket) {
    memberTimers.set(member.userId, setTimer(member));
    syncStatus(member);
}

export function handleAction(member: MemberSocket): void{
    let timer = memberTimers.get(member.userId);
    if (timer !== undefined) {
        timer.refresh();
        if(member.status !== Status.Online){
            member.status = Status.Online;
            syncStatus(member);
        }
    }
    else {
        console.error(`action was received by member but the timer didnt exist.`);
        timer = setTimer(member);
    }
}

function setTimer(member: MemberSocket): ReturnType<typeof setTimeout> {
    member.status = Status.Online;
    return setTimeout(() => {
        member.status = Status.Idle;
        syncStatus(member);
    }, onlineCooldown);
}

export function onDisconnect(member: MemberSocket): void {
    member.status = Status.Offline;
    const timer = memberTimers.get(member.userId);
    if(timer === undefined) {
        console.error("member disconnected and it's status timer did not exist");
    }
    else {
        clearInterval(timer);
        memberTimers.delete(member.userId);
    }
    syncStatus(member);
}

function syncStatus(member: MemberSocket): void {
    sendMessageToMemberLists(member, "status", {
        userId: member.userId,
        status: member.status
    });
}
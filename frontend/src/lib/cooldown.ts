import { writable, type Writable, type Updater } from "svelte/store";



export function cooldownWritable<T>(initialValue: T, cooldown: number): Writable<T> {
    const { subscribe, set, update } = writable(initialValue);
    let time: number = Date.now();
	return {
		subscribe,
		set: (value: T) => {
            const currentTime = Date.now();
            if(currentTime - cooldown >= time){
                time = currentTime;
                set(value);
            }
        },
        update: (updater: Updater<T>) => {
            const currentTime = Date.now();
            if(currentTime - cooldown >= time){
                time = currentTime;
                update(updater);
            }
        }
	};
}
import { writable, type Writable } from "svelte/store";

export class ClassList{
    public readonly subscribe: Writable<string>["subscribe"];

    private classes: Set<string>;
    private emitter: Writable<string>;


    public constructor(...classes: string[]){
        this.classes = new Set(classes);
        this.emitter = writable(this.toString());
        this.subscribe = this.emitter.subscribe;
    }

    public get length(){
        return this.classes.size;
    }

    public get value(){
        return this.toString();
    }

    public set value(classes: string){
        this.classes.clear();
        const classArray = classes.split(" ");
        for (let i = 0; i < classArray.length; i++) {
            const c = classArray[i];
            if(c.length !== 0)
                this.classes.add(c);
        }
        this.emitter.set(this.toString());
    }

    public contains(clas: string){
        return this.classes.has(clas);
    }

    public add(clas: string){
        this.classes.add(clas);
        this.emitter.set(this.toString());
    }

    public remove(clas: string){
        this.classes.delete(clas);
        this.emitter.set(this.toString());
    }

    public replace(oldClass: string, newClass: string){
        if(this.classes.has(oldClass)){
            this.classes.delete(oldClass);
            this.classes.add(newClass);
            this.emitter.set(this.toString());
            return true;
        }
        return false;
    }

    public toggle(clas: string){
        if(this.classes.has(clas)){
            this.classes.delete(clas);
        }
        this.classes.add(clas);
        this.emitter.set(this.toString());
    }

    public entries(){
        return this.classes.entries();
    }

    public forEach(callbackfn: (value: string, value2: string) => void, thisArg?: unknown){
        this.classes.forEach(callbackfn, thisArg);
    }

    public keys(){
        return this.classes.keys();
    }

    public values(){
        return this.classes.values();
    }

    public toString(){
        return Array.from(this.classes).join(" ");
    }
}
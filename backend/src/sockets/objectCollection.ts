class ObjectCollection<T, Key extends keyof T>{
    private objects: T[] = [];
    private indices: Map<T[Key], number> = new Map();
    private propertyName: Key;
    constructor(propertyName: Key){
        this.propertyName = propertyName;
    }

    add(object: T) {
        if(!this.indices.has(object[this.propertyName])){
            this.objects.push(object);
            this.indices.set(object[this.propertyName], this.objects.length - 1);
        }
    }

    remove(property: T[Key]) {
        if (this.indices.has(property)) {
            let index = this.indices.get(property)!;
            if(index === this.objects.length - 1){
                this.objects.pop();
            }
            else{
                this.objects[index] = this.objects.pop()!;
                this.indices.set(this.objects[index][this.propertyName], index);
            }
            this.indices.delete(property);
        }
    }

    get size(){
        return this.objects.length;
    }

    [Symbol.iterator]() {
        let index = 0;
        let objects = this.objects;
        return {
            next() {
                if (index < objects.length) {
                    return { value: objects[index++], done: false };
                } else {
                    return { value: objects[index++], done: true };
                }
            }
        };
    }
}

export default ObjectCollection;
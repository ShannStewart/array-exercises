const memory = require('./memory')

class Array{
    constructor(){
        this.length = 0;
        this.ptr = memory.allocate(this.length);
    }

    push(value) {
        this._resize(this.length + 1);
        //resize the array so there is space for the new item
        memory.set(this.ptr + this.length, value);
        //set memory to equal the value
        this.length++;
    }   

    _resize(size) {
        const oldPtr = this.ptr;
        this.ptr = memory.allocate(size);
        //it is likely that the space directly after what you allocated for the array will 
        //have already been allocated for some other purpose. So instead you have to allocate 
        //a new, larger chunk of memory
        if (this.ptr === null) {
            throw new Error('Out of memory');
        }
        memory.copy(this.ptr, oldPtr, this.length);
        memory.free(oldPtr);
        //copy any existing values from the old to the new chunk, and free the old chunk.
    }

    get(index){
        //Retrieving values from arrays is very straightforward. 
        //You saw how when pushing you can find the correct memory address by simply adding the index to the start position, 
        //so retrieval is as simple as this:
        if (index < 0 || index >= this.length){
            throw new Error('Index Error');
        }
        return memory.get(this.ptr + index);
        //All this does is add an index offset, and get the value stored at a memory address.
    }

    pop(){
        //Rather than resize the array, you just leave an extra space which will be filled at the next push
        if (this.length == 0){
            throw new Error('Index Error');
        }
        const value = memory.get(this.ptr + this.length - 1);
        this.length--;
        return value;
    }

    insert(index, value){
        //shift all of the values after the new value back 1 position. Then you put the new value in its correct place.
        if(index < 0 || index >= this.length){
            throw new Error('Insert Error');
        }
        if(this.length >= this._capacity){
            this.resize((this.length + 1) * Array.SIZE_RATIO);
        }

        memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
        memory.set(this.ptr + index, value);
        this.length++;
    }

    remove(index){
        //copying the values backward to fill the space where you removed the value rather than forwards to make space for a new value
        if (index < 0 || index >= this.length){
            throw new Error('Remove Error');
        }
        memory.copy(this.ptr + index, this.ptr + index + 1, this.length - index - 1);
        this.length--;
    }
}

Array.SIZE_RATIO = 3;
//Now as well as a length, you also have a capacity; how many items you can hold without needing to resize. 
//In the push method, if the length is greater than the capacity then you resize according to the SIZE_RATIO

//export default Array;

function main(){

    Array.SIZE_RATIO = 3;

    // Create an instance of the Array class
    let arr = new Array();

    // Add an item to the array
    arr.push(3);
    arr.push(5);
    arr.push(15);
    arr.push(19);
    arr.push(45);
    arr.push(10);

    console.log(arr);
}

main();
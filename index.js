let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => { reject("promise1 rejected. . .") }, 2000)
})

let isThennable = (mayBePromise)=>{return mayBePromise && typeof mayBePromise.then == 'function'};

let asyncFn = (generatorFn) => (...args) => {
    let producer = generatorFn(...args);
    let interpretor = (lastValue, isError)=>{
        let { value, done } = !isError?producer.next(lastValue):producer.throw(lastValue);
        if (!done) {
            if(isThennable(value)){
                return value.then((v)=>interpretor(v), (e)=>interpretor(e, true))
            } else {
                return interpretor(v)
            }
        } else {
            if (!isThennable(value)) {
                return Promise.resolve(value);
            } 
            return value;
        }
    }
    return interpretor();
}


//we can use the above asyncFn as below in place of async keyword and yield keyword for await.
let asyncOperation2 = asyncFn(function* (...args) {
    try{
        let v = yield promise1;
        console.log(v);
    } catch(e) {
        console.log("error occured: " + e)
    }
    return "a";
})

asyncOperation2().then((v)=>{
    console.log(v)
});
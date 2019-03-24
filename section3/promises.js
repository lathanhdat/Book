const doWorkPromiss = new Promise((resolve,reject)=>{
    setTimeout(()=>{
        // resolve([7,4,1])
        reject('Things went wrong');
    },2000)
})

doWorkPromiss.then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log('Error!',error);
})
//                        fulfilled
//                      /
//Promise -- pending -->
//                       \
//                         rejected
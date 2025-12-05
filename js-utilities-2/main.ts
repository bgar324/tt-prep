// function debounce<T extends (...args : any[]) => any>(fn : T, delay : number){
//   let timer : any;
//   return function (...args : Parameters<T>){
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// }

// function throttle<T extends (...args : any[]) => any>(fn : T, delay : number){
//   let last = 0;
//   return function(...args : Parameters<T>){
//     const now = Date.now();
//     if(now - last >= delay){
//       last = now;
//       fn(...args);
//     }
//   }
// }

// function once<T extends (...args : any[]) => any>(fn : T){
//   let called = false;
//   let result : ReturnType<T>;
//   return function (...args : Parameters<T>){
//     if(!called){
//       called = true;
//       result = fn(...args);
//     }
//     return result;
//   }
// }

// function memoize<T extends (...args : any[]) => any>(fn : T){
//   const cache = new Map<string, ReturnType<T>>();
//   return function (...args : Parameters<T>){
//     const key = JSON.stringify(args);
//     if(cache.has(key)) return cache.get(key);
//     const res = fn(...args);
//     cache.set(key, res);
//     return res;
//   }
// }
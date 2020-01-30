/* 
    Promise函数对象模块
*/
(function(window) {
    
    class Promise {

        /* 
            构造函数Promise
        */
        constructor(executor) {
            
            
        }

        /* 
            用来指定成功和失败回调函数的方法
        */
        then(onResolved, onRejected) {
            
        }

        /* 
            用来指定失败回调函数的方法
        */
        catch(onRejected) {
            
        }

        /* 
            用来返回一个成功的promise的静态方法
        */
        static resolve(value) {
            
        }

        /* 
            用来返回一个失败的promise的静态方法
        */
        static reject(reason) {
            
        }

        /* 
            用来返回一个promise的静态方法
                promises都成功，返回的promise才成功
                只要有一个promise失败了，返回的promise就失败了
        */
        static all(promises) {
            
        }

        /* 
            用来返回第一个成功promise的静态方法
        */
        static race(promises) {
            
        }
    }
    
    window.Promise = Promise

})(window)
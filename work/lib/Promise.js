/* 
    Promise函数对象模块
*/
(function(window) {
    
    /* 
        构造函数Promise
    */
    Promise = function(executor) {
        
        const self = this // 将promise对象保存到self
        self.status = 'pending' // 标识状态名称的属性status，初始值为pending，代表结果还未确定
        self.data = undefined // 用来存储结果数据的属性data，初始值为undefined，代表现在还没有数据
        self.callbacks = []
        
        /* 
            用来指定promise成功的状态和成功的数据
             1). 指定status改为'resolved'
             2). 指定data为value
             3). 可能需要去执行已保存的待执行的成功的回调函数
        */
        resolve = (value) => {
            // 1). 指定status改为'resolved'
            self.status = 'resolved'
            // 2). 指定data为value
            self.data = value
            // 3). 可能需要去执行已保存的待执行的成功的回调函数
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onResolved(value)
                    })
                }, 0)
            }
        }

        /* 
            用来指定promise失败的状态和成功的数据
             1). 指定status改为'rejected'
             2). 指定data为reason
             3). 可能需要去执行已保存的待执行的失败的回调函数
        */
        reject = (reason) => {
            // 1). 指定status改为'rejected'
            self.status = 'rejected'
            // 2). 指定data为reason
            self.data = reason
            // 3). 可能需要去执行已保存的待执行的失败的回调函数
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(callbackObj => {
                        callbackObj.onRejected(reason)
                    })
                }, 0)
            }
        }

        /* 
            立即同步执行执行器函数(去启动异步任务)
        */
        try {
            executor(resolve, reject)
        } catch (error) { // 一旦执行器执行抛出异常，promise变为失败，且结果数据为error
            reject(error)
        }
    }

    /* 
        用来指定成功和失败回调函数的方法
    */
    Promise.prototype.then = function(onResolved, onRejected) {
        this.callbacks.push({onResolved, onRejected})
    }

    /* 
        用来指定失败回调函数的方法
    */
    Promise.prototype.catch = function(onRejected) {
        
    }

    /* 
        用来返回一个成功的promise的静态方法
    */
    Promise.resolve = function(value) {
        
    }

    /* 
        用来返回一个失败的promise的静态方法
    */
    Promise.reject = function(reason) {
        
    }

    /* 
        用来返回一个promise的静态方法
            promises都成功，返回的promise才成功
            只要有一个promise失败了，返回的promise就失败了
    */
    Promise.all = function(promises) {
        
    }

    /* 
        用来返回第一个成功promise的静态方法
    */
    Promise.race = function(promises) {
        
    }

    window.Promise = Promise

})(window)
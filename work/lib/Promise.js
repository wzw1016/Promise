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

            if (self.status !== 'pending') {
                return
            }
                
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

            if (self.status !== 'pending') {
                return
            }

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
        const self = this

        // 设置onResolved与onRejected的默认值
        onResolved = typeof onResolved === 'function' ? onResolved : value => value // 如果传入的onResolved不是函数，则调用resolve(value)
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason} // 如果传入的onRejected不是函数，则调用reject(reason)

        return new Promise((resolve, reject) => {

            /* 
                调用传入的成功/失败的回调，执行后根据结果来确定返回的promise的结果
            */
            function handle(callback) {
                try {
                    const result = callback(self.data)
                    if (result instanceof(Promise)) { // then的回调函数的返回值(即result)决定了返回的promise的结果
                        /* result.then(
                            (value) => { // 如果result成功了，返回的promise也成功，值就是接收的value
                                resolve(value)
                            },
                            (reason) => { // 如果result失败了，返回的promise也失败，值就是接收的reason
                                reject(reason)
                            }
                        ) */
                        result.then(resolve, reject)
                    } else {
                        resolve(result)
                    }
                } catch (error) { // 如果then的回调函数(即callback) throw xxx (抛出数据)，返回的promise失败
                    reject(error)
                }
            }

            if (self.status === 'resolved') { // 已经成功了(调用then的promise对象(即this/self)是resolved状态)
                // 进行成功的异步处理
                setTimeout(() => {
                    handle(onResolved)
                }, 0)
            } else if (self.status === 'rejected') { // 已经失败了(调用then的promise对象(即this/self)是rejected状态)
                // 进行失败的异步处理
                setTimeout(() => {
                    handle(onRejected)
                }, 0)
            } else { // pending 结果还未确定
                // 向promise的callbacks中保存两个待执行的回调函数
                this.callbacks.push({
                    onResolved() {
                        // 进行成功的处理
                        handle(onResolved)
                    },
                    onRejected() {
                        // 进行失败的处理
                        handle(onRejected)
                    }
                })
            }
        })
    }

    /* 
        用来指定失败回调函数的方法
    */
    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected)
    }

    /* 
        用来返回一个成功/失败的promise的静态方法
    */
    Promise.resolve = function(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof(Promise)) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }

    /* 
        用来延时返回一个成功/失败的promise的静态方法
    */
    Promise.resolveDelay = function(value, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (value instanceof(Promise)) {
                    value.then(resolve, reject)
                }else {
                    resolve(value)
                }
            }, time)
        })
    }

    /* 
        用来返回一个失败的promise的静态方法
    */
    Promise.reject = function(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    /* 
        用来延时返回一个失败的promise的静态方法
    */
    Promise.rejectDelay = function(reason, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(reason)
            }, time)
        })
    }

    /* 
        用来返回一个promise的静态方法
            promises都成功，返回的promise才成功
            只要有一个promise失败了，返回的promise就失败了
    */
    Promise.all = function(promises) {

        return new Promise((resolve, reject) => {

            const promisesLength = promises.length
            const values = new Array(promisesLength)
            let resolvedCount = 0

            promises.forEach((p, index) => {
                Promise.resolve(p).then(
                    value => {
                        resolvedCount++
                        values[index] = value
                        if (resolvedCount === promisesLength) {
                            resolve(values)
                        }
                    },
                    reason => {
                        reject(reason)
                    }
                )
            })
        })
    }
        

    /* 
        用来返回第一个成功promise的静态方法
    */
    Promise.race = function(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(p => {
                Promise.resolve(p).then(resolve, reject)
            })
        })
    }

    window.Promise = Promise

})(window)
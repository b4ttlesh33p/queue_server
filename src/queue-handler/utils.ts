type Callback = () => any | Promise<any>

export function retryByTimeout(callback: Callback, timeout: number): Promise<any> {
    return new Promise((resolve) => {
      const intervalTime = 1000
      let elapsed = 0
  
      const interval = setInterval(async () => {
        const result = await callback()
        elapsed += intervalTime
  
        if (result) {
          clearInterval(interval)
          resolve({result, isFailed: false})
        } else if (elapsed >= timeout * 1000) {
          clearInterval(interval)
          resolve({message: 'timeout reached', isFailed: true})
        }
      }, intervalTime)
    })
  }
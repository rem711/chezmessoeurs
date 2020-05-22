const spinner = new (function() {
    this.counter = 1
    this.spinner = undefined

    this.init = () => {
        this.spinner = document.getElementById('spinner')
    }

    this.show = () => {
        if(this.spinner === undefined) {
            this.init()
        }
        this.counter += 1
        this.spinner.style.display = 'block'
    }

    this.hide = () => {
        if(this.spinner === undefined) {
            this.init()
        }
        this.counter -= 1
        if(this.counter === 0) {
            this.spinner.style.display = 'none'
        }
    }
})()

// overide fetch method to detect every time fetch is called and when it is released
const fetchMock = window.fetch
window.fetch = async (...args) => {
    // do something before
    spinner.show()
    
    const response = await fetchMock(...args)
    
    // do something after
    spinner.hide()

    return new Promise(resolve => resolve(response))
}

window.addEventListener('load', () => {
    spinner.hide()
})
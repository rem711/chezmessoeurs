const initSelectedLi = () => {
    const listLi = document.querySelectorAll('li[id]')
    for(const li of listLi) {
        li.onclick = () => toggleSelectedLi(li)
    }
}

const toggleSelectedLi = (liClicked) => {
    const selectedLi = document.getElementsByClassName('selected')[0]

    if(selectedLi !== liClicked) {
        if(selectedLi) {
            selectedLi.setAttribute('class', selectedLi.getAttribute('class').replace(/selected/g, ''))
        }
        liClicked.setAttribute('class', `${liClicked.getAttribute('class')} selected`)
    }
    if(selectedLi) {
        selectedLi.setAttribute('class', selectedLi.getAttribute('class').replace(/selected/g, ''))
    }
}


window.addEventListener("DOMContentLoaded", () => {
    initSelectedLi()
});
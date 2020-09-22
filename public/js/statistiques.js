async function getFacturesAttente() {
    const table = document.querySelector('.tab_stats_impayes tbody')
    const infos_facturesAttente = document.getElementById('infos_facturesAttente')

    try {
        const response = await fetch('/statistiques/factures/en-attente')
        if(response.ok) {
            const { infos, factures } = await response.json()

            if(infos && infos.error) throw infos.error

            if(infos && infos.message) {               
                const td = document.createElement('td')
                td.setAttribute('colspan', 5)
                td.innerText = infos.message

                const tr = document.createElement('tr')
                tr.appendChild(td)

                table.appendChild(tr)
            }
            else if(factures) {
                for(const facture of factures) {
                    const tr = document.createElement('tr')

                    let td = document.createElement('td')
                    td.innerText = moment(facture.Vente.Date_Evenement).format('DD/MM/YYYY HH:mm')
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = moment(facture.Date_Paiement_Du).format('DD/MM/YYYY')
                    tr.appendChild(td)

                    td = document.createElement('td')
                    let client = `${facture.Vente.Client.Prenom} ${facture.Vente.Client.Nom}`
                    if(facture.Vente.Client.Societe) client += ` (${facture.Vente.Client.Societe})`
                    td.innerText = client
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = facture.Ref_Facture
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = `${Number(facture.Prix_TTC).toFixed(2)} €`
                    tr.appendChild(td)

                    table.appendChild(tr)
                }
            }
            else {
                throw 'Une erreur est survenue, veuillez réessayer plus tard.'
            }
        }
        else if (response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            throw "Une erreur est survenue, veuillez réesayer plus tard."
        }
    }
    catch(e) {
        infos_facturesAttente.innerText = e
        infos_facturesAttente.style.display = 'block'
    }
}

async function getFacturesRetard() {
    const table = document.querySelector('.tab_stats_enretard tbody')
    const infos_facturesRetard = document.getElementById('infos_facturesRetard')

    try {
        const response = await fetch('/statistiques/factures/en-retard')
        if(response.ok) {
            const { infos, factures } = await response.json()

            if(infos && infos.error) throw infos.error

            if(infos && infos.message) {               
                const td = document.createElement('td')
                td.setAttribute('colspan', 5)
                td.innerText = infos.message

                const tr = document.createElement('tr')
                tr.appendChild(td)

                table.appendChild(tr)
            }
            else if(factures) {
                for(const facture of factures) {
                    const tr = document.createElement('tr')

                    let td = document.createElement('td')
                    td.innerText = moment(facture.Vente.Date_Evenement).format('DD/MM/YYYY HH:mm')
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = moment(facture.Date_Paiement_Du).format('DD/MM/YYYY')
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = facture.retard.replace('En retard de ', '+')
                    tr.appendChild(td)

                    td = document.createElement('td')
                    let client = `${facture.Vente.Client.Prenom} ${facture.Vente.Client.Nom}`
                    if(facture.Vente.Client.Societe) client += ` (${facture.Vente.Client.Societe})`
                    td.innerText = client
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = facture.Ref_Facture
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = `${Number(facture.Prix_TTC).toFixed(2)} €`
                    tr.appendChild(td)

                    table.appendChild(tr)
                }
            }
            else {
                throw 'Une erreur est survenue, veuillez réessayer plus tard.'
            }
        }
        else if (response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            throw "Une erreur est survenue, veuillez réesayer plus tard."
        }
    }
    catch(e) {
        infos_facturesRetard.innerText = e
        infos_facturesRetard.style.display = 'block'
    }
}

async function getVentesProchaines() {
    const table = document.querySelector('.tab_stats_prochains tbody')
    const infos_ventesProchaines = document.getElementById('infos_ventesProchaines')

    try {
        const response = await fetch('/statistiques/ventes/prochaines')
        if(response.ok) {
            const { infos, ventes } = await response.json()

            if(infos && infos.error) throw infos.error

            if(infos && infos.message) {               
                const td = document.createElement('td')
                td.setAttribute('colspan', 4)
                td.innerText = infos.message

                const tr = document.createElement('tr')
                tr.appendChild(td)

                table.appendChild(tr)
            }
            else if(ventes) {
                for(const vente of ventes) {
                    const tr = document.createElement('tr')

                    let td = document.createElement('td')
                    td.innerText = moment(vente.Date_Evenement).format('DD/MM/YYYY HH:mm')
                    tr.appendChild(td)

                    td = document.createElement('td')
                    let client = `${vente.Client.Prenom} ${vente.Client.Nom}`
                    if(vente.Client.Societe) client += ` (${vente.Client.Societe})`
                    td.innerText = client
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = vente.Description
                    tr.appendChild(td)

                    td = document.createElement('td')
                    td.innerText = vente.Nb_Personnes
                    tr.appendChild(td)

                    table.appendChild(tr)
                }
            }
            else {
                throw 'Une erreur est survenue, veuillez réessayer plus tard.'
            }
        }
        else if (response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            throw "Une erreur est survenue, veuillez réesayer plus tard."
        }
    }
    catch(e) {
        infos_ventesProchaines.innerText = e
        infos_ventesProchaines.style.display = 'block'
    }
}

async function getStats() {
    const infos_stats = document.getElementById('infos_stats')

    try {
        const results = await Promise.all([
            getStatsNbVentes(),
            getStatsCAVentes()
        ])

        const infos_nbVentes = results[0].infos
        const data_nbVentes = results[0].data
        if(infos_nbVentes && infos_nbVentes.error) throw infos_nbVentes.error

        const infos_CAVentes = results[1].infos
        const data_CAVentes = results[1].data
        if(infos_CAVentes && infos_CAVentes.error) throw infos_CAVentes.error

        createChart_nbVentes(infos_nbVentes, data_nbVentes)
        createChart_CAVentes(infos_CAVentes, data_CAVentes)
    }
    catch(e) {
        infos_stats.innerText = e
        infos_stats.style.display = 'block'
    }
}

async function getStatsNbVentes() {
    let infos = undefined
    let data = undefined

    try {
        const response = await fetch('/statistiques/ventes/nbVentes')
        if(response.ok) {
            elt = await response.json()
            infos = elt.infos
            data = elt.data

            if(infos && infos.error) throw infos.error
        }
        else if (response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            throw "Une erreur est survenue, veuillez réesayer plus tard."
        }
    }
    catch(e) {
        data = undefined,
        infos = {
            error : e
        }
    }

    return {
        infos,
        data
    }
}

async function getStatsCAVentes() {
    let infos = undefined
    let data = undefined

    try {
        const response = await fetch('/statistiques/ventes/CAVentes')
        if(response.ok) {
            elt = await response.json()
            infos = elt.infos
            data = elt.data

            if(infos && infos.error) throw infos.error
        }
        else if (response.status === 401) {
            alert("Vous avez été déconnecté, une authentification est requise. Vous allez être redirigé.")
            location.reload()
        }
        else {
            throw "Une erreur est survenue, veuillez réesayer plus tard."
        }
    }
    catch(e) {
        data = undefined,
        infos = {
            error : e
        }
    }

    return {
        infos,
        data
    }
}

function createChart_nbVentes(infos, data) {
    const canvas = document.getElementById('graphe_nbVentes')

    if(infos && infos.message) {
        const p = document.createElement('p')
        p.innerText = infos.message

        canvas.parentNode.insertBefore(p, canvas)
    }
    else {
        data.datasets[0].backgroundColor = '#e06128'
        data.datasets[0].borderColor = '#e06128'

        const ctx = canvas.getContext('2d')
        const chart = new Chart(ctx, {
            type : 'bar',
            data,
            options: {}
        })
    }
}

function createChart_CAVentes(infos, data) {
    const canvas = document.getElementById('graphe_CA')

    if(infos && infos.message) {
        const p = document.createElement('p')
        p.innerText = infos.message

        canvas.parentNode.insertBefore(p, canvas)
    }
    else {
        data.datasets[0].backgroundColor = '#e06128'
        data.datasets[0].borderColor = '#e06128'

        const ctx = canvas.getContext('2d')
        const chart = new Chart(ctx, {
            type : 'line',
            data,
            options: {}
        })
    }
}

window.addEventListener('load', () => {
    moment.locale('fr')

    getFacturesAttente()
    getFacturesRetard()
    getVentesProchaines()
    getStats()
})
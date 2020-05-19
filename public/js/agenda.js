/* eslint-disable no-undef */

let calendar = undefined

const handleError = response => {
    const infos = JSON.parse(response.xhr.response)
    let message = ''
    if(infos && infos.error) {
        message = infos.error
    }
    else {
        message = "Une erreur est survenue, impossible de charger les éléments de l'agenda."
    }
    alert(message)
}

document.addEventListener('DOMContentLoaded', () => {
    let calendarEl = document.getElementById('calendar')

    calendar = new FullCalendar.Calendar(calendarEl, {
        plugins : ['dayGrid', 'timeGrid'],
        height : 'auto',
        locale : 'fr',
        buttonText: {
            today:    "Aujourd'hui",
            month:    'Mois',
            week:     'Semaine',
            day:      'Jour'
        },
        eventTimeFormat : {
            hour : '2-digit',
            minute : '2-digit',
            hour12 : false,
            meridiem : false
        },
        eventOrder : 'start,title',
        defaultDate : new Date(),
        firstDay : 1,
        // 'dayGridMonth' 'dayGridWeek' 'dayGridDay', 'timeGridWeek' 'timeGridDay', 'dayGridWeek' 'timeGridWeek' , 'dayGridDay' 
        defaultView : 'timeGridWeek',
        header : {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        views : {
            timeGrid : {
                allDaySlot : false,
                slotEventOverlap: false,
                minTime : '08:00:00',
                maxTime : '22:00:00',
                nowIndicator : true
            },
            timeGridDay : {
                titleFormat : {
                    weekday : 'long',
                    day : 'numeric',
                    month : 'long',
                    year : 'numeric'
                },
                columnHeader : false
            },
            timeGridWeek : {
                navLinks : true,
            },
            dayGrid : {
                showNonCurrentDates : false,
            },
            dayGridMonth : {
                navLinks : true,
                weekNumbers : true,
                weekNumbersWithinDays : true,
            }
        },
        eventSources : [
            {
                url : '/agenda/estimations',
                method : 'GET',
                failure : handleError,
                color : 'purple'
            },
            {
                url : '/agenda/devis',
                method : 'GET',
                failure : handleError,
            }
        ],
        eventRender : function(info) {
            const tooltip = new Tooltip(info.el, {
                title: info.event.title,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            })
        }
    })

    calendar.render()
})
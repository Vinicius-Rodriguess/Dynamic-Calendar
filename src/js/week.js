import { MODAL } from "./modal.js"
import { CALENDAR } from "./calendar.js"

export const WEEK = {
    matrixWeek: [],
    matrixHourDay: [],
    currentWeek: null,
    allDayDays: [],
    objDateDay: {},
    objDateWeek: { mode: 'gridWeek' },

    nextDate() {
        CALENDAR.day = CALENDAR.day + 7

        if (CALENDAR.day > CALENDAR.getLastDayThisMonth()) {
            CALENDAR.day = 1
            CALENDAR.month++

            if (CALENDAR.month > 12) {
                CALENDAR.month = 1
                CALENDAR.year++
            }
        }
        WEEK.init()
    },

    previousDate() {
        CALENDAR.day = CALENDAR.day - 7

        if (CALENDAR.day < 1) {
            CALENDAR.month--
            CALENDAR.day = new Date(CALENDAR.year, CALENDAR.month + 1, 0).getDate()

            if (CALENDAR.month < 1) {
                CALENDAR.month = 12
                CALENDAR.year--
            }
        }

        WEEK.init()
    },

    changeWeek() {
        let line = []

        for (let i = -CALENDAR.getFirstDayOfWeek(); i < 42 - CALENDAR.getFirstDayOfWeek(); i++) {
            const date = new Date(CALENDAR.year, CALENDAR.month, i)

            const day = {}
            day.day = date.getDate()
            day.month = date.getMonth()

            line.push(day)
            if (line.length == 7) {
                WEEK.matrixWeek.push(line)
                line = []
            }
        }

        const lines = CALENDAR.getLineOfWeek(CALENDAR.day)
        const initialDate = WEEK.matrixWeek[lines][0]
        const finalDate = WEEK.matrixWeek[lines][6]

        const date = `${initialDate.day.toString().padStart(2, '0')} ${CALENDAR.listMonths[initialDate.month]} - ${finalDate.day.toString().padStart(2, '0')} ${CALENDAR.listMonths[finalDate.month]}`
        WEEK.currentWeek = WEEK.matrixWeek[lines]

        CALENDAR.week = date
        CALENDAR.updateDates()
    },

    init() {
        CALENDAR.container.innerHTML = ''

        CALENDAR.dayHtml.classList.add('hide')
        CALENDAR.weekHtml.classList.remove('hide')
        CALENDAR.monthHtml.classList.add('hide')

        WEEK.matrixHourDay = []
        WEEK.matrixWeek = []

        const container = document.createElement('div')
        container.classList.add('w-container-week')

        WEEK.changeWeek()

        container.appendChild(WEEK.divWeek())
        container.appendChild(WEEK.divAllDay())
        container.appendChild(WEEK.divHours())

        CALENDAR.container.appendChild(container)

        WEEK.render(CALENDAR.events)
    },

    divWeek() {
        const divWeek = document.createElement('div')
        divWeek.classList.add('w-grid')

        const firstChild = document.createElement('div')
        firstChild.classList.add('w-day-week')
        divWeek.appendChild(firstChild)

        CALENDAR.daysOfWeek.forEach((day, i) => {
            const child = document.createElement('div')
            child.innerHTML += `${day.slice(0, 3)} ${WEEK.currentWeek[i].day.toString().padStart(2, '0')}/${WEEK.currentWeek[i].month.toString().padStart(2, '0')}`
            child.classList.add('w-day-week')
            divWeek.appendChild(child)
        })

        return divWeek
    },

    divAllDay() {
        const divAllDay = document.createElement('div')
        divAllDay.classList.add('w-grid')

        const day = document.createElement('div')
        day.classList.add('w-area', 'w-all-day-txt')
        day.innerHTML = 'O dia todo'
        divAllDay.appendChild(day)

        for (let i = 0; i < 7; i++) {
            const day = document.createElement('div')
            day.classList.add('w-area', 'w-all-day')

            day.day = WEEK.currentWeek[i].day
            day.month = WEEK.currentWeek[i].month
            day.year = CALENDAR.year
            day.date = new Date(day.year, day.month, day.day)

            if (day.day == CALENDAR.currentDay && day.month == CALENDAR.currentMonth && day.year == CALENDAR.currentYear) day.classList.add('w-today')

            WEEK.allDayDays.push(day)

            day.addEventListener('dragenter', () => WEEK.updatePosition({ day: CALENDAR.formatDate(new Date(day.year, day.month, day.day)) }))

            day.addEventListener('click', () => {
                MODAL.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                MODAL.open()
            })

            day.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('w-all-day')) return
                CALENDAR.selecting = true
                WEEK.objDateDay.initial = day.date
            })

            day.addEventListener('mousemove', () => {
                if (!CALENDAR.selecting) return
                WEEK.objDateDay.final = day.date
                const D = WEEK.objDateDay
                WEEK.allDayDays.forEach(day => {
                    day.classList.remove('selected')
                    const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                    if (isDayInRange) day.classList.add('selected')
                })
            })

            day.addEventListener('mouseup', () => {
                CALENDAR.selecting = false
                WEEK.allDayDays.forEach(day => day.classList.remove('selected'))
                MODAL.open()
                MODAL.updateDate(WEEK.objDateDay)
            })

            divAllDay.appendChild(day)
        }

        return divAllDay
    },

    divHours() {
        const divHours = document.createElement('div')
        divHours.classList.add('w-grid', 'w-container-hours')

        for (let i = 0; i < 48; i++) {
            const hora = document.createElement('div')
            hora.classList.add('w-area', 'w-number-hour')

            const hours = Math.floor(i / 2)
            const minutes = i % 2 === 0 ? 0 : 30

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            hora.innerHTML = formattedTime

            divHours.appendChild(hora)
            const line = []

            for (let j = 0; j < 7; j++) {
                const area = document.createElement('div')
                area.classList.add('w-area', 'w-hour')

                area.hours = hours
                area.minutes = minutes

                area.day = WEEK.currentWeek[j].day
                area.month = WEEK.currentWeek[j].month
                area.year = CALENDAR.year
                area.date = new Date(CALENDAR.year, WEEK.currentWeek[j].month, WEEK.currentWeek[j].day).setHours(hours, minutes)

                if (area.day == CALENDAR.currentDay && area.month == CALENDAR.currentMonth && area.year == CALENDAR.currentYear) area.classList.add('w-today')

                area.addEventListener('click', () => MODAL.open())

                area.addEventListener('dragenter', () => {
                    if (area.change) {
                        WEEK.updatePosition({
                            dataHour: CALENDAR.formatDate(new Date(new Date(area.date).setHours(hours, minutes))),
                            day: CALENDAR.formatDate(new Date(area.date)),
                        })
                        area.change = false
                    }
                })

                area.addEventListener('dragleave', () => area.change = true)

                area.addEventListener('mousedown', (e) => {
                    if (!e.target.classList.contains('w-hour')) return
                    CALENDAR.selecting = true
                    WEEK.objDateWeek.initial = area.date
                })

                area.addEventListener('mousemove', () => {
                    if (!CALENDAR.selecting) return
                    WEEK.objDateWeek.final = area.date

                    WEEK.matrixHourDay.forEach(line => {
                        line.forEach(hour => {
                            if (hour.date <= WEEK.objDateWeek.initial && hour.date >= WEEK.objDateWeek.final ||
                                hour.date >= WEEK.objDateWeek.initial && hour.date <= WEEK.objDateWeek.final) {
                                hour.classList.add('selected')
                            } else {
                                hour.classList.remove('selected')
                            }
                        })
                    })
                })

                area.addEventListener('mouseup', () => {
                    CALENDAR.selecting = false
                    WEEK.matrixHourDay.forEach(line => line.forEach(hour => hour.classList.remove('selected')))
                    MODAL.updateDate(WEEK.objDateWeek)
                    MODAL.open()
                })

                line.push(area)
                divHours.appendChild(area)
            }
            WEEK.matrixHourDay.push(line)
        }

        return divHours
    },

    render(event) {
        event.forEach(event => {
            const initialDate = new Date(event.initialDate)

            const diaInicialDaSemana = WEEK.currentWeek[0].day
            const diaFinalDaSemana = WEEK.currentWeek[6].day

            if (initialDate.getDate() < diaInicialDaSemana ||
                initialDate.getDate() > diaFinalDaSemana ||
                initialDate.getMonth() + 1 !== CALENDAR.month ||
                initialDate.getFullYear() !== CALENDAR.year) return

            const initialDay = new Date(event.initialDate).getDate()
            const finalDay = new Date(event.finalDate).getDate()

            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()

            const initialMinutes = new Date(event.initialDate).getMinutes()
            const finalMinutes = new Date(event.finalDate).getMinutes()

            const daysLong = finalDay - initialDay
            const heightColumn = 32.95

            event.elements = []

            if (event.allDay) {
                event.height = heightColumn * 2
                const element = WEEK.createHtml(event)
                const totalDaysDay = document.querySelectorAll('.w-all-day')
                totalDaysDay[initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            if (daysLong == 0) {

                if (initialMinutes >= 30) event.index = (initialHour * 2) + 1
                else event.index = initialHour * 2

                if (finalMinutes >= 30) event.height = (((finalHour - initialHour) * 2) + 2) * heightColumn
                else event.height = (((finalHour - initialHour) * 2) + 1) * heightColumn

                const element = WEEK.createHtml(event)
                WEEK.matrixHourDay[event.index][initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            let index = initialDate.getDay()

            for (let i = initialDay; i <= finalDay; i++) {
                if (index > 6) return

                if (i == initialDay) {

                    if (initialMinutes >= 30) event.index = (initialHour * 2) + 1
                    else event.index = initialHour * 2

                    if (initialMinutes >= 30) event.height = (46 - initialHour) * heightColumn
                    else event.height = (48 - (initialHour * 2)) * heightColumn

                    const element = WEEK.createHtml(event)
                    WEEK.matrixHourDay[event.index][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i > initialDay && i < finalDay) {
                    event.height = 48 * heightColumn
                    const element = WEEK.createHtml(event)
                    WEEK.matrixHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i == finalDay) {
                    if (finalMinutes >= 30) event.height = ((finalHour * 2) + 2) * heightColumn
                    else event.height = ((finalHour * 2) + 1) * heightColumn

                    const element = WEEK.createHtml(event)
                    WEEK.matrixHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                index++
            }
        })
    },

    createHtml(event) {
        const container = document.createElement('div')
        container.classList.add('w-event')
        container.style.backgroundColor = event.tag.color
        container.draggable = 'true'
        container.style.height = `${event.height}px`

        const divDay = document.createElement('div')
        divDay.classList.add('w-event-value')
        divDay.addEventListener('mousedown', () => event.action = 'day')

        const divHour = document.createElement('div')
        divHour.classList.add('w-tip')
        divHour.innerHTML = '-'
        divHour.addEventListener('mousedown', () => event.action = 'hour')

        container.appendChild(divDay)
        container.appendChild(divHour)

        container.addEventListener('click', () => {
            MODAL.open()
            MODAL.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            CALENDAR.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    },

    updatePosition(data) {
        const eventDragged = CALENDAR.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'day') {
            const duration = new Date(eventDragged.finalDate).getDate() - new Date(eventDragged.initialDate).getDate()

            const dataInicial = new Date(data.day)
            dataInicial.setHours(new Date(eventDragged.initialDate).getHours())
            dataInicial.setMonth(dataInicial.getMonth() + 1)

            const dataFinal = new Date(data.day)
            dataFinal.setHours(new Date(eventDragged.finalDate).getHours())
            dataFinal.setDate(dataFinal.getDate() + duration)
            dataFinal.setMonth(dataFinal.getMonth() + 1)

            eventDragged.initialDate = CALENDAR.formatDate(dataInicial)
            eventDragged.finalDate = CALENDAR.formatDate(dataFinal)

        } else {
            eventDragged.finalDate = data.dataHour
        }

        CALENDAR.orderDates(eventDragged)

        eventDragged.elements.forEach(element => element.remove())
        WEEK.render([eventDragged])
    },
}
import { modal, modalTag } from "./modais.js"

export const calendar = {
    listMonths: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    daysOfWeek: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"],

    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    currentDay: new Date().getDate(),

    month: new Date().getMonth(),
    week: 1,
    year:  new Date().getFullYear(),
    day: new Date().getDate(),

    container: document.querySelector(".container-general"),
    mode: "week",

    dayHtml: document.querySelector("#day"),
    weekHtml: document.querySelector("#week"),
    monthHtml: document.querySelector("#month"),
    yearHtml: document.querySelector("#year"),

    events: [
        // { id: 0, title: "1 Lembrete", description: "Sou um lembre muito importante.", initialDate: "2024-06-11T02:25", finalDate: "2024-06-14T21:26", tag: { name: "trabalho", color: "red" } },
        { id: 1, title: "10 Lembrete", description: "Sou um lembre muito importante.", initialDate: "2024-06-04T02:25", finalDate: "2024-06-05T21:26", tag: { name: "trabalho", color: "gray" } },
        // { id: 2, title: "2 Lembrete", description: "Sou um lembre muito importante.", initialDate: "2024-06-02T03:25", finalDate: "2024-06-02T04:26", tag: { name: "escola", color: "orange" } },
        // { id: 3, title: "3 Lembrete", description: "Sou um lembre muito importante.", initialDate: "2024-06-06T05:25", finalDate: "2024-06-07T21:26", tag: { name: "trabalho", color: "green" } },
        // { id: 5, title: "5 Lembrete", description: "Sou um lembre muito importante.", initialDate: "2024-06-11T02:25", finalDate: "2024-06-21T21:26", tag: { name: "trabalho", color: "blue" } },
        // { id: 6, title: "66666", description: "Sou um lembre muito importante.", initialDate: "2024-06-10T02:25", finalDate: "2024-06-10T21:26", tag: { name: "trabalho", color: "blue" }, allDay: true},
    ],

    init() {
        document.querySelector("#addEvent").addEventListener("click", () => modal.open())
        document.querySelector("#today").addEventListener("click", () => calendar.today())
        document.querySelector("#btnWeek").addEventListener("click", () => modeWeek.init())
        document.querySelector("#btnOneDay").addEventListener("click", () => modeDay.init())
        document.querySelector("#btnList").addEventListener("click", () => modeList.init())
        document.querySelector("#btnMonth").addEventListener("click", () => modeMonth.init())
        document.querySelector("#btnBackMonth").addEventListener("click", () => calendar.previusDate())
        document.querySelector("#btnNextMonth").addEventListener("click", () => calendar.nextDate())

        modeMonth.init()
        calendar.updateDates()
    },

    today() {
        calendar.month = calendar.currentMonth
        calendar.year = calendar.currentYear
        calendar.day = calendar.currentDay

        if (calendar.mode === "week") modeWeek.init()
        if (calendar.mode === "day") modeDay.init()
        if (calendar.mode === "list") modeList.init()
        if (calendar.mode === "month") modeMonth.init()

        calendar.updateDates()
    },

    validEvent() {
        const fields = [...modal.form]
        const emptyField = fields.find(field => field.value == "")

        if (emptyField) {
            const fieldErro = document.querySelector("#error-mensage")
            fieldErro.innerHTML = "Preencha todos os campos!"
            setTimeout(() => fieldErro.innerHTML = "", 5000)
            return false
        }

        return true
    },

    addEvent() {
        if (!calendar.validEvent()) return

        const event = {
            id: calendar.events.length + 1,
            title: modal.form.title.value,
            description: modal.form.description.value,
            initialDate: modal.form.initialDate.value,
            finalDate: modal.form.finalDate.value,
            tag: modal.inputTag,
            allDay: modal.form.allDay.checked
        }

        // isso vai ser um fetch
        calendar.events.push(event)

        if (calendar.mode === "week") modeWeek.render([event])
        if (calendar.mode === "day") modeDay.render([event])
        if (calendar.mode === "list") modeList.init()
        if (calendar.mode === "month") modeMonth.render([event])

    },

    updateEvent(event) {
        if (!calendar.validEvent()) return

        event.elements.forEach(e => e.remove())

        event.title = modal.form.title.value
        event.description = modal.form.description.value
        event.initialDate = modal.form.initialDate.value
        event.finalDate = modal.form.finalDate.value
        event.tag = modal.inputTag
        event.allDay = modal.form.allDay.checked

        if (modal.form.allDay.checked) event.finalDate = modal.form.initialDate.value

        if (calendar.mode === "week") modeWeek.render([event])
        if (calendar.mode === "day") modeDay.render([event])
        if (calendar.mode === "list") modeList.init()
        if (calendar.mode === "month") modeMonth.render([event])
    },

    removeEvent(event) {
        event.elements.forEach(e => e.remove())
        if (calendar.mode === "list") modeList.init()

        // isso vai ser um fetch
        calendar.events = calendar.events.filter(e => e.id != event.id)
    },

    formatDate(date) {
        return `${new Date(date).getFullYear()}-${(new Date(date).getMonth() + 1).toString().padStart(2, "0")}-${new Date(date).getDate().toString().padStart(2, "0")}T${new Date(date).getHours().toString().padStart(2, "0")}:${new Date(date).getMinutes().toString().padStart(2, "0")}`
    },

    nextDate() {
        if (calendar.mode === "week") modeWeek.nextDate()
        if (calendar.mode === "day") modeDay.nextDate()
        if (calendar.mode === "list") modeList.nextDate()
        if (calendar.mode === "month") modeMonth.nextDate()
    },

    previusDate() {
        if (calendar.mode === "week") modeWeek.previusDate()
        if (calendar.mode === "day") modeDay.previusDate()
        if (calendar.mode === "list") modeList.previusDate()
        if (calendar.mode === "month") modeMonth.previusDate()
    },

    updateDates() {
        calendar.dayHtml.innerHTML = calendar.day.toString().padStart(2, "0")
        calendar.weekHtml.innerHTML = calendar.week
        calendar.monthHtml.innerHTML = calendar.listMonths[calendar.month]
        calendar.yearHtml.innerHTML = calendar.year
    },
}

const modeDay = {
    eventDrag: null,
    getLastDayThisMonth: new Date(calendar.year, calendar.month + 1, 0).getDate(),


    nextDate() {
        calendar.day++

        if (calendar.day > modeDay.getLastDayThisMonth) {
            calendar.day = 1
            calendar.month++

            if (calendar.month > 11) {
                calendar.month = 0
                calendar.year++
            }
        }
        modeDay.init()
        calendar.updateDates()
    },

    previusDate() {
        calendar.day--

        if (calendar.day < 1) {
            calendar.month--
            calendar.day = new Date(calendar.year, calendar.month + 1, 0).getDate()

            if (calendar.month < 0) {
                calendar.month = 11
                calendar.year--
            }
        }
        modeDay.init()
        calendar.updateDates()
    },

    init() {
        calendar.mode = "day"
        calendar.container.innerHTML = ""

        calendar.dayHtml.classList.remove("hide")
        calendar.weekHtml.classList.add("hide")
        calendar.monthHtml.classList.remove("hide")

        const container = document.createElement("div")
        container.classList.add("container-day")

        container.appendChild(modeDay.divWeek())
        container.appendChild(modeDay.divAllDay())
        container.appendChild(modeDay.divHorus())

        calendar.container.appendChild(container)
        modeDay.render(calendar.events)
    },

    divWeek() {
        const divWeek = document.createElement("div")
        divWeek.innerHTML = "terça"
        divWeek.classList.add("week")
        return divWeek
    },

    divAllDay() {
        const divAllDay = document.createElement("div")
        divAllDay.classList.add("df")

        const allDay = document.createElement("span")
        allDay.innerHTML = "All Day"
        allDay.classList.add("all-day")
        divAllDay.appendChild(allDay)

        const area = document.createElement("div")
        area.classList.add("area-all-day")
        divAllDay.appendChild(area)
        area.addEventListener("click", () => modal.open())

        return divAllDay
    },

    divHorus() {
        const divHorus = document.createElement("div")
        divHorus.classList.add("dg")

        for (let i = 0; i < 24; i++) {
            const hour = document.createElement("div")
            hour.classList.add("hour")
            hour.innerHTML = `${i.toString().padStart(2, "0")}:00`

            const areaHour = document.createElement("div")
            areaHour.classList.add("area-hour")

            areaHour.addEventListener("click", () => modal.open())
            areaHour.addEventListener("dragenter", () => modeDay.updatePosition(i))

            divHorus.appendChild(hour)
            divHorus.appendChild(areaHour)
        }

        return divHorus
    },

    updatePosition(hour) {
        if (modeDay.eventDrag.action == "hourMais") {
            const newDate = new Date(modeDay.eventDrag.initialDate).setHours(hour)
            modeDay.eventDrag.initialDate = calendar.formatDate(newDate)
        }

        if (modeDay.eventDrag.action == "hourMenos") {
            const newDate = new Date(modeDay.eventDrag.finalDate).setHours(hour)
            modeDay.eventDrag.finalDate = calendar.formatDate(newDate)
        }

        modeDay.eventDrag.elements.forEach(e => e.remove())
        modeDay.render([modeDay.eventDrag])
    },

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const initialDay = new Date(event.initialDate).getDate()
            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()
            event.elements = []

            const heightColumn = 34.2

            if (initialDay !== calendar.day ||
                initialDate.getMonth() !== calendar.month ||
                initialDate.getFullYear() !== calendar.year) return

            if (event.allDay) {
                event.height = heightColumn
                const element = modeDay.createHtml(event)
                event.elements.push(element)
                document.querySelector(".area-all-day").appendChild(element)
                return
            }

            event.height = (finalHour - initialHour + 1) * heightColumn
            const element = modeDay.createHtml(event)
            event.elements.push(element)
            document.querySelectorAll(".area-hour")[initialHour].appendChild(element)
        })
    },

    createHtml(event) {
        const container = document.createElement("div")
        container.classList.add("event-day")
        container.style.backgroundColor = event.tag.color

        container.style.height = `${event.height}px`

        const divDay = document.createElement("div")
        divDay.classList.add("change-days")
        divDay.innerHTML = event.title
        divDay.addEventListener("mousedown", () => event.action = "hourMais")

        container.appendChild(divDay)

        container.addEventListener("click", () => {
            modal.open()
            modal.renderEvent(event)
        })

        if (event.allDay) return container

        const divHours = document.createElement("div")
        divHours.classList.add("change-hours")
        divHours.innerHTML = "-"
        divHours.addEventListener("mousedown", () => event.action = "hourMenos")
        container.appendChild(divHours)

        container.draggable = "true"

        container.addEventListener("dragstart", () => {
            modeDay.eventDrag = event
            container.classList.add("dragging")
        })

        container.addEventListener("dragend", () => {
            container.classList.remove("dragging")
        })

        return container
    }
}

const modeList = {

    nextDate() {
        calendar.month++
        if (calendar.month > 11) {
            calendar.month = 0
            calendar.year++
        }

        modeList.init()
        calendar.updateDates()
    },

    previusDate() {
        calendar.month--
        if (calendar.month < 0) {
            calendar.month = 11
            calendar.year--
        }

        modeList.init()
        calendar.updateDates()
    },

    init() {
        calendar.mode = "list"
        calendar.container.innerHTML = ""

        calendar.dayHtml.classList.add("hide")
        calendar.weekHtml.classList.add("hide")
        calendar.monthHtml.classList.remove("hide")

        const container = document.createElement("div")
        container.classList.add("container-list")

        modeList.render(container)

        calendar.container.appendChild(container)
    },


    render(containerList) {
        const placedDays = []

        calendar.events.forEach(event => {
            const date = new Date(event.initialDate)
            const existingDay = placedDays.find(dias => dias.date.getTime() === date.getTime())

            if (date.getMonth() !== calendar.month || date.getFullYear() !== calendar.year) return

            if (existingDay) {
                existingDay.element.appendChild(modeList.createHtml(event, date))
                return
            }

            const container = document.createElement("div")
            container.appendChild(modeList.createListHeader(date))
            container.appendChild(modeList.createHtml(event))

            containerList.appendChild(container)
            placedDays.push({ date: date, element: container })
        })
    },

    createListHeader(date) {
        const daySem = document.createElement("div")
        daySem.classList.add("day-list")

        const span = document.createElement("span")
        span.innerHTML = `${date.getDate().toString().padStart(2, "0")} - ${calendar.listMonths[date.getMonth()]},  ${date.getFullYear()}`

        const span2 = document.createElement("span")
        span2.innerHTML = calendar.daysOfWeek[date.getDay()]

        daySem.appendChild(span)
        daySem.appendChild(span2)

        return daySem
    },

    createHtml(event) {
        const initDate = new Date(event.initialDate)
        const finDate = new Date(event.finalDate)

        const eventList = document.createElement("div")
        eventList.classList.add("event-list")

        const span = document.createElement("span")
        span.innerHTML += `${initDate.getHours().toString().padStart(2, "0")}:${initDate.getMinutes().toString().padStart(2, "0")} - ${finDate.getHours().toString().padStart(2, "0")}:${finDate.getMinutes().toString().padStart(2, "0")}`
        if (event.allDay) span.innerHTML = "All Day"

        eventList.appendChild(span)

        const container = document.createElement("div")
        container.classList.add("evento-list")
        container.style.backgroundColor = event.tag.color
        container.innerHTML = event.title

        eventList.addEventListener("click", () => {
            modal.open()
            modal.renderEvent(event)
        })

        eventList.appendChild(container)

        event.elements = [eventList]

        return eventList
    },
}

const modeWeek = {
    matrizWeek: [],
    eventDrag: null,
    currentWeek: null,

    nextDate() {
        calendar.day = calendar.day + 7

        if (calendar.day > modeDay.getLastDayThisMonth) {
            calendar.day = 1
            calendar.month++

            if (calendar.month > 11) {
                calendar.month = 0
                calendar.year++
            }
        }

        modeWeek.init()
    },

    previusDate() {
        calendar.day = calendar.day - 7

        if (calendar.day < 1) {
            calendar.month--
            calendar.day = new Date(calendar.year, calendar.month + 1, 0).getDate()

            if (calendar.month < 0) {
                calendar.month = 11
                calendar.year--
            }
        }

        modeWeek.init()
    },

    changeWeek() {
        const firstDayOfWeek = new Date(calendar.year, calendar.month, 1).getDay() - 1
        let line = []

        for (let i = -firstDayOfWeek; i < 42 - firstDayOfWeek; i++) {
            const date = new Date(calendar.year, calendar.month, i)

            const day = {}
            day.day = date.getDate()
            day.month = date.getMonth()

            line.push(day)
            if (line.length == 7) {
                modeWeek.matrizWeek.push(line)
                line = []
            }
        }

        const lines = +(((calendar.day + modeMonth.firstDayOfWeek) / 7).toString().slice(0, 1))
        const initialDate = modeWeek.matrizWeek[lines][0]
        const finalDate = modeWeek.matrizWeek[lines][6]

        const date = `${initialDate.day.toString().padStart(2, "0")} ${calendar.listMonths[initialDate.month]} - ${finalDate.day.toString().padStart(2, "0")} ${calendar.listMonths[finalDate.month]}`
        modeWeek.currentWeek = modeWeek.matrizWeek[lines]

        calendar.week = date
        calendar.updateDates()
    },

    init() {
        calendar.mode = "week"
        calendar.container.innerHTML = ""

        calendar.dayHtml.classList.add("hide")
        calendar.weekHtml.classList.remove("hide")
        calendar.monthHtml.classList.add("hide")

        modeWeek.matrizHourDay = []
        modeWeek.matrizWeek = []

        const container = document.createElement("div")
        container.classList.add("container-week")
        
        modeWeek.changeWeek()

        container.appendChild(modeWeek.divWeek())
        container.appendChild(modeWeek.divAllDay())
        container.appendChild(modeWeek.divHours())

        calendar.container.appendChild(container)

        modeWeek.render(calendar.events)
    },

    divWeek() {
        const divWeek = document.createElement("div")
        divWeek.classList.add("grid")

        const firstChild = document.createElement("div")
        firstChild.classList.add("week-day")
        divWeek.appendChild(firstChild)

        calendar.daysOfWeek.forEach((day, i) => {
            const child = document.createElement("div")
            child.innerHTML = day.slice(0, 3)
            child.innerHTML += ` - ${modeWeek.currentWeek[i].day.toString().padStart(2, "0")}/${modeWeek.currentWeek[i].month.toString().padStart(2, "0")}`
            child.classList.add("week-day")
            divWeek.appendChild(child)
        })

        return divWeek
    },

    divAllDay() {
        const divAllDay = document.createElement("div")
        divAllDay.classList.add("grid")

        const day = document.createElement("div")
        day.classList.add("area")
        day.innerHTML = "All Day"
        divAllDay.appendChild(day)

        for (let i = 0; i < 7; i++) {
            const day = document.createElement("div")
            day.classList.add("area", "diaTodo")

            day.day = modeWeek.currentWeek[i].day
            day.month = modeWeek.currentWeek[i].month

            day.addEventListener("dragenter", () => {
                modeWeek.updatePosition({ day: calendar.formatDate(new Date(2024, 5 - 1, i + 1)) })
            })

            day.addEventListener("click", () => modal.open())

            divAllDay.appendChild(day)
        }

        return divAllDay
    },

    divHours() {
        const divHours = document.createElement("div")
        divHours.classList.add("grid", "cont-hours")

        for (let i = 0; i < 24; i++) {
            const hora = document.createElement("div")
            hora.classList.add("area", "xx")
            hora.innerHTML = `${i.toString().padStart(2, "0")}:00`

            divHours.appendChild(hora)
            let hours = i
            const line = []

            for (let j = 0; j < 7; j++) {
                const area = document.createElement("div")
                area.classList.add("area", "hora")

                area.time = hours

                area.day = modeWeek.currentWeek[j].day
                area.month = modeWeek.currentWeek[j].month
                area.year = calendar.year

                if (area.day == calendar.currentDay && area.month == calendar.currentMonth && area.year == calendar.currentYear) {
                    area.classList.add("today-week")
                }

                area.addEventListener("click", () => modal.open())

                area.addEventListener("dragenter", () => {
                    const timeZoneOffset = new Date().getTimezoneOffset() / 60
                    modeWeek.updatePosition({
                        dataHour: calendar.formatDate(new Date(new Date(2024, 5 - 1, area.day).setHours(area.time - timeZoneOffset))),
                        day: calendar.formatDate(new Date(2024, 5 - 1, area.day)),
                    })
                })

                line.push(area)
                divHours.appendChild(area)
            }
            modeWeek.matrizHourDay.push(line)
        }

        return divHours
    },

    render(event) {
        event.forEach(event => {
            const initialDate = new Date(event.initialDate)
         
            const diaInicialDaSemana = modeWeek.currentWeek[0].day
            const diaFinalDaSemana = modeWeek.currentWeek[6].day

            if (initialDate.getDate() < diaInicialDaSemana || 
                initialDate.getDate() > diaFinalDaSemana || 
                initialDate.getMonth() !== calendar.month || 
                initialDate.getFullYear() !== calendar.year) return


            const initialDay = new Date(event.initialDate).getDate()
            const finalDay = new Date(event.finalDate).getDate()
            
            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()

            const diasDeDuracao = finalDay - initialDay
            const heightColumn = 34.2

            event.elements = []

            if (event.allDay) {
                event.height = heightColumn * 2
                const element = modeWeek.createHtml(event)
                const areasDay = document.querySelectorAll(".diaTodo")
                areasDay[initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            if (diasDeDuracao == 0) {
                event.height = (finalHour - initialHour + 1) * heightColumn
                const element = modeWeek.createHtml(event)
                modeWeek.matrizHourDay[initialHour][initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            let index = initialDate.getDay()

            for (let i = initialDay; i <= finalDay; i++) {
                if (index > 6) return

                if (i == initialDay) {
                    event.height = (23 - initialHour) * heightColumn
                    const element = modeWeek.createHtml(event)
                    modeWeek.matrizHourDay[initialHour][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i > initialDay && i < finalDay) {
                    event.height = 23 * heightColumn
                    const element = modeWeek.createHtml(event)
                    modeWeek.matrizHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i == finalDay) {
                    event.height = finalHour * heightColumn
                    const element = modeWeek.createHtml(event)
                    modeWeek.matrizHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                index++
            }
        })
    },

    createHtml(event) {
        const container = document.createElement("div")
        container.classList.add("event")
        container.style.backgroundColor = event.tag.color
        container.draggable = "true"
        container.style.height = `${event.height}px`

        const divDay = document.createElement("div")
        divDay.classList.add("change-days")
        divDay.innerHTML = event.title
        divDay.addEventListener("mousedown", () => event.action = "day")

        const divHour = document.createElement("div")
        divHour.classList.add("change-hours")
        divHour.innerHTML = "-"
        divHour.addEventListener("mousedown", () => event.action = "hour")

        container.appendChild(divDay)
        container.appendChild(divHour)


        container.addEventListener("click", () => {
            modal.open()
            modal.renderEvent(event)
        })

        container.addEventListener("dragstart", () => {
            modeWeek.eventDrag = event
            container.classList.add("dragging")
        })

        container.addEventListener("dragend", () => container.classList.remove("dragging"))

        return container
    },

    updatePosition(data) {
        if (modeWeek.eventDrag.action == "day") {
            const duration = new Date(modeWeek.eventDrag.finalDate).getDate() - new Date(modeWeek.eventDrag.initialDate).getDate()

            const dataInicial = new Date(data.day)
            dataInicial.setHours(new Date(modeWeek.eventDrag.initialDate).getHours())

            const dataFinal = new Date(data.day)
            dataFinal.setHours(new Date(modeWeek.eventDrag.finalDate).getHours())
            dataFinal.setDate(dataFinal.getDate() + duration)

            modeWeek.eventDrag.initialDate = calendar.formatDate(dataInicial)
            modeWeek.eventDrag.finalDate = calendar.formatDate(dataFinal)
        } else {
            modeWeek.eventDrag.finalDate = data.dataHour
        }

        if (new Date(modeWeek.eventDrag.initialDate) > new Date(modeWeek.eventDrag.finalDate)) {
            [modeWeek.eventDrag.initialDate, modeWeek.eventDrag.finalDate] = [modeWeek.eventDrag.finalDate, modeWeek.eventDrag.initialDate]
        }

        modeWeek.eventDrag.elements.forEach(element => element.remove())
        modeWeek.render([modeWeek.eventDrag])
    },
}

const modeMonth = {
    matrizDays: [],
    areas: 42,
    getLastDayThisMonth: new Date(calendar.year, calendar.month + 1, 0).getDate(),
    firstDayOfWeek: new Date(calendar.year, calendar.month, 1).getDay() - 1,
    eventDrag: null,

    nextDate() {
        calendar.month++
        if (calendar.month > 11) {
            calendar.month = 0
            calendar.year++
        }

        modeMonth.init()
        calendar.updateDates()
    },

    previusDate() {
        calendar.month--
        if (calendar.month < 0) {
            calendar.month = 11
            calendar.year--
        }

        modeMonth.init()
        calendar.updateDates()
    },

    init() {
        calendar.mode = "month"
        calendar.container.innerHTML = ""

        calendar.dayHtml.classList.add("hide")
        calendar.weekHtml.classList.add("hide")
        calendar.monthHtml.classList.remove("hide")

        modeMonth.matrizDays = []

        const container = document.createElement("div")
        container.classList.add("container-month")

        container.appendChild(modeMonth.createWeek())
        container.appendChild(modeMonth.createDays())

        calendar.container.appendChild(container)
        modeMonth.render(calendar.events)
    },

    createWeek() {
        const container = document.createElement("div")
        container.classList.add("div-week")

        calendar.daysOfWeek.forEach(d => {
            const day = document.createElement("div")
            day.innerHTML = d.slice(0, 3)
            day.classList.add("week-day")
            container.appendChild(day)
        })

        return container
    },

    createDays() {
        const containerDays = document.createElement("div")
        containerDays.classList.add("container-days")

        const indexArea = modeMonth.areas - modeMonth.firstDayOfWeek
        let line = []

        for (let i = -modeMonth.firstDayOfWeek; i < indexArea; i++) {
            const date = new Date(calendar.year, calendar.month, i)

            const day = document.createElement("div")
            day.classList.add("day")
            day.date = date.getDate()
            day.monthDate = date.getMonth()
            day.innerHTML += `<div class="number-day">${date.getDate()}</div>`

            if (date.getFullYear() == calendar.currentYear &&
                date.getMonth() == calendar.currentMonth &&
                date.getDate() == calendar.currentDay) {
                day.classList.add("today")
            }

            if (i < 1) {
                day.classList.add("disable")
            }

            if (i > modeMonth.getLastDayThisMonth) {
                day.classList.add("disable")
            }

            day.addEventListener("click", () => modal.open())

            line.push(day)
            if (line.length == 7) {
                modeMonth.matrizDays.push(line)
                line = []
            }

            day.addEventListener("dragenter", () => {
                if (day.podeMudar) {
                    modeMonth.updatePosition(day)
                    day.podeMudar = false
                }
            })

            day.addEventListener("dragleave", () => {
                
                day.podeMudar = true
            })

            containerDays.appendChild(day)
        }

        return containerDays
    },

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const finalDate = new Date(event.finalDate)
            const line = +(((initialDate.getDate() + modeMonth.firstDayOfWeek) / 7).toString().slice(0, 1))
            const widthEvent = 7.5
            let diasDeDuracao = finalDate.getDate() - initialDate.getDate() + 1

            if (initialDate.getMonth() !== calendar.month || initialDate.getFullYear() !== calendar.year) return

            if ((initialDate.getDay() + diasDeDuracao) > 7) {
                event.width = (7 - initialDate.getDay()) * widthEvent
                modeMonth.matrizDays[line][initialDate.getDay()].appendChild(modeMonth.createEvent(event))
                diasDeDuracao = diasDeDuracao - (7 - initialDate.getDay())
                let i = 1

                while (diasDeDuracao > 7) {
                    event.width = 7 * widthEvent
                    modeMonth.matrizDays[line + i][0].appendChild(modeMonth.createEvent(event))
                    diasDeDuracao = diasDeDuracao - 7
                    i++
                }

                event.width = diasDeDuracao * widthEvent
                modeMonth.matrizDays[line + i][0].appendChild(modeMonth.createEvent(event))
                return

            }
            
            event.width = diasDeDuracao * widthEvent
            modeMonth.matrizDays[line][initialDate.getDay()].appendChild(modeMonth.createEvent(event))
        })
    },

    createEvent(event) {
        const container = document.createElement("div")
        container.classList.add("event-month")
        container.style.backgroundColor = event.tag.color
        container.draggable = "true"
        container.style.width = `${event.width}rem`

        const arrastaMenos = document.createElement("div")
        arrastaMenos.innerHTML = "|"
        arrastaMenos.addEventListener("mousedown", () => event.action = "arrastaMenos")
        arrastaMenos.classList.add("rasta")

        const evento = document.createElement("div")
        evento.innerHTML = event.title
        evento.classList.add("event-sub")
        evento.addEventListener("mousedown", () => event.action = "arrastaTudo")

        const arrastaMais = document.createElement("div")
        arrastaMais.innerHTML = "|"
        arrastaMais.addEventListener("mousedown", () => event.action = "arrastaMais")
        arrastaMais.classList.add("rasta")

        container.appendChild(arrastaMenos)
        container.appendChild(evento)
        container.appendChild(arrastaMais)

        container.addEventListener("click", () => {
            modal.open()
            modal.renderEvent(event)
        })

        container.addEventListener("dragstart", () => {
            modeMonth.eventDrag = event
            container.classList.add("dragging")
        })

        container.addEventListener("dragend", () => container.classList.remove("dragging"))

        event.elements = [container]
        return container
    },

    updatePosition(date) {
        console.log("foi    ")
        if (modeMonth.eventDrag.action == "arrastaMenos") {
            modeMonth.eventDrag.initialDate = calendar.formatDate(new Date(calendar.year, date.monthDate, date.date))
        }

        if (modeMonth.eventDrag.action == "arrastaTudo") {
            const initialDate = new Date(modeMonth.eventDrag.initialDate);
            const finalDate = new Date(modeMonth.eventDrag.finalDate);
            const duration = finalDate.getDate() - initialDate.getDate();

            const newDate = new Date(calendar.year, date.monthDate, date.date);
            modeMonth.eventDrag.initialDate = calendar.formatDate(newDate);
            modeMonth.eventDrag.finalDate = calendar.formatDate(new Date(newDate.setDate(newDate.getDate() + duration)))
        }

        if (modeMonth.eventDrag.action == "arrastaMais") {
            modeMonth.eventDrag.finalDate = calendar.formatDate(new Date(calendar.year, date.monthDate, date.date))
        }

        modeMonth.eventDrag.elements.forEach(e => e.remove())
        modeMonth.render([modeMonth.eventDrag])
    },
}

modal.initialize()
modalTag.initialize()
calendar.init()
import { Calendar } from './calendar.js'

export class Modal {
    constructor() {
        this.element = document.querySelector(".mod-add-event")
        this.form = document.querySelector("#modal-form")    
        this.elementTag = document.querySelector(".mod-tags")
        this.formTag = document.querySelector("#form-modalTags")
        this.btnSave = document.querySelector("#btn-save-modal")
        this.btnEdit = document.querySelector("#btn-edit-modal")
        this.btnRemove = document.querySelector("#btn-remove")
        this.btnClose = document.querySelector("#btn-close-modal")
        this.event
        this.inputTag
        this.optionSelect = document.createElement("p")
        this.tags = [
            { name: "Urgente", color: "red", },
            { name: "Importante", color: "orange", },
            { name: "Normal", color: "blue", },
            { name: "Secretaria", color: "purple", },
            { name: "Financeiro", color: "gray", },
        ]
    }

    init() {
        this.calendar = new Calendar()

        document.querySelector("#btn-close-modal-tag").addEventListener("click", () => {
            this.close(this.elementTag)
        })
        document.querySelector("#btn-save-modal-tag").addEventListener("click", () => {
            this.createTag()
        })
        this.btnClose.addEventListener("click", () => {
            this.close(this.element)
        })
        this.btnSave.addEventListener("click", () => {
            this.calendar.addEvent()
        })
        this.btnEdit.addEventListener("click", () => {
            this.calendar.updateEvent(this.event)
            this.close(this.element)
        })
        this.btnRemove.addEventListener("click", () => {
            this.calendar.removeEvent(this.event)
            this.close(this.element)
        })
        this.form.initialDate.addEventListener("input", () => {
            if (this.form.finalDate.value == "" || this.form.allDay.checked) {
                this.form.finalDate.value = this.form.initialDate.value
            }
        })
        this.form.allDay.addEventListener("input", () => {
            if (this.form.finalDate.disabled) {
                this.form.finalDate.disabled = false
                this.form.finalDate.value = this.form.initialDate.value
                return
            }
            this.form.finalDate.disabled = true
            this.form.finalDate.value = this.form.initialDate.value
        })

        this.createTags()
    }

    open(element) {
        element.classList.remove("hide")
    }

    close(element) {
        this.clean()
        element.classList.add("hide")
    }

    clean() {
        this.optionSelect.innerHTML = "Escolha uma Tag"
        this.form.reset()
        this.formTag.reset()
        this.btnRemove.classList.add("hide")
        this.btnEdit.classList.add("hide")
        this.btnSave.classList.remove("hide")
        this.event = null
    }

    updateDate(data) {
        if (data.mode == "onlyDay") {
            const date = this.calendar.formatDate(new Date(data.year, data.month, data.day))
            this.form.initialDate.value = date
            this.form.finalDate.value = date
            return
        }

        let dateInitial = this.calendar.formatDate(data.initial)
        let dateFinal = this.calendar.formatDate(data.final)

        if (data.mode == "day") {            
            dateInitial = this.calendar.formatDate(new Date(this.calendar.year, this.calendar.month, this.calendar.day).setHours(data.initial))
            dateFinal = this.calendar.formatDate(new Date(this.calendar.year, this.calendar.month, this.calendar.day).setHours(data.final))
        }

        if (data.mode == "gridWeek") {
            dateInitial = this.calendar.formatDate(data.initial)
            dateFinal = this.calendar.formatDate(data.final)
        }

        if (new Date(dateInitial) < new Date(dateFinal)) {
            this.form.initialDate.value = dateInitial
            this.form.finalDate.value = dateFinal
        } else {
            this.form.initialDate.value = dateFinal
            this.form.finalDate.value = dateInitial
        }
    }

    renderEvent(event) {
        this.event = event
        this.form.title.value = event.title
        this.form.description.value = event.description
        this.form.initialDate.value = event.initialDate
        this.form.finalDate.value = event.finalDate
        if (event.allDay) this.form.allDay.checked = true
        this.changeOptionSelect(event.tag)
        this.btnRemove.classList.remove("hide")
        this.btnEdit.classList.remove("hide")
        this.btnSave.classList.add("hide")
    }

    createTags() {
        this.element.addEventListener("click", (e) => {
            if (e.target.classList.contains("mod-option-select") || e.target.classList.contains("mod-container-tag")) return
            if (!e.target.classList.contains("mod-container-options")) containerOptions.classList.add("hide")
        })

        const containerTag = document.querySelector(".mod-container-tag")
        containerTag.addEventListener("click", () => containerOptions.classList.toggle("hide"))

        this.optionSelect.classList.add("mod-option-select")
        this.optionSelect.innerHTML = "Escolha uma Tag"

        const containerOptions = document.createElement("div")
        containerOptions.classList.add("mod-container-options", "hide")

        this.tags.forEach(tag => {
            const option = document.createElement("p")
            option.classList.add("mod-option")

            const color = this.createColor(tag)

            option.appendChild(color)
            option.innerHTML += tag.name

            option.addEventListener("click", () => this.changeOptionSelect(tag))

            containerOptions.appendChild(option)
        })

        const newTag = document.createElement("p")
        newTag.classList.add("mod-option")
        newTag.innerHTML = "+ Nova Tag"
        newTag.addEventListener("click", () => this.open(this.elementTag))

        containerOptions.appendChild(newTag)

        containerTag.appendChild(this.optionSelect)
        containerTag.appendChild(containerOptions)
    }

    createColor(tag) {
        const color = document.createElement("span")
        color.classList.add("mod-circle")
        color.style.backgroundColor = tag.color
        return color
    }

    changeOptionSelect(tag) {
        this.optionSelect.innerHTML = ""
        this.optionSelect.appendChild(this.createColor(tag))
        this.optionSelect.innerHTML += tag.name
        this.inputTag = tag
    }

    createTag() {
        const newTag = {
            name: this.formTag.title.value,
            color: this.formTag.color.value
        }

        this.tags.push(newTag)
        this.createTags()
        this.close(this.elementTag)
    }
}

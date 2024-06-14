import { calendar } from "./calendar.js"

export const modal = {
    element: document.querySelector(".mod-add-event"),
    form: document.querySelector("#modal-form"),
    btnSave: document.querySelector("#btn-save-modal"),
    btnEdit: document.querySelector("#btn-edit-modal"),
    btnRemove: document.querySelector("#btn-remove"),
    btnClose: document.querySelector("#btn-close-modal"),
    event: null,
    inputTag: null,
    optionSelect: document.createElement("p"),

    initialize() {
        modal.btnClose.addEventListener("click", () => modal.close())

        modal.btnSave.addEventListener("click", () => {
            calendar.addEvent()
        })

        modal.btnEdit.addEventListener("click", () => {
            calendar.updateEvent(modal.event)
            modal.close()
        })

        modal.btnRemove.addEventListener("click", () => {
            calendar.removeEvent(modal.event)
            modal.close()
        })

        modal.form.initialDate.addEventListener("input", () => {
            if (modal.form.finalDate.value == "" || modal.form.allDay.checked) {
                modal.form.finalDate.value = modal.form.initialDate.value
            }
        })

        modal.form.allDay.addEventListener("input", () => {
            if (modal.form.finalDate.disabled) {
                modal.form.finalDate.disabled = false
                modal.form.finalDate.value = modal.form.initialDate.value
                return
            }
            modal.form.finalDate.disabled = true
            modal.form.finalDate.value = modal.form.initialDate.value

        })

        modal.createTags()
        modalTag.initialize()
    },

    open() {
        modal.element.classList.remove("hide")
    },

    close() {
        modal.clean()
        modal.element.classList.add("hide")
    },

    clean() {
        modal.optionSelect.innerHTML = "Escolha uma Tag"
        modal.form.reset()
        modal.btnRemove.classList.add("hide")
        modal.btnEdit.classList.add("hide")
        modal.btnSave.classList.remove("hide")
        modal.event = null
    },

    updateDate(data) {
        if (data.mode == "onlyDay") {
            const date = calendar.formatDate(new Date(data.year, data.month, data.day))
            modal.form.initialDate.value = date
            modal.form.finalDate.value = date
            return
        }

        let dateInitial = calendar.formatDate(data.initial)
        let dateFinal = calendar.formatDate(data.final)

        if (data.mode == "day") {            
            dateInitial = calendar.formatDate(new Date(calendar.year, calendar.month, calendar.day).setHours(data.initial))
            dateFinal = calendar.formatDate(new Date(calendar.year, calendar.month, calendar.day).setHours(data.final))
        }

        if (data.mode == "gridWeek") {
            dateInitial = calendar.formatDate(data.initial)
            dateFinal = calendar.formatDate(data.final)
        }

        if (new Date(dateInitial) < new Date(dateFinal)) {
            modal.form.initialDate.value = dateInitial
            modal.form.finalDate.value = dateFinal
        } else {
            modal.form.initialDate.value = dateFinal
            modal.form.finalDate.value = dateInitial
        }
    },

    renderEvent(event) {
        modal.event = event
        modal.form.title.value = event.title
        modal.form.description.value = event.description
        modal.form.initialDate.value = event.initialDate
        modal.form.finalDate.value = event.finalDate
        if (event.allDay) modal.form.allDay.checked = true
        modal.changeOptionSelect(event.tag)
        modal.btnRemove.classList.remove("hide")
        modal.btnEdit.classList.remove("hide")
        modal.btnSave.classList.add("hide")
    },

    tags: [
        { name: "Urgente", color: "red", },
        { name: "Importante", color: "orange", },
        { name: "Normal", color: "blue", },
        { name: "Secretaria", color: "purple", },
        { name: "Financeiro", color: "gray", },
    ],

    createTags() {
        modal.element.addEventListener("click", (e) => {
            if (e.target.classList.contains("mod-option-select") || e.target.classList.contains("mod-container-tag")) return
            if (!e.target.classList.contains("mod-container-options")) containerOptions.classList.add("hide")
        })

        const containerTag = document.querySelector(".mod-container-tag")
        containerTag.addEventListener("click", () => containerOptions.classList.toggle("hide"))

        modal.optionSelect.classList.add("mod-option-select")
        modal.optionSelect.innerHTML = "Escolha uma Tag"

        const containerOptions = document.createElement("div")
        containerOptions.classList.add("mod-container-options", "hide")

        modal.tags.forEach(tag => {
            const option = document.createElement("p")
            option.classList.add("mod-option")

            const color = modal.createColor(tag)

            option.appendChild(color)
            option.innerHTML += tag.name

            option.addEventListener("click", () => modal.changeOptionSelect(tag))

            containerOptions.appendChild(option)
        })

        const newTag = document.createElement("p")
        newTag.classList.add("mod-option")
        newTag.innerHTML = "+ Nova Tag"
        newTag.addEventListener("click", () => modalTag.open())

        containerOptions.appendChild(newTag)

        containerTag.appendChild(modal.optionSelect)
        containerTag.appendChild(containerOptions)
    },

    createColor(tag) {
        const color = document.createElement("span")
        color.classList.add("mod-circle")
        color.style.backgroundColor = tag.color
        return color
    },

    changeOptionSelect(tag) {
        modal.optionSelect.innerHTML = ""
        modal.optionSelect.appendChild(modal.createColor(tag))
        modal.optionSelect.innerHTML += tag.name
        modal.inputTag = tag
    },
}

const modalTag = {
    form: document.querySelector("#form-modalTags"),
    element: document.querySelector(".mod-tags"),

    open() {
        modalTag.element.classList.remove("hide")
    },

    close() {
        modalTag.element.classList.add("hide")
    },

    clean() {
        modalTag.form.title.value = ""
        modalTag.form.color.value = ""
    },

    initialize() {
        document.querySelector("#btn-close-modal-tag").addEventListener("click", () => modalTag.close())
        document.querySelector("#btn-save-modal-tag").addEventListener("click", () => modalTag.createTag())
    },

    createTag() {
        const newTag = {
            name: modalTag.form.title.value,
            color: modalTag.form.color.value
        }

        modal.tags.push(newTag)
        modal.createTags()
        modalTag.close()
    },
}
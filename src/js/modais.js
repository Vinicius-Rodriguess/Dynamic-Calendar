import { calendar } from "./calendar.js"

export const modal = {
    element: document.querySelector(".background-modal"),
    form: document.querySelector("#modal-form"),
    btnSave: document.querySelector("#btn-save-modal"),
    btnEdit: document.querySelector("#btn-edit-modal"),
    btnRemove: document.querySelector("#btn-remove"),
    btnClose: document.querySelector("#btn-close-modal"),
    event: null,
    inputTag: null,
    optionSelect: document.createElement("p"),

    initialize() {
        modal.btnClose.addEventListener("click", () =>{
            modal.close()
        })
        modal.btnSave.addEventListener("click", () => {
            calendar.addEvent()
            modal.close()
        })
        modal.btnEdit.addEventListener("click", () => {
            calendar.updateEvent(modal.event)
            modal.close()
        })
        modal.btnRemove.addEventListener("click", () => {
            calendar.removeEvent(modal.event)
            modal.close()
        })
        modal.createTags()
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

    updateDate(day) {
        if (day) {
            const date = calendar.formatDate(new Date(calendar.year, calendar.month, day))
            this.form.initialDate.value = date
            this.form.finalDate.value = date
            return
        }

        const dateInitial = calendar.formatDate(new Date(calendar.year, calendar.month, calendar.diaInicial))
        const dateFinal = calendar.formatDate(new Date(calendar.year, calendar.month, calendar.diaFinal))

        if (+calendar.diaInicial < +calendar.diaFinal) {
            this.form.initialDate.value = dateInitial
            this.form.finalDate.value = dateFinal
        } else {
            this.form.initialDate.value = dateFinal
            this.form.finalDate.value = dateInitial
        }
    },

    renderEvent(event) {
        console.log(event)
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
        {name: "Urgente", color: "red",},
        {name: "Importante",color: "orange",},
        {name: "Normal",color: "blue",},
        {name: "Secretaria",color: "purple",},
        {name: "Financeiro",color: "gray",},
    ],

    createTags() {
        modal.element.addEventListener("click", (e) => {
            if (e.target.classList.contains("option-select") || e.target.classList.contains("container-tag")) return
            if (!e.target.classList.contains("container-options")) containerOptions.classList.add("hide")
        })

        const containerTag = document.querySelector(".container-tag")
        containerTag.addEventListener("click", () => containerOptions.classList.toggle("hide"))

        modal.optionSelect.classList.add("option-select")
        modal.optionSelect.innerHTML = "Escolha uma Tag"

        const containerOptions = document.createElement("div")
        containerOptions.classList.add("container-options", "hide")

        modal.tags.forEach(tag => {
            const option = document.createElement("p")
            option.classList.add("option")
        
            const color = modal.createColor(tag)

            option.appendChild(color)
            option.innerHTML += tag.name
            
            option.addEventListener("click", () => {
                modal.changeOptionSelect(tag)
            })

            containerOptions.appendChild(option)
        })

        const newTag = document.createElement("p")
        newTag.classList.add("option")
        newTag.innerHTML = "+ Nova Tag"
        newTag.addEventListener("click", () => {
            modalTag.open()
        })

        containerOptions.appendChild(newTag)

        containerTag.appendChild(modal.optionSelect)
        containerTag.appendChild(containerOptions)
    },

    createColor(tag) {
        const color = document.createElement("span")
        color.classList.add("circle")
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


export const modalTag = {
    form: document.querySelector("#form-modalTags"),
    element: document.querySelector(".background-modal-3"),

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

export const modalEvents = {
    element: document.querySelector(".background-modal-2"),
    btnClose: document.querySelector("#btn-close-modal2"),

    initialize() {
        modalEvents.btnClose.addEventListener("click", () => modalEvents.close())
    },

    open() {
        modalEvents.element.classList.remove("hide")
    },

    close() {
        modalEvents.element.classList.add("hide")
    },

    showEvent(hiddenChildren) {
        hiddenChildren.forEach(children => {
            children.classList.remove("hide")
            document.querySelector(".results").appendChild(children)
        })
    },
}



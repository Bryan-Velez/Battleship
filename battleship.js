const ships = document.querySelectorAll('.ship')
const playerGridCells = document.querySelectorAll('#plyrGrid .cell')

console.log(ships, playerGridCells)

let draggedShip = null

ships.forEach(ship => {
    ship.addEventListener('dragstart', handleDragStart)
})

playerGridCells.forEach(cell => {
    cell.addEventListener('dragover', handleDragOver)
    cell.addEventListener('drop', handleDrop)
})

function handleDragStart(event) {
    draggedShip = event.target
    event.dataTransfer.setData('text/plain', draggedShip.id)
}

function handleDragOver(event) {
    event.preventDefault()
    event.target.classList.add('drop-target')
}

function handleDrop(event) {
    event.preventDefault()
    const shipId = event.dataTransfer.getData('text/plain')
    const ship = document.getElementById(shipId)

    const shipSize = parseInt(ship.getAttribute('data-size'))
    const dropCellId = event.target.id

    const dropRowIndex = parseInt(dropCellId.charAt(0)) // Extract the row index from the cell ID
    const dropColIndex = dropCellId.slice(1) // Extract the column index from the cell ID

    const cellIds = Array.from({ length: shipSize }, (_, i) => {
        const rowIndex = dropRowIndex + i
        return `${rowIndex}${dropColIndex}`
    })

    const canFit = cellIds.every(id => {
        const cell = document.getElementById(id)
        return cell !== null && !cell.classList.contains('occupied')
    })

    if (canFit) {
        cellIds.forEach(id => {
            const cell = document.getElementById(id)
            cell.classList.add('occupied')
        })
    }
    event.target.classList.remove('drop-target')
}










// const ship1 = document.querySelecto("#ship1")
// const ship2 = document.querySelecto("#ship2")
// const ship3 = document.querySelecto("#ship3")
// const ship4 = document.querySelecto("#ship4")
// const playerGrid = document.getElementById("#plyrGrid")
// const playerCells = playerGrid.querySelectorAll(".cell")




// ship1.addEventListener("dragstart", dragStart)
// ship1.addEventListener("dragend", dragEnd)  

// ship2.addEventListener("dragstart", dragStart)
// ship2.addEventListener("dragend", dragEnd)  

// ship3.addEventListener("dragstart", dragStart)
// ship3.addEventListener("dragend", dragEnd)  

// ship4.addEventListener("dragstart", dragStart)
// ship4.addEventListener("dragend", dragEnd)  



// function dragStart() {
//     this.classname += ' hold'
//     setTimeout(() => this.className = ' invisible', 0)
// }

// function dragEnd() {
//     this.className = 'ship1', 'ship2', 'ship3', 'ship4'
// }
    









// playerGrid.addEventListener("dragover", dragOver)
// playerGrid.addEventListener("dragenter", dragEnter)
// playerGrid.addEventListener("dragleave", dragLeave)
// playerGrid.addEventListener("drop", drop)



// function dragStart(event) {
//     const shipId = event.target.id
//     event.dataTransfer.setData("text/plain", shipId)
// }

// function dragEnd(event) {
//     event.target.style.opacity = "1"
//     playerGrid.classList.remove("drop-target")
// }

// function dragOver(event) {
//     event.preventDefault()
// }

// function dragEnter(event) {
//     event.preventDefault()
//     playerGrid.classList.add("drop-target")
// }

// function dragLeave(event) {
//     playerGrid.classList.remove("drop-target")
// }

// function drop(event) {
//     event.preventDefault()
//     const shipId = event.dataTransfer.getData("text/plain")
//     const ship = document.getElementById(shipId)
//     playerGrid.appendChild(ship)
// }



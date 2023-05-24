const gridsContainer = document.querySelector('#grids-container')
const shipContainer = document.querySelector('.ship-container')
const rotateButton = document.querySelector('#rotate-button')

// rotate button
let angle = 0
function rotate () {
  const optionShips = (Array.from(shipContainer.children))
  angle = angle === 0 ? 90 : 0
  optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}

rotateButton.addEventListener('click', rotate)




// creating game board
const width = 10

function createGrid(color, user) {
    const gameGridContainer = document.createElement('div')
    gameGridContainer.classList.add('game-grid')
    gameGridContainer.style.backgroundColor = color
    gameGridContainer.id = user

    for (let i = 0; i < width * width; i++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')
      cell.id = i
      gameGridContainer.append(cell)
    }     
    gridsContainer.append(gameGridContainer)
}

createGrid('aliceblue', 'computer')
createGrid('#9ab9d5', 'player')


// Creating ships

class Ship {
  constructor(name, length) {
    this.name = name
    this.length = length 
  }
}

const ship1 = new Ship ('ship1', 2)
const ship2 = new Ship ('ship2', 3)
const ship3 = new Ship ('ship3', 4)
const ship4 = new Ship ('ship4', 5)

const ships = [ship1, ship2, ship3, ship4]


// add ships
function addShip(user, vessel, startId) {
  const computerGridCells = document.querySelectorAll('#computer div')
  let randomBoolean = Math.random() < 0.5
  let isHorizontal = randomBoolean
  let randomStartIndex = Math.floor(Math.random() * width * width)
  
  let reasonableStartPoint = isHorizontal ? randomStartIndex <= width * width -  vessel.length ? randomStartIndex : 
  width * width - vessel.length :
  randomStartIndex <= width * width - width * vessel.length ? randomStartIndex : randomStartIndex - vessel.length * width + width

let shipCells = []

  for (let i = 0; i < vessel.length; i++) {
    if (isHorizontal) {
        shipCells.push(computerGridCells[Number(reasonableStartPoint) + i])
    } else {  
      shipCells.push(computerGridCells[Number(reasonableStartPoint) + i * width]) 
    }
  }  
  let reasonable
  if (isHorizontal) {
    shipCells.every((_shipCell, index) =>
      reasonable = shipCells[0].id % width !== width - (shipCells.length - (index + 1)))
  } else {
    shipCells.every((_shipCell, index) =>
      reasonable = shipCells[0].id < 90 + (width * index + 1))
  }

  const notOccupied = shipCells.every(shipCell => !shipCell.classList.contains('Occupied'))
        
  if (reasonable && notOccupied) {
      shipCells.forEach(shipCell => {
      shipCell.classList.add(vessel.name)
      shipCell.classList.add('Occupied')
    })
  } else {
    addShip(vessel)
  }
  
}
 
ships.forEach(vessel => addShip('computer', vessel))



//drag and drop player ships
let draggedShip
const shipOptions = Array.from(shipContainer.children) 
shipOptions.forEach(shipOptions => shipOptions.addEventListener('dragstart', handleDragStart))

const playerGridCells = document.querySelectorAll('#player div')
playerGridCells.forEach(playerCell => {
  playerCell.addEventListener('dragover', handleDragOver)
  playerCell.addEventListener('drop', handleDrop)
})

function handleDragStart(event) {
  draggedShip = event.target
}
 
function handleDragOver(event) {
  event.preventDefault()
}

function handleDrop(event) {
  const startId = event.target.id
  const playerShip = ships[draggedShip.id]
  addShip('player', playerShip, startId)
}




// import interact from 'interactjs'


// const ship1 = document.querySelecto("#ship1")
// const ship2 = document.querySelecto("#ship2")
// const ship3 = document.querySelecto("#ship3")
// const ship4 = document.querySelecto("#ship4")
// const playerGrid = document.getElementById("#plyrGrid")
// const playerCells = playerGrid.querySelectorAll(".cell")


// function init () {
//   plyrGrid = [
//     [0,0,0,0,0,0,0,0,0,0] //column 1
//     [0,0,0,0,0,0,0,0,0,0] //column 2
//     [0,0,0,0,0,0,0,0,0,0] //column 3
//     [0,0,0,0,0,0,0,0,0,0] //column 4
//     [0,0,0,0,0,0,0,0,0,0] //column 5
//     [0,0,0,0,0,0,0,0,0,0] //column 6
//     [0,0,0,0,0,0,0,0,0,0] //column 7
//     [0,0,0,0,0,0,0,0,0,0] //column 8
//     [0,0,0,0,0,0,0,0,0,0] //column 9
//     [0,0,0,0,0,0,0,0,0,0] //column 10
//   ]
//   turn = 1
//   winner = null
//   render()
// }

// function randomizeShips() {
//   const ships = document.querySelectorAll('.ship');
//   const gridCells = document.querySelectorAll('#plyrGrid .cell');
//   const gridSize = gridCells.length;
//   const shipPositions = new Array(gridSize).fill(0);

//   ships.forEach(ship => {
//       const shipSize = parseInt(ship.dataset.size);
//       let validPosition = false;

//       while (!validPosition) {
//           const randomCellIndex = Math.floor(Math.random() * gridSize);
//           const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

//           if (isValidPlacement(randomCellIndex, shipSize, orientation, shipPositions, gridSize)) {
//               placeShip(ship, randomCellIndex, shipSize, orientation, shipPositions);
//               validPosition = true;
//           }
//       }
//   });
// }

// function isValidPlacement(startIndex, shipSize, orientation, shipPositions, gridSize) {
//   const lastIndex = orientation === 'horizontal' ? startIndex + shipSize - 1 : startIndex + gridSize * (shipSize - 1);

//   if (lastIndex >= gridSize) {
//       return false;
//   }

//   for (let i = startIndex; i <= lastIndex; i++) {
//       if (shipPositions[i] === 1) {
//           return false;
//       }
//   }

//   return true;
// }

// function placeShip(ship, startIndex, shipSize, orientation, shipPositions) {
//   const increment = orientation === 'horizontal' ? 1 : 10;

//   for (let i = 0; i < shipSize; i++) {
//       shipPositions[startIndex + i * increment] = 1;
//   }

//   ship.style.gridArea = `${startIndex % 10 + 1} / ${Math.floor(startIndex / 10) + 1} / span 1 / span 1`;
// }

// randomizeShips(); // Initial random placementfs









// // ship1.addEventListener("dragstart", dragStart)
// // ship1.addEventListener("dragend", dragEnd)  

// // ship2.addEventListener("dragstart", dragStart)
// // ship2.addEventListener("dragend", dragEnd)  

// // ship3.addEventListener("dragstart", dragStart)
// // ship3.addEventListener("dragend", dragEnd)  

// // ship4.addEventListener("dragstart", dragStart)
// // ship4.addEventListener("dragend", dragEnd)  



// // function dragStart() {
// //     this.classname += ' hold'
// //     setTimeout(() => this.className = ' invisible', 0)
// // }

// // function dragEnd() {
// //     this.className = 'ship1', 'ship2', 'ship3', 'ship4'
// // }
    









// // playerGrid.addEventListener("dragover", dragOver)
// // playerGrid.addEventListener("dragenter", dragEnter)
// // playerGrid.addEventListener("dragleave", dragLeave)
// // playerGrid.addEventListener("drop", drop)



// // function dragStart(event) {
// //     const shipId = event.target.id
// //     event.dataTransfer.setData("text/plain", shipId)
// // }

// // function dragEnd(event) {
// //     event.target.style.opacity = "1"
// //     playerGrid.classList.remove("drop-target")
// // }

// // function dragOver(event) {
// //     event.preventDefault()
// // }

// // function dragEnter(event) {
// //     event.preventDefault()
// //     playerGrid.classList.add("drop-target")
// // }

// // function dragLeave(event) {
// //     playerGrid.classList.remove("drop-target")
// // }

// // function drop(event) {
// //     event.preventDefault()
// //     const shipId = event.dataTransfer.getData("text/plain")
// //     const ship = document.getElementById(shipId)
// //     playerGrid.appendChild(ship)
// // }



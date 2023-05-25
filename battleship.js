const gamesBoardContainer = document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const rotateButton = document.querySelector('#rotate-button')
const startButton = document.querySelector('#start-button')
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')

//rotate 
let angle = 0
function rotate () {
    const optionShips = Array.from(optionContainer.children)
    angle = angle === 0 ? 90 : 0
    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
} 

rotateButton.addEventListener('click', rotate)




//creating the game grids
const width = 10

function createBoard (color, user) {
   const gameBoardContainer = document.createElement('div')  
   gameBoardContainer.classList.add('game-board')
   gameBoardContainer.style.backgroundColor = color
   gameBoardContainer.id = user

   for (let i = 0; i < width * width; i++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.id = i
    gameBoardContainer.append(cell)
   }

   gamesBoardContainer.append(gameBoardContainer)
}

createBoard ('aliceblue', 'computer')  
createBoard ('#9ab9d5', 'player')





//Creating Ships
class Ship {
    constructor(name,length) {
        this.name = name
        this.length = length 
    }
}

const destroyer = new Ship('destroyer', 2)
const cruiser = new Ship('cruiser', 3)
const submarine = new Ship('submarine', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, cruiser, submarine, carrier]
let notDropped




function getValidity(allBoardCells, isHorizontal, startIndex, ship) {
    //check horizontal
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex :
    width * width - ship.length :
    //check vertical
    startIndex <= width * width - width * ship.length ? startIndex :
    startIndex - ship.length * width + width

     let shipCells = []
 
    for (let i = 0; i < ship.length ; i++) {
        if (isHorizontal) {
            shipCells.push(allBoardCells[Number(validStart) + i])
        } else {
            shipCells.push(allBoardCells[Number(validStart) + i * width])
        }
    }
        //handle horizontal
    let valid    
    if (isHorizontal) {
        shipCells.every((_shipCell, index) =>
            valid = shipCells[0].id % width !== width - (shipCells.length - (index + 1)))
    } else { //handle vertical
        shipCells.every((_shipCell, index) =>
            valid = shipCells[0].id < 90 + (width * index + 1))
    }

    const vacant = shipCells.every(shipCell => !shipCell.classList.contains('occupied'))

    return { shipCells, valid, vacant }
}




//Adding ships and randomizing computer board
function addShip(user, ship, startId) {
    const allBoardCells = document.querySelectorAll(`#${user} div`)
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean

    let randomStartIndex = Math.floor(Math.random() * width * width)
    let startIndex = startId ? startId : randomStartIndex

    const { shipCells, valid, vacant } = getValidity(allBoardCells, isHorizontal, startIndex, ship)

    if (valid && vacant) {
        shipCells.forEach(shipCell => {
            shipCell.classList.add(ship.name)
            shipCell.classList.add('occupied')
        })
    } else {
        if (user === 'computer') addShip(user, ship, startId)
        if (user === 'player') notDropped = true
    }
}

ships.forEach(ship => addShip('computer', ship))




//drag player ships
let draggedShip
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerCells = document.querySelectorAll('#player div')
allPlayerCells.forEach(playerCell => {
    playerCell.addEventListener('dragover', dragOver)
    playerCell.addEventListener('drop', dropShip)
})

function dragStart(event) {
    notDropped = false
    draggedShip = event.target
}
function dragOver(event) {
    event.preventDefault()
    const ship = ships[draggedShip.id]
    highLightArea(event.target.id, ship)
}
function dropShip(event) {
    const startId = event.target.id
    const ship = ships[draggedShip.id]
    addShip('player', ship, startId)
    if (!notDropped) {
        draggedShip.remove()
    }
}



//add highlight
function highLightArea( startIndex, ship) {
    const allBoardCells = document.querySelectorAll('#player div')
    let isHorizontal = angle === 0

    const { shipCells, valid, vacant } = getValidity(allBoardCells, isHorizontal, startIndex, ship)

    if (valid && vacant) {
        shipCells.forEach(shipCell => {
            shipCell.classList.add('hover')
            setTimeout(() => shipCell.classList.remove('hover'), 500)
        })
    }
}

let gameOver = false
let playerTurn 

//Start Game
function startGame () {
    if (playerTurn === undefined) {
        if (optionContainer.children.length != 0) {
        infoDisplay.textContent = 'Place your ships on the board to begin.'
        } else {
            const allBoardCells = document.querySelectorAll('#computer div')
            allBoardCells.forEach(cell => cell.addEventListener('click', handleClick))
            playerTurn = true
            turnDisplay.textContent = 'Your Turn!'
            infoDisplay.textContent = 'The enemy is here, prepare for battle!'
        }
    }
}

startButton.addEventListener('click', startGame)

//clicking cells
let playerHits =  []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []


function handleClick (event) {
    if (!gameOver) {
        if(event.target.classList.contains('occupied')) {
            event.target.classList.add('hit')
            infoDisplay.textContent = "Direct Hit!"
            let classes = Array.from(event.target.classList)
            classes = classes.filter(className => className !== 'cell')
            classes = classes.filter(className => className !== 'hit')
            classes = classes.filter(className => className !== 'occupied')
            playerHits.push(...classes)
            checkScore('player', playerHits, playerSunkShips )
        }
        if (!event.target.classList.contains('occupied')) {
            infoDisplay.textContent = "You missed."
            event.target.classList.add('empty')
        }
        playerTurn = false
        const allBoardCells =  document.querySelectorAll('#computer div')
        allBoardCells.forEach(cell => cell.replaceWith(cell.cloneNode(true)))
        setTimeout(computerTurn, 2000)
    }
}


//Define Computers turn
function computerTurn () {
    if (!gameOver) {
        turnDisplay.textContent = `It's the Computer's turn.`
        infoDisplay.textContent = 'The computer is deciding.'

        setTimeout(() => {
            let randomChoice = Math.floor(Math.random() * width * width)
            const allBoardCells = document.querySelectorAll('#player div')
             
            if (allBoardCells[randomChoice].classList.contains('occupied') &&
                allBoardCells[randomChoice].classList.contains('hit')
                ) {
                    computerTurn()
                    return
                } else if (  
                    allBoardCells[randomChoice].classList.contains('occupied') &&
                    !allBoardCells[randomChoice].classList.contains('hit')
                ) {
                    allBoardCells[randomChoice].classList.add('hit')
                    infoDisplay.textContent = 'Your Ship was attacked!'   
                    let classes = Array.from(allBoardCells[randomChoice].classList)
                    classes = classes.filter(className => className !== 'cell')
                    classes = classes.filter(className => className !== 'hit')
                    classes = classes.filter(className => className !== 'occupied')
                    computerHits.push(...classes)
                    checkScore('computer', computerHits, computerSunkShips)
                } else {
                    infoDisplay.textContent = 'Your ships are safe this turn'
                    allBoardCells[randomChoice].classList.add('empty')
                }  
        }, 2000)
//players turn
        setTimeout(() => {
            playerTurn = true
            turnDisplay.textContent = 'Your turn!'
            infoDisplay.textContent = 'Fire at will!'
            const allBoardCells = document.querySelectorAll('#computer div')
            allBoardCells.forEach(cell => cell.addEventListener('click', handleClick))
        }, 4000)
    }
}

function checkScore (user, userHits, userSunkShips) {
    
    function checkShip(shipName, shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            if (user === 'player') {
                infoDisplay.textContent = `The computer's ${shipName} was sunk!` 
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if (user === 'computer') {
                infoDisplay.textContent = `Your ${shipName} was sunk!` 
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
        }
    }

    checkShip('destroyer', 2)
    checkShip('cruiser', 3)
    checkShip('submarine', 4)
    checkShip('carrier', 5)

    console.log('playerHits', playerHits)
    console.log('playerSunkShips', playerSunkShips)

    if (playerSunkShips === 4) {
        infoDisplay.textContent('You sunk all enemy ships. YOU WON!')
        gameOver = true
    }
    if (computerSunkShips === 4) {
        infoDisplay.textContent('All your ships were sunk. You loose...')
        gameOver = true
    }  
}

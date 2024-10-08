const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const barRangeControls = document.getElementById("bar-range-controls")
const speedRangeControls = document.getElementById("speed-range-controls")
const barRange = document.getElementById("bar-range")
const speedRange = document.getElementById("speed-range")
const chartContainer = document.getElementById("chart-container")
const startButton = document.getElementById("start-button")
const buttonText = document.getElementById("start-button-text")
const restartButton = document.getElementById("restart-button")
const radioInputDiv = document.getElementById("radio-input")
const iterationCounteText = document.getElementById("iteration-count-text")
const iterationcount = document.getElementById("iteration-count")
const iterate = async () => {
    ++iterationcount.innerHTML
    await delay(speedRange.value)
}
const miracleSortText = document.getElementById("miracle-sort-text")
const shufflingText = document.getElementById("shuffling-text")

function isSorted(bars) {
    for (let i = 0; i < bars.length-1; ++i)
        if (bars[i].style.height > bars[i+1].style.height)
            return false
    return true
}

function createBars(numBars) {
    let arr = new Array()
    for (let i = 1; i <= numBars; ++i)
        arr.push(100/numBars*i)
    // shuffle(arr)
    chartContainer.innerHTML = ""
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.style.height = `${arr[i]}%`
        chartContainer.appendChild(bar)
    }
}

createBars(barRange.value)

let isSorting = false, isShuffling = false

async function shuffleBars() {
    isShuffling = true;

    const arr = Array.from(chartContainer.childNodes)
    let currentIndex = arr.length

    while (currentIndex != 0) {
        if (!isShuffling)
            return

        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        arr[currentIndex].style.backgroundColor = "green"
        arr[randomIndex].style.backgroundColor = "green"

        await delay(speedRange.value)

        let temp = arr[currentIndex].style.height
        arr[currentIndex].style.height = arr[randomIndex].style.height
        arr[randomIndex].style.height = temp
        
        arr[currentIndex].style.backgroundColor = ""
        arr[randomIndex].style.backgroundColor = ""
    }
}

barRange.addEventListener("input", function() {
    document.getElementById("bar-range-value").innerHTML = barRange.value
    createBars(barRange.value)
})

speedRange.addEventListener("input", function() {
    document.getElementById("speed-range-value").innerHTML = speedRange.value
})

async function bubbleSort() {
    const arr = Array.from(chartContainer.childNodes)

    for (let i = 0; i < arr.length; ++i) {
        for (let j = 0; j < arr.length - i - 1; ++j) {
            if (!isSorting)
                return

            let height1 = parseFloat(arr[j].style.height)
            let height2 = parseFloat(arr[j+1].style.height)

            arr[j].style.backgroundColor = "orange"
            
            await iterate()

            if (height1 > height2) {
                let temp = arr[j].style.height
                arr[j].style.height = arr[j+1].style.height
                arr[j+1].style.height = temp

            }

            arr[j].style.backgroundColor = ""
        }
    }
}

async function insertionSort() {
    const arr = Array.from(chartContainer.childNodes)

    for (let i = 1; i < arr.length; ++i) {
        if (!isSorting)
            return

        let currentHeight = parseFloat(arr[i].style.height)
        let j = i - 1

        while (j >= 0 && parseFloat(arr[j].style.height) > currentHeight) {
            arr[j].style.backgroundColor = "orange"
            arr[j + 1].style.height = arr[j].style.height
            arr[j + 1].style.backgroundColor = ""
            await iterate()
            --j
        }

        arr[j + 1].style.height = currentHeight + "%"
        arr[j + 1].style.backgroundColor = ""
    }
}

async function selectionSort() {
    const arr = Array.from(chartContainer.childNodes)

    for (let i = 0; i < arr.length - 1; ++i) {
        if (!isSorting)
            return

        let minIndex = i
        arr[minIndex].style.backgroundColor = "green"
        if (minIndex > 0)
            arr[minIndex-1].style.backgroundColor = ""

        for (let j = i + 1; j < arr.length; ++j) {
            if (!isSorting)
                return

            arr[j].style.backgroundColor = "orange"

            await iterate()

            let heightMin = parseFloat(arr[minIndex].style.height)
            let heightCurrent = parseFloat(arr[j].style.height)

            if (heightCurrent < heightMin) {
                minIndex = j
            }

            arr[j].style.backgroundColor = ""
        }

        if (minIndex !== i) {
            let temp = arr[i].style.height
            arr[i].style.height = arr[minIndex].style.height
            arr[minIndex].style.height = temp

            arr[minIndex].style.backgroundColor = ""
        }
    }

    for (let bar of arr)
        bar.style.backgroundColor = ""
}

async function cocktailSort() {
    const arr = Array.from(chartContainer.childNodes)
    let start = 0
    let end = arr.length - 1
    let sorted = false

    while (!sorted) {
        sorted = true

        // Forward pass
        for (let i = start; i < end; ++i) {
            if (!isSorting) return

            let height1 = parseFloat(arr[i].style.height)
            let height2 = parseFloat(arr[i + 1].style.height)

            arr[i].style.backgroundColor = "orange"

            await iterate()

            if (height1 > height2) {
                let temp = arr[i].style.height
                arr[i].style.height = arr[i + 1].style.height
                arr[i + 1].style.height = temp

                sorted = false
            }

            arr[i].style.backgroundColor = ""
        }

        if (sorted) break

        sorted = true
        end--

        // Backward pass
        for (let i = end; i > start; --i) {
            if (!isSorting) return

            let height1 = parseFloat(arr[i].style.height)
            let height2 = parseFloat(arr[i - 1].style.height)

            arr[i].style.backgroundColor = "orange"

            await iterate()

            if (height1 < height2) {
                let temp = arr[i].style.height
                arr[i].style.height = arr[i - 1].style.height
                arr[i - 1].style.height = temp

                sorted = false
            }

            arr[i].style.backgroundColor = ""
        }

        start++
    }
}

async function bogoSort() {
    let arr = Array.from(chartContainer.childNodes)
    while (!isSorted(arr)) {
        if (!isSorting)
            return
        await shuffleBars()
        await iterate()
    }
}

let timer1, timer2, timer3, timer4

startButton.addEventListener("click", async function() {
    if (buttonText.innerHTML == "Start") {
        iterationcount.innerHTML = "0"
        iterationCounteText.style.display = "block"
        radioInputDiv.style.display = "none"
        startButton.style.display = "none"
        isSorting = true
        if (document.getElementById("bubble").checked) {
            bubbleSort()
        } else if (document.getElementById("insertion").checked) {
            insertionSort()
        } else if (document.getElementById("selection").checked) {
            selectionSort()
        } else if (document.getElementById("cocktail").checked) {
            cocktailSort()
        } else if (document.getElementById("bogo").checked) {
            bogoSort()
        } else if (document.getElementById("miracle").checked) {
            miracleSortText.style.display = "block"
            miracleSortText.innerHTML = "Wait for a while..."
            timer1 = setTimeout(() => {
                miracleSortText.innerHTML = "Wait for a little bit more..."
            }, 5000)
            timer2 = setTimeout(() => {
                miracleSortText.innerHTML = "Pray for it to work..."
            }, 15000)
            timer3 = setTimeout(() => {
                miracleSortText.innerHTML = "It's almost sorted..."
            }, 30000)
            timer4 = setTimeout(() => {
                miracleSortText.innerHTML = "Still waiting?"
            }, 60000)
        }
    } else if (buttonText.innerHTML == "Shuffle") {
        barRangeControls.style.display = "none"
        startButton.style.display = "none"
        shufflingText.style.display = "block"
        restartButton.style.display = "block"
        await shuffleBars()
        if (isShuffling) {
            radioInputDiv.style.display = "flex"
            buttonText.innerHTML = "Start"
            startButton.style.display = ""
            shufflingText.style.display = "none"
            isShuffling = false
        }
    }
})

restartButton.addEventListener("click", function() {
    isSorting = false
    isShuffling = false
    createBars(barRange.value)
    iterationCounteText.style.display = "none"
    barRangeControls.style.display = "flex"
    radioInputDiv.style.display = "none"
    buttonText.innerHTML = "Shuffle"
    shufflingText.style.display = "none"
    startButton.style.display = ""
    restartButton.style.display = "none"

    for (const timer of [timer1, timer2, timer3, timer4])
        clearTimeout(timer)
    miracleSortText.style.display = "none"
})
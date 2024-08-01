const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function shuffle(array) {
    let currentIndex = array.length
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

const barRangeControls = document.getElementById("bar-range-controls")
const speedRangeControls = document.getElementById("speed-range-controls")
const barRange = document.getElementById("bar-range")
const speedRange = document.getElementById("speed-range")
const chartContainer = document.getElementById("chart-container")
const startButton = document.getElementById("start-button")
const radioInputDiv = document.getElementById("radio-input")
const iterationCounteText = document.getElementById("iteration-count-text")
const iterationcount = document.getElementById("iteration-count")
const iterate = async () => {
    ++iterationcount.innerHTML
    await delay(speedRange.value)
}
const miracleSortText = document.getElementById("miracle-sort-text")

function isSorted(bars) {
    for (let i = 0; i < bars.length-1; ++i)
        if (bars[i].style.height > bars[i+1].style.height)
            return false
    return true
}

function createBars(numBars) {
    arr = new Array()
    for (let i = 1; i <= numBars; ++i)
        arr.push(100/numBars*i)
    shuffle(arr)
    chartContainer.innerHTML = ""
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.style.height = `${arr[i]}%`
        chartContainer.appendChild(bar)
    }
}

createBars(barRange.value)

barRange.addEventListener("input", function() {
    document.getElementById("bar-range-value").innerHTML = barRange.value
    createBars(barRange.value)
})

speedRange.addEventListener("input", function() {
    document.getElementById("speed-range-value").innerHTML = speedRange.value
})

let isSorting = false;

async function bubbleSort() {
    const arr = Array.from(chartContainer.childNodes)

    for (let i = 0; i < arr.length; ++i) {
        for (let j = 0; j < (arr.length - i - 1); ++j) {
            if (!isSorting)
                return

            let height1 = parseFloat(arr[j].style.height)
            let height2 = parseFloat(arr[j+1].style.height)

            if (height1 > height2) {
                arr[j].style.backgroundColor = "green"
                arr[j+1].style.backgroundColor = "green"

                await iterate()

                let temp = arr[j].style.height
                arr[j].style.height = arr[j+1].style.height
                arr[j+1].style.height = temp

                arr[j].style.backgroundColor = ""
                arr[j+1].style.backgroundColor = ""
            }
        }
    }
}

async function insertionSort() {
    const arr = Array.from(chartContainer.childNodes);

    for (let i = 1; i < arr.length; ++i) {
        if (!isSorting)
            return

        let currentHeight = parseFloat(arr[i].style.height)
        let j = i - 1

        while (j >= 0 && parseFloat(arr[j].style.height) > currentHeight) {
            arr[j].style.backgroundColor = "green"
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
        if (!isSorting) {
            return
        }

        let minIndex = i
        arr[minIndex].style.backgroundColor = "orange"
        if (minIndex > 0)
            arr[minIndex-1].style.backgroundColor = ""

        for (let j = i + 1; j < arr.length; ++j) {
            if (!isSorting)
                return;

            arr[j].style.backgroundColor = "green"

            await iterate()

            let heightMin = parseFloat(arr[minIndex].style.height)
            let heightCurrent = parseFloat(arr[j].style.height)

            if (heightCurrent < heightMin) {
                minIndex = j;
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

async function bogoSort() {
    let arr = Array.from(chartContainer.childNodes)
    while (!isSorted(arr)) {
        if (!isSorting)
            return;
        shuffle(arr)
        chartContainer.innerHTML = "";
        arr.forEach(bar => chartContainer.appendChild(bar));
        await iterate()
    }
}

let timer1, timer2

startButton.addEventListener("click", function() {
    const buttonText = document.getElementById("start-button-text")
    if (buttonText.innerHTML == "Start") {
        iterationcount.innerHTML = "0"
        iterationCounteText.style.display = "block"
        barRange.disabled = true
        radioInputDiv.style.display = "none"
        buttonText.innerHTML = "Restart"
        isSorting = true
        if (document.getElementById("value-1").checked) {
            bubbleSort()
        } else if (document.getElementById("value-2").checked) {
            insertionSort()
        } else if (document.getElementById("value-3").checked) {
            selectionSort()
        } else if (document.getElementById("value-4").checked) {
            bogoSort()
        } else if (document.getElementById("value-5").checked) {
            miracleSortText.style.display = "block"
            miracleSortText.innerHTML = "Wait for a while..."
            timer1 = setTimeout(() => {
                miracleSortText.innerHTML = "Wait for a little bit more..."
            }, 5000)
            timer2 = setTimeout(() => {
                miracleSortText.innerHTML = "Pray for it to work..."
            }, 10000)
        }
    } else if (buttonText.innerHTML == "Restart") {
        miracleSortText.style.display = "none"
        clearTimeout(timer1)
        clearTimeout(timer2)
        iterationCounteText.style.display = "none"
        barRange.disabled = false
        radioInputDiv.style.display = "flex"
        buttonText.innerHTML = "Start"
        isSorting = false
        createBars(barRange.value)
    }
});
    // ==UserScript==
// @name         Thunder hacks (made by: @p.ibarreta on IG)
// @version      1.0
// @description  The best Kahoot hack
// @author       @p.ibarreta - https://www.instagram.com/p.ibarreta/
// @match        https://kahoot.it/*
// @icon         https://em-content.zobj.net/source/apple/325/high-voltage_26a1.png
// @grant        none
// ==/UserScript==
var Version = "1.0.25"

// Add Google Fonts Inter
const fontLink = document.createElement("link")
fontLink.rel = "stylesheet"
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
document.head.appendChild(fontLink)

var questions = []
var info = {
  numQuestions: 0,
  questionNum: -1,
  lastAnsweredQuestion: -1,
  defaultIL: true,
  ILSetQuestion: -1,
}
var PPT = 1000
var Answered_PPT = 1000
var autoAnswer = false
var showAnswers = false
var inputLag = 100

function FindByAttributeValue(attribute, value, element_type) {
  element_type = element_type || "*"
  var All = document.getElementsByTagName(element_type)
  for (var i = 0; i < All.length; i++) {
    if (All[i].getAttribute(attribute) == value) {
      return All[i]
    }
  }
}

// Add custom checkbox styles
const customCheckboxStyles = document.createElement("style")
customCheckboxStyles.textContent = `
  .custom-checkbox {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    padding-left: 28px;
    margin-bottom: 12px;
  }

  .custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #333;
    border-radius: 3px;
    transition: all 0.2s ease;
  }

  .custom-checkbox:hover input ~ .checkmark {
    background-color: #444;
  }

  .custom-checkbox input:checked ~ .checkmark {
    background-color: #4CAF50;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .custom-checkbox input:checked ~ .checkmark:after {
    display: block;
  }

  .custom-checkbox .checkmark:after {
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`
document.head.appendChild(customCheckboxStyles)

const uiElement = document.createElement("div")
uiElement.className = "floating-ui"
uiElement.style.position = "absolute"
uiElement.style.top = "5%"
uiElement.style.right = "5%"
uiElement.style.width = "330px"
uiElement.style.height = "auto"
uiElement.style.backgroundColor = "#1a1a1a"
uiElement.style.borderRadius = "5px"
uiElement.style.boxShadow = "0px 0px 10px 0px rgba(0, 0, 0, 0.5)"
uiElement.style.zIndex = "9999"
uiElement.style.color = "white"
uiElement.style.fontFamily = "'Inter', sans-serif"
uiElement.style.fontSize = "14px"
uiElement.style.padding = "0"
uiElement.style.border = "none"
uiElement.style.overflow = "hidden"
uiElement.style.webkitTapHighlightColor = "transparent"
uiElement.style.outline = "none"

const handle = document.createElement("div")
handle.className = "handle"
handle.style.fontFamily = "'Inter', sans-serif"
handle.style.fontSize = "12px"
handle.style.fontWeight = "500"
handle.textContent = "⚡ Thunder hacks v1.0 (made by: @p.ibarreta on IG)"
handle.style.color = "white"
handle.style.width = "100%"
handle.style.height = "30px"
handle.style.backgroundColor = "#000"
handle.style.borderRadius = "4px 4px 0 0"
handle.style.cursor = "grab"
handle.style.textAlign = "center"
handle.style.lineHeight = "30px"
handle.style.position = "relative"
handle.style.display = "block"
handle.style.webkitTapHighlightColor = "transparent"
handle.style.outline = "none"
handle.style.userSelect = "none"
handle.style.webkitUserSelect = "none"
handle.style.mozUserSelect = "none"
handle.style.msUserSelect = "none"
uiElement.appendChild(handle)

const contentContainer = document.createElement("div")
contentContainer.style.padding = "15px"
contentContainer.style.marginTop = "0"
uiElement.appendChild(contentContainer)

const linkIdLabel = document.createElement("div")
linkIdLabel.textContent = "QUIZ ID"
linkIdLabel.style.marginBottom = "5px"
linkIdLabel.style.fontWeight = "600"
linkIdLabel.style.fontFamily = "'Inter', sans-serif"
contentContainer.appendChild(linkIdLabel)

const inputBox = document.createElement("input")
inputBox.type = "text"
inputBox.style.width = "100%"
inputBox.style.padding = "8px"
inputBox.style.marginBottom = "20px"
inputBox.style.backgroundColor = "#333"
inputBox.style.border = "none"
inputBox.style.borderRadius = "3px"
inputBox.style.color = "white"
inputBox.style.boxSizing = "border-box"
inputBox.style.fontFamily = "'Inter', sans-serif"
inputBox.style.fontSize = "12px"
inputBox.style.webkitTapHighlightColor = "transparent"
inputBox.style.outline = "none"
contentContainer.appendChild(inputBox)

// Create custom Auto Answer checkbox
const autoAnswerContainer = document.createElement("label")
autoAnswerContainer.className = "custom-checkbox"
autoAnswerContainer.style.fontFamily = "'Inter', sans-serif"
autoAnswerContainer.style.marginBottom = "15px"
autoAnswerContainer.textContent = "Auto Answer"
contentContainer.appendChild(autoAnswerContainer)

const autoAnswerCheckbox = document.createElement("input")
autoAnswerCheckbox.type = "checkbox"
autoAnswerCheckbox.addEventListener("change", function () {
  autoAnswer = this.checked
  info.ILSetQuestion = info.questionNum
})
autoAnswerContainer.prepend(autoAnswerCheckbox)

const autoAnswerCheckmark = document.createElement("span")
autoAnswerCheckmark.className = "checkmark"
autoAnswerContainer.appendChild(autoAnswerCheckmark)

// Create custom Show Answers checkbox
const showAnswersContainer = document.createElement("label")
showAnswersContainer.className = "custom-checkbox"
showAnswersContainer.style.fontFamily = "'Inter', sans-serif"
showAnswersContainer.style.marginBottom = "20px"
showAnswersContainer.textContent = "Show Answers"
contentContainer.appendChild(showAnswersContainer)

const showAnswersCheckbox = document.createElement("input")
showAnswersCheckbox.type = "checkbox"
showAnswersCheckbox.addEventListener("change", function () {
  showAnswers = this.checked
})
showAnswersContainer.prepend(showAnswersCheckbox)

const showAnswersCheckmark = document.createElement("span")
showAnswersCheckmark.className = "checkmark"
showAnswersContainer.appendChild(showAnswersCheckmark)

const statusContainer = document.createElement("div")
statusContainer.style.marginTop = "10px"
contentContainer.appendChild(statusContainer)

const statusLabel = document.createElement("span")
statusLabel.textContent = "Status: Ready"
statusLabel.style.color = "#aaa"
statusLabel.style.fontFamily = "'Inter', sans-serif"
statusContainer.appendChild(statusLabel)

// Hidden elements that maintain functionality but aren't visible in the UI
const pointsSlider = document.createElement("input")
pointsSlider.type = "range"
pointsSlider.min = "500"
pointsSlider.max = "1000"
pointsSlider.value = "1000"
pointsSlider.style.display = "none"
uiElement.appendChild(pointsSlider)

pointsSlider.addEventListener("input", () => {
  const points = +pointsSlider.value
  PPT = points
})

const style = document.createElement("style")
style.textContent = `
.custom-slider {
    background: white
    border: none;
    outline: none;
    cursor: ew-resize;
    appearance: none;
    height: 0;
    -webkit-tap-highlight-color: transparent;
}

.custom-slider::-webkit-slider-thumb {
    appearance: none;
    width: 1.75vw;
    height: 1.75vw;
    background-color: rgb(47, 47, 47);
    border-radius: 50%;
    cursor: ew-resize;
    margin-top: -0.5vw;
    -webkit-tap-highlight-color: transparent;
    outline: none;
}

.custom-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.75vw;
    background-color: white;
    cursor: ew-resize;
    border-radius: 1vw;
    background: linear-gradient(to right, red, yellow, limegreen);
    -webkit-tap-highlight-color: transparent;
    outline: none;
}
`
document.head.appendChild(style)

function parseQuestions(questionsJson) {
  const questions = []
  questionsJson.forEach((question) => {
    const q = { type: question.type, time: question.time }
    if (["quiz", "multiple_select_quiz"].includes(question.type)) {
      var i = 0
      q.answers = []
      q.incorrectAnswers = []
      question.choices.forEach((choise) => {
        if (choise.correct) {
          q.answers.push(i)
        } else {
          q.incorrectAnswers.push(i)
        }
        i++
      })
    }
    if (question.type == "open_ended") {
      q.answers = []
      question.choices.forEach((choise) => {
        q.answers.push(choise.answer)
      })
    }
    questions.push(q)
  })
  return questions
}

function handleInputChange() {
  const quizID = inputBox.value
  const url = "https://kahoot.it/rest/kahoots/" + quizID

  if (quizID != "") {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("")
        }
        return response.json()
      })
      .then((data) => {
        inputBox.style.backgroundColor = "#444"
        statusLabel.textContent = "Status: Hacks Ready"
        statusLabel.style.color = "#4CAF50"

        questions = parseQuestions(data.questions)
        info.numQuestions = questions.length
      })
      .catch((error) => {
        inputBox.style.backgroundColor = "#553333"
        statusLabel.textContent = "Status: Invalid ID"
        statusLabel.style.color = "#F44336"

        info.numQuestions = 0
      })
  } else {
    inputBox.style.backgroundColor = "#333"
    statusLabel.textContent = "Status: Ready"
    statusLabel.style.color = "#aaa"
    info.numQuestions = 0
  }
}

inputBox.addEventListener("input", handleInputChange)

document.body.appendChild(uiElement)

let isDragging = false
let offsetX, offsetY

handle.addEventListener("mousedown", (e) => {
  isDragging = true
  offsetX = e.clientX - uiElement.getBoundingClientRect().left
  offsetY = e.clientY - uiElement.getBoundingClientRect().top
})

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const x = e.clientX - offsetX
    const y = e.clientY - offsetY

    uiElement.style.left = x + "px"
    uiElement.style.top = y + "px"
  }
})

document.addEventListener("mouseup", () => {
  isDragging = false
})

function onQuestionStart() {
  console.log(inputLag)
  var question = questions[info.questionNum]
  if (showAnswers) {
    highlightAnswers(question)
  }
  if (autoAnswer) {
    // Respond almost immediately with minimal delay (50ms)
    answer(question, 50)
  }
}

function highlightAnswers(question) {
  question.answers.forEach((answer) => {
    setTimeout(() => {
      FindByAttributeValue("data-functional-selector", "answer-" + answer, "button").style.backgroundColor =
        "rgb(0, 255, 0)"
    }, 0)
  })
  question.incorrectAnswers.forEach((answer) => {
    setTimeout(() => {
      FindByAttributeValue("data-functional-selector", "answer-" + answer, "button").style.backgroundColor =
        "rgb(0, 0, 0)"
    }, 0)
  })
}

function answer(question, time) {
  Answered_PPT = PPT

  var delay = 0
  if (question.type == "multiple_select_quiz") delay = 30 // Reduced from 60
  setTimeout(() => {
    if (question.type == "quiz") {
      const key = (+question.answers[0] + 1).toString()
      const event = new KeyboardEvent("keydown", { key })
      window.dispatchEvent(event)
    }
    if (question.type == "multiple_select_quiz") {
      question.answers.forEach((answer) => {
        // Execute immediately
        const key = (+answer + 1).toString()
        const event = new KeyboardEvent("keydown", { key })
        window.dispatchEvent(event)
      })
      // Submit immediately after selecting answers
      FindByAttributeValue("data-functional-selector", "multi-select-submit-button", "button").click()
    }
  }, time - delay)
}

let isHidden = false
document.addEventListener("keydown", (event) => {
  if (event.key == "h" && event.altKey) {
    isHidden = !isHidden
  }

  if (event.key == "x" && event.altKey) {
    document.body.removeChild(uiElement)
    autoAnswer = false
    showAnswers = false
  }

  if (isHidden) {
    uiElement.style.display = "none"
  } else {
    uiElement.style.display = "block"
  }
})

setInterval(() => {
  var textElement = FindByAttributeValue("data-functional-selector", "question-index-counter", "div")
  if (textElement) {
    info.questionNum = +textElement.textContent - 1
  }
  if (
    FindByAttributeValue("data-functional-selector", "answer-0", "button") &&
    info.lastAnsweredQuestion != info.questionNum
  ) {
    info.lastAnsweredQuestion = info.questionNum
    onQuestionStart()
  }
  if (autoAnswer) {
    if (info.ILSetQuestion != info.questionNum) {
      var ppt = Answered_PPT
      if (ppt > 987) ppt = 1000
      var incrementElement = FindByAttributeValue("data-functional-selector", "score-increment", "span")
      if (incrementElement) {
        info.ILSetQuestion = info.questionNum
        var increment = +incrementElement.textContent.split(" ")[1]
        if (increment != 0) {
          inputLag += (ppt - increment) * 15
          if (inputLag < 0) {
            inputLag -= (ppt - increment) * 15
            inputLag += (ppt - increment / 2) * 15
          }
          inputLag = Math.round(inputLag)
        }
      }
    }
  }

  // Update status with question info if needed
  if (info.numQuestions > 0 && info.questionNum >= 0) {
    statusLabel.textContent = `Status: Q${info.questionNum + 1}/${info.numQuestions}`
  }
}, 1)


document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.name-box');
    const cSections = document.querySelectorAll('.content-section');

    // Hide all sections
    function hideAllSections() {
        cSections.forEach(section => {
            section.classList.add('hidden');
        });
    }

    // Show target section
    function showSection(id) {
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden');
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Attach event listeners to each button
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            hideAllSections();
            showSection(targetId);
        });
    });

    // Show the first section by default if needed
    if (cSections.length > 0) {
        hideAllSections();
        cSections[0].classList.remove('hidden');
    }
});

const questions = [
    {
     question: "Which instrument is the backbone of a band?",
    //  imageSrc: "images/quiz/quiz1.png",
     answers: [
        {text: "Drum", correct: true},
        {text: "Guitar", correct: false},
        {text: "Bass", correct: false},
        {text: "Piano", correct: false},
        ]
    },
    {
    
        question: "Which position is most commonly known?",
        // imageSrc: "images/quiz/quiz2.png",
        answers: [
        {text: "Singer", correct: true},
        {text: "Pianist", correct: false},
        {text: "Drummer", correct: false},
        {text: "Guitarist", correct: false},
        ]
    },
    {
    
        question: "Which position is least commonly known?",
        // imageSrc: "images/quiz/quiz3.png",
        answers: [
        {text: "Pianist", correct: false},
        {text: "Guitarist", correct: false},
        {text: "Bassist", correct: true},
        {text: "Drummer", correct: false},
        ]
    },
    {
        question: "Which one of the below is not a band?",
        // imageSrc: "images/quiz/quiz4.png",
        answers: [
        {text: "Nirvana", correct: false},
        {text: "Coldplay", correct: false},
        {text: "The Beatles", correct: false},
        {text: "Maroon5", correct: true},
        ]
    }
];

const questionElement = document.getElementById("question");
const questionImage = document.getElementById("question-image");
const answerbutton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){

    resetQuestions();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo+ "." + currentQuestion.question;


    //display the image if hidden
    questionImage.style.display = "block";
    //change the image for the questions
   questionImage.src = currentQuestion.imageSrc;


   //loop through MCQ options and create buttons for each question
   currentQuestion.answers.forEach(function(answer) {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerbutton.appendChild(button);

    if (answer.correct) {
        button.dataset.correct = answer.correct;
    }

    button.addEventListener("click", selectAnswer); 
    });

}
//clean up options from previous questions 
function resetQuestions(){
    nextButton.style.display = "none";
    while(answerbutton.firstChild){
        answerbutton.removeChild(answerbutton.firstChild);
    }

}


function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    // check if option is correct
    if (isCorrect){
        selectedBtn.classList.add("correct");
        score++;    //increase player score by 1
    }
    else{
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerbutton.children).forEach(function(button) {
        if (button.dataset.correct === "true") {
            // add correct class to button to change to green color
            button.classList.add("correct");
        }
        button.disabled = true; //disable all buttons
    });
    nextButton.style.display = "block"; //display next button to go next question


}
// call if game ends
function showScore() {
    resetQuestions();
    // display score
    questionElement.innerHTML = "You scored " + score + " out of " + questions.length + "!";
    
    // ask if player wants to restart
    nextButton.innerHTML = "Play Again";
    questionImage.style.display = "none";
    nextButton.style.display = "block";
}

function handleNextButton(){
    //increment question counter
    currentQuestionIndex++; 
    //if theres still questions, show questions, if no questions, show score
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }
    else{
        showScore();
    }
}
// when click on next button
nextButton.addEventListener("click", function() {
    if (currentQuestionIndex < questions.length) {
        // if there's still questions, go to next question
        handleNextButton();
    } else {
        // restart the quiz
        startQuiz();
    }
});

startQuiz();
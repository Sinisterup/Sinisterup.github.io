document.addEventListener('DOMContentLoaded', function () {
    // ===== TAB SYSTEM =====
    const tabButtons = document.querySelectorAll('.name-box');
    const cSections = document.querySelectorAll('.content-section');

    function hideAllSections() {
        cSections.forEach(section => {
            section.classList.add('hidden');
        });
    }

    function showSection(id) {
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden');
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function setupTabSystem() {
        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const targetId = this.getAttribute('data-target');
                hideAllSections();
                showSection(targetId);
            });
        });

        if (cSections.length > 0) {
            hideAllSections();
        }
    }

    // ===== QUIZ SYSTEM =====
    const questions = [
        {
            question: "Which instrument is the backbone of a band?",
            answers: [
                { text: "Drum", correct: true },
                { text: "Guitar", correct: false },
                { text: "Bass", correct: false },
                { text: "Piano", correct: false },
            ]
        },
        {
            question: "Which position is most commonly known?",
            answers: [
                { text: "Singer", correct: true },
                { text: "Pianist", correct: false },
                { text: "Drummer", correct: false },
                { text: "Guitarist", correct: false },
            ]
        },
        {
            question: "Which position is least commonly known?",
            answers: [
                { text: "Pianist", correct: false },
                { text: "Guitarist", correct: false },
                { text: "Bassist", correct: true },
                { text: "Drummer", correct: false },
            ]
        },
        {
            question: "Which one of the below is not a band?",
            answers: [
                { text: "Nirvana", correct: false },
                { text: "Coldplay", correct: false },
                { text: "The Beatles", correct: false },
                { text: "Maroon5", correct: true },
            ]
        }
    ];

    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    let currentQuestionIndex = 0;
    let score = 0;

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Next";
        showQuestion();
    }

    function showQuestion() {
        resetQuestions();

        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
        questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

        currentQuestion.answers.forEach(function (answer) {
            const button = document.createElement("button");
            button.innerHTML = answer.text;
            button.classList.add("btn");
            answerButtons.appendChild(button);

            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }

            button.addEventListener("click", selectAnswer);
        });
    }

    function resetQuestions() {
        nextButton.style.display = "none";
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";

        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }

        Array.from(answerButtons.children).forEach(function (button) {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        nextButton.style.display = "block";
    }

    function showScore() {
        resetQuestions();
        questionElement.innerHTML = "You scored " + score + " out of " + questions.length + "!";
        nextButton.innerHTML = "Play Again";
        nextButton.style.display = "block";
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    function setupQuiz() {
        nextButton.addEventListener("click", function () {
            if (currentQuestionIndex < questions.length) {
                handleNextButton();
            } else {
                startQuiz();
            }
        });

        startQuiz();
    }

    function setupSimpleComparison() {
        const slider = document.querySelector('.simple-slider');
        const rightImage = document.querySelector('.right-image');
        
        if (slider && rightImage) {
            rightImage.style.width = slider.value + '%';
        
            slider.addEventListener('input', function() {
                rightImage.style.width = this.value + '%';
            });
        }
    }

    const dots = document.querySelectorAll('.dot');
    const textBox = document.getElementById('text-box');
    
    dots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
        
            const text = this.getAttribute('data-text');
            const dotRect = this.getBoundingClientRect();
            const containerRect = this.parentElement.getBoundingClientRect();
        
            // Calculate position relative to container
            const dotX = dotRect.left - containerRect.left;
            const dotY = dotRect.top - containerRect.top;
        
            // Position text box
            textBox.textContent = text;
            textBox.style.display = 'block';
        
            // Position logic - avoid going off screen
            if (dotX > containerRect.width / 2) {
                textBox.style.left = '';
                textBox.style.right = `${100 - parseFloat(this.style.left) + 2}%`;
                textBox.classList.remove('right');
                textBox.classList.add('left');
            } else {
                textBox.style.right = '';
                textBox.style.left = `${parseFloat(this.style.left) + 2}%`;
                textBox.classList.remove('left');
                textBox.classList.add('right');
            }
        
            textBox.style.top = this.style.top;
        });
    });
    
    // Close text box when clicking anywhere else
    document.addEventListener('click', function() {
        textBox.style.display = 'none';
    });
    
    // Prevent text box from closing when clicking on it
    textBox.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    const cards = document.querySelectorAll('.card');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentIndex = 0;
let intervalId;

function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev-card', 'next-card');
        
        if (index === currentIndex) {
            card.classList.add('active');
        } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add('prev-card');
        } else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add('next-card');
        }
    });
}

function nextCard() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
}

function startAutoCycle() {
    intervalId = setInterval(nextCard, 3000);
}

function resetAutoCycle() {
    clearInterval(intervalId);
    startAutoCycle();
}

// Initialize carousel
updateCarousel();
startAutoCycle();

// Event listeners
prevBtn.addEventListener('click', function() {
    resetAutoCycle();
    prevCard();
});

nextBtn.addEventListener('click', function() {
    resetAutoCycle();
    nextCard();
});


    // ===== INITIALIZE SYSTEMS =====
    setupTabSystem();
    setupQuiz();
    setupSimpleComparison();
});

function toggleGuitarInfo(type) {
    const infoDiv = document.getElementById(`${type}-info`);
    const button = document.querySelector(`button[onclick="toggleGuitarInfo('${type}')"]`);
    
    // Toggle visibility
    infoDiv.classList.toggle('hidden');
    
    // Update button text
    if (infoDiv.classList.contains('hidden')) {
        button.textContent = `Show ${type.charAt(0).toUpperCase() + type.slice(1)} Guitar Info`;
    } else {
        button.textContent = `Hide ${type.charAt(0).toUpperCase() + type.slice(1)} Guitar Info`;
    }
    
    // Smooth scroll to the content if showing
    if (!infoDiv.classList.contains('hidden')) {
        infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
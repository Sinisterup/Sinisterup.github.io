document.addEventListener('DOMContentLoaded', function () {
    
    //Navigation tabs
    const tabButtons = document.querySelectorAll('.name-box');
    const cSections = document.querySelectorAll('.content-section');

    //Setup hiding and showing specific tabs
    function hideAllSections() {
        cSections.forEach(function(section) {
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

    //Button for which tab to be shown
    function setupTabSystem() {
        tabButtons.forEach(function(button) {
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

    //Quiz content
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

    const qnElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    let currentQnIndex = 0;
    let score = 0;

    function startQuiz() {
        currentQnIndex = 0;
        score = 0;
        nextButton.innerHTML = "Next";
        showQuestion();
    }

    //Setup quiz buttons, stores points and clear old qn
    function showQuestion() {
        resetQuestions();

        let currentQn = questions[currentQnIndex];
        let questionNo = currentQnIndex + 1;
        qnElement.innerHTML = questionNo + ". " + currentQn.question;

        currentQn.answers.forEach(function (answer) {
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
        qnElement.innerHTML = "You scored " + score + " out of " + questions.length + "!";
        nextButton.innerHTML = "Play Again";
        nextButton.style.display = "block";
    }

    function handleNextButton() {
        currentQnIndex++;
        if (currentQnIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }

    function setupQuiz() {
        nextButton.addEventListener("click", function () {
            if (currentQnIndex < questions.length) {
                handleNextButton();
            } else {
                startQuiz();
            }
        });

        startQuiz();
    }

    //Comparison slider
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

    //Dot buttons on the drums image
    const dots = document.querySelectorAll('.dot');
    const textBox = document.getElementById('text-box');
    
    dots.forEach(function(dot) {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
        
            const text = this.getAttribute('data-text');
            //getting position and size of textbox and container
            const dotRect = this.getBoundingClientRect();
            const containerRect = this.parentElement.getBoundingClientRect();
            const dotX = dotRect.left - containerRect.left;
        
            textBox.textContent = text;
            textBox.style.display = 'block';
        
            // Position logic so that its not off-screen
            if (dotX > containerRect.width / 2) {
                textBox.style.left = '';
                textBox.style.right = (100 - parseFloat(this.style.left) + 2) + '%';
                textBox.classList.remove('right');
                textBox.classList.add('left');
            } else {
                textBox.style.right = '';
                textBox.style.left = (parseFloat(this.style.left) + 2) + '%';
                textBox.classList.remove('left');
                textBox.classList.add('right');
            }
        
            textBox.style.top = this.style.top;
        });
    });
    
    document.addEventListener('click', function() {
        textBox.style.display = 'none';
    });
    
    textBox.addEventListener('click', function(e) {
        e.stopPropagation();
    });


    //Piano card cycle
    const cards = document.querySelectorAll('.card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let intervalId;

    //Setup card list
    function updateCycle() {
        cards.forEach(function(card, index) {
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
        updateCycle();
    }

    function prevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCycle();
    }

    //Auto cycle through cards
    function startAutoCycle() {
        intervalId = setInterval(nextCard, 3000);
    }

    function resetAutoCycle() {
        clearInterval(intervalId);
        startAutoCycle();
    }

    //Call functions
    updateCycle();
    startAutoCycle();

    prevBtn.addEventListener('click', function() {
        resetAutoCycle();
        prevCard();
    });

    nextBtn.addEventListener('click', function() {
        resetAutoCycle();
        nextCard();
    });

    //Fullscreen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }
    
    function enterFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }
    
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    setupTabSystem();
    setupQuiz();
    setupSimpleComparison();
});

//Guitar show function
function toggleGuitarInfo(type) {
    var infoDiv = document.getElementById(type + '-info');
    var button = document.querySelector('button[onclick="toggleGuitarInfo(\'' + type + '\')"]');
    infoDiv.classList.toggle('hidden');
    
    //Change button text
    if (infoDiv.classList.contains('hidden')) {
        button.textContent = 'Show ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Guitar Info';
    } else {
        button.textContent = 'Hide ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Guitar Info';
    }
    
    //Scroll to content
    if (!infoDiv.classList.contains('hidden')) {
        infoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}


//Game function
function playInstrument(memberId) {
    const member = document.getElementById(memberId);
    const soundDisplay = member.querySelector('.sound-display');
    soundDisplay.innerHTML = ''; //Remove any existing animation
    // Create animation
    const animation = document.createElement('div');
    animation.className = 'sound-animation';
    soundDisplay.appendChild(animation);
    
    //Setup sounds
    let soundText = '';
    switch(memberId) {
        case 'singer':
            soundText = 'La la la!';
            break;
        case 'guitarist':
            soundText = 'Guitar sounds';
            break;
        case 'drummer':
            soundText = 'Drum sounds';
            break;
        case 'bassist':
            soundText = 'BASSSSSS';
            break;
    }
    
    // Show sounds and clear
    const reaction = document.getElementById('crowd-reaction');
    reaction.textContent = soundText;
    setTimeout(function() {
        reaction.textContent = '';
    }, 1000);
}

function playAll() {
    // Play all instruments at once
    playInstrument('singer');
    playInstrument('guitarist');
    playInstrument('drummer');
    playInstrument('bassist');
    
    // New crowd reaction
    setTimeout(function() {
        const reaction = document.getElementById('crowd-reaction');
        reaction.textContent = 'Crowd goes wild!';
        
        setTimeout(function() {
            reaction.textContent = '';
        }, 2000);
    }, 500);
}
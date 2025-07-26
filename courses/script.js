let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let timerDuration = 600; // 10 minutes in seconds
let timerInterval;

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    userAnswers = new Array(questions.length).fill(null);
    displayQuestion();
    startTimer();
  });

function displayQuestion() {
  const questionData = questions[currentQuestion];
  document.getElementById('question-number').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  document.getElementById('question-text').textContent = questionData.question;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  questionData.options.forEach(option => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = option;
    
    if (userAnswers[currentQuestion] === option) {
      btn.classList.add('selected');
    }
    
    btn.addEventListener('click', () => {
      userAnswers[currentQuestion] = option;
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
    
    optionsContainer.appendChild(btn);
  });
  
  document.getElementById('prev-btn').disabled = currentQuestion === 0;
  document.getElementById('next-btn').disabled = currentQuestion === questions.length - 1;
  
  document.getElementById('submit-btn').style.display =
    currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
}

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    displayQuestion();
  }
});

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
});

document.getElementById('submit-btn').addEventListener('click', () => {
  calculateScoreAndShow();
});

function calculateScoreAndShow() {
  let score = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) {
      score++;
    }
  });
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('result-container').classList.remove('hidden');
  document.getElementById('score').textContent = score;
  clearInterval(timerInterval); // stop the timer
}

function autoSubmit() {
  alert("⏰ Time's up! Auto-submitting your test.");
  calculateScoreAndShow();
}

function startTimer() {
  const timerElement = document.getElementById('timer');
  timerInterval = setInterval(() => {
    const minutes = Math.floor(timerDuration / 60);
    const seconds = timerDuration % 60;
    timerElement.textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (timerDuration <= 0) {
      clearInterval(timerInterval);
      autoSubmit(); // Auto-submit when time ends
    } else {
      timerDuration--;
    }
  }, 1000);
}
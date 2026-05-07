// Game data for "Jenis dan Sifat Tanah"
const gameQuestions = [
  {
    id: 1,
    question: "Antara berikut, yang manakah bukan jenis tanah?",
    options: ["Tanah liat", "Tanah pasir", "Tanah besi", "Tanah loam"],
    correct: 2
  },
  {
    id: 2,
    question: "Tanah yang mempunyai saiz kumin paling besar ialah:",
    options: ["Tanah liat", "Tanah kelodak", "Tanah pasir", "Tanah organik"],
    correct: 2
  },
  {
    id: 3,
    question: "Saiz kumin antara 0.002 mm hingga 0.05 mm merujuk kepada:",
    options: ["Tanah liat", "Tanah pasir", "Tanah kelodak", "Tanah organik"],
    correct: 2
  },
  {
    id: 4,
    question: "Antara berikut, yang manakah contoh jenis tanah di Malaysia?",
    options: ["Tanah granit", "Tanah loam", "Tanah simen", "Tanah logam"],
    correct: 1
  },
  {
    id: 5,
    question: "Tanah yang melekit ketika basah dan mudah dibentuk ialah:",
    options: ["Tanah pasir", "Tanah liat", "Tanah kelodak", "Tanah loam"],
    correct: 1
  },
  {
    id: 6,
    question: "Tanah yang mempunyai saliran sederhana baik ialah:",
    options: ["Tanah liat", "Tanah pasir", "Tanah loam", "Tanah organik"],
    correct: 2
  },
  {
    id: 7,
    question: "Tanah yang mempunyai kandungan nutrien tinggi ialah:",
    options: ["Tanah pasir", "Tanah organik", "Tanah liat", "Tanah kelodak"],
    correct: 1
  },
  {
    id: 8,
    question: "Tanah yang mempunyai rongga udara sangat kecil ialah:",
    options: ["Tanah pasir", "Tanah loam", "Tanah liat", "Tanah organik"],
    correct: 2
  },
  {
    id: 9,
    question: "Apakah kelemahan tanah berpasir terhadap tanaman?",
    options: ["Menyimpan air terlalu banyak", "Mudah menakung air", "Air cepat hilang dan tanah mudah kering", "Sukar ditembusi akar"],
    correct: 2
  },
  {
    id: 10,
    question: "Tanah yang mempunyai ciri berikut:<br>• Saliran kurang baik<br>• Mudah menakung air<br>• Mudah padat<br><br>Apakah jenis tanah tersebut?",
    options: ["Tanah pasir", "Tanah liat", "Tanah loam", "Tanah organik"],
    correct: 1,
    isHtml: true
  },
  {
    id: 11,
    question: "Tanah yang mempunyai ciri berikut:<br>• Rongga udara sangat besar<br>• Saiz kumin > 0.05 mm<br><br>Apakah jenis tanah tersebut?",
    options: ["Tanah liat", "Tanah loam", "Tanah pasir", "Tanah organik"],
    correct: 2,
    isHtml: true
  },
  {
    id: 12,
    question: "Tanah yang mempunyai ciri berikut:<br>• Daya memegang air sederhana<br>• Saiz kumin 0.005 mm<br>• Rongga udara besar<br><br>Apakah jenis tanah tersebut?",
    options: ["Tanah liat", "Tanah kelodak", "Tanah pasir", "Tanah organik"],
    correct: 1,
    isHtml: true
  },
  {
    id: 13,
    question: "Tanah yang mempunyai ciri berikut:<br>• Daya memegang air tinggi<br>• Saiz kumin < 0.002 mm<br>• Rongga udara sangat kecil<br><br>Apakah jenis tanah tersebut?",
    options: ["Tanah liat", "Tanah loam", "Tanah pasir", "Tanah kelodak"],
    correct: 0,
    isHtml: true
  },
  {
    id: 14,
    question: "Tanah yang mempunyai ciri berikut:<br>• Kehilangan nutrien mudah berlaku<br>• Air cepat kering<br>• Mudah hakisan<br><br>Apakah jenis tanah tersebut?",
    options: ["Tanah liat", "Tanah loam", "Tanah pasir", "Tanah organik"],
    correct: 2,
    isHtml: true
  },
  {
    id: 15,
    question: "Mengapakah tanah pasir cepat kering selepas disiram air?",
    options: ["Rongga udara sangat kecil", "Daya memegang air tinggi", "Rongga udara besar menyebabkan air mudah mengalir keluar", "Kandungan nutrien tinggi"],
    correct: 2
  }
];

// Game state
let gameState = {
  currentQuestion: 0,
  score: 0,
  answeredQuestions: new Set(),
  unlockedLayers: new Set() // Start with bedrock visible
};

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  loadQuestion();
  updateProgress();
});

// Load and display current question
function loadQuestion() {
  const question = gameQuestions[gameState.currentQuestion];
  
  // Update question number and text
  document.getElementById('question-num').textContent = question.id;
  const questionEl = document.getElementById('question-text');
  
  // Use innerHTML for formatted text, textContent for plain text
  if (question.isHtml) {
    questionEl.innerHTML = question.question;
  } else {
    questionEl.textContent = question.question;
  }
  
  // Clear feedback
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('btn-next').style.display = 'none';
  
  // Generate options
  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option;
    button.onclick = () => selectOption(index);
    optionsGrid.appendChild(button);
  });
  
  updateProgress();
}

// Handle option selection
function selectOption(selectedIndex) {
  const question = gameQuestions[gameState.currentQuestion];
  const feedback = document.getElementById('feedback');
  const buttons = document.querySelectorAll('.option-button');
  
  // Disable all buttons
  buttons.forEach(btn => btn.disabled = true);
  
  // Mark selected button
  buttons[selectedIndex].classList.add('selected');
  
  if (selectedIndex === question.correct) {
    // Correct answer
    gameState.score++;
    gameState.answeredQuestions.add(gameState.currentQuestion);
    
    feedback.innerHTML = '<div class="feedback-correct">✓ Betul!</div>';
    buttons[selectedIndex].classList.add('correct');
    
    // Unlock soil layer every 3 correct answers (from bottom to top)
    const layerToUnlock = Math.floor((gameState.score - 1) / 3) + 1;
    if (gameState.score % 3 === 0 && layerToUnlock <= 5) {
      unlockLayer(layerToUnlock);
    }
    
  } else {
    // Wrong answer
    feedback.innerHTML = '<div class="feedback-wrong">✗ Salah. Jawapan yang betul adalah: <strong>' + question.options[question.correct] + '</strong></div>';
    buttons[selectedIndex].classList.add('wrong');
    buttons[question.correct].classList.add('correct-highlight');
  }
  
  // Show continue button after a delay (for both correct and wrong answers)
  setTimeout(() => {
    document.getElementById('btn-next').style.display = 'block';
  }, 800);
}

// Unlock soil layer
function unlockLayer(stage) {
  if (!gameState.unlockedLayers.has(stage)) {
    gameState.unlockedLayers.add(stage);
    
    // Animate layer appearance
    const layer = document.getElementById(`layer-${stage}`);
    if (layer) {
      layer.classList.add('layer-unlock');
      layer.style.animation = 'layerPopIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
  }
}

// Next question
document.getElementById('btn-next').addEventListener('click', function() {
  if (gameState.currentQuestion < gameQuestions.length - 1) {
    gameState.currentQuestion++;
    loadQuestion();
  } else {
    showCompletion();
  }
});

// Update progress bar
function updateProgress() {
  const progress = ((gameState.currentQuestion) / gameQuestions.length) * 100;
  document.getElementById('progress-fill').style.width = progress + '%';
}

// Show completion screen
function showCompletion() {
  document.querySelector('.question-card').style.display = 'none';
  document.getElementById('completion-screen').style.display = 'flex';
  document.getElementById('final-score').textContent = gameState.score;
  
  // Animate completion
  document.getElementById('completion-screen').style.animation = 'fadeIn 0.6s ease';
}

// Add CSS animations to head
const style = document.createElement('style');
style.textContent = `
  @keyframes layerPopIn {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    50% {
      transform: scale(1.05) translateY(-2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

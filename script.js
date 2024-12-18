let questions = [];
let correctAnswers = [];

function showTeacherSection() {
    document.getElementById('teacherSection').style.display = 'block';
    document.getElementById('studentSection').style.display = 'none';
}

function showStudentSection() {
    if (questions.length > 0) {
        document.getElementById('teacherSection').style.display = 'none';
        document.getElementById('studentSection').style.display = 'block';
    } else {
        alert('目前沒有題目可作答，請等待教師載入題目');
    }
}

function loadQuestions() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            
            processExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }
}

function processExcelData(data) {
    questions = data.map(row => ({
        question: row.question,
        options: [row.option1, row.option2, row.option3, row.option4],
        correctAnswer: row.correctAnswer
    }));
    
    displayQuestions();
    document.getElementById('teacherSection').style.display = 'none';
    document.getElementById('studentSection').style.display = 'block';
}

function displayQuestions() {
    const container = document.getElementById('questionContainer');
    container.innerHTML = '';
    
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p><strong>題目 ${index + 1}:</strong> ${q.question}</p>
            <div class="options">
                ${q.options.map((option, i) => `
                    <div>
                        <input type="radio" name="q${index}" value="${i}">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

function submitQuiz() {
    let score = 0;
    const result = document.getElementById('result');
    
    questions.forEach((q, index) => {
        const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedAnswer && parseInt(selectedAnswer.value) === q.correctAnswer - 1) {
            score++;
        }
    });
    
    const percentage = (score / questions.length) * 100;
    result.innerHTML = `得分: ${score}/${questions.length} (${percentage}%)`;
}
const root = document.getElementById('app');
const routes = {
  '/': renderHome,
  '/login': renderLogin,
  '/quizzes': renderQuizzes,
  '/results': renderResults,
};

const quizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'A quick quiz for JavaScript fundamentals.',
    questions: [
      { question: 'What does DOM stand for?', answers: ['Document Object Model', 'Data Object Model', 'Desktop Object Model'], correct: 0 },
      { question: 'Which keyword defines a constant in JavaScript?', answers: ['const', 'let', 'var'], correct: 0 },
    ],
  },
  {
    id: 2,
    title: 'Web App Routing',
    description: 'Test your knowledge of client-side routes.',
    questions: [
      { question: 'Which URL part is used for hash routing?', answers: ['#', '?', '/'], correct: 0 },
    ],
  },
];

let currentQuiz = null;
let currentAnswers = {};

function renderHome() {
  root.innerHTML = `
    <section class="page-card">
      <h1>Welcome to Test App</h1>
      <p>This frontend demo contains a simple routed UI with pages for login, quizzes, and results.</p>
      <div class="button-row">
        <button class="button" onclick="navigateTo('/login')">Login</button>
        <button class="button" onclick="navigateTo('/quizzes')">Browse Quizzes</button>
      </div>
    </section>
  `;
}

function renderLogin() {
  root.innerHTML = `
    <section class="page-card">
      <h1>Login</h1>
      <form id="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter password" required />
        </div>
        <button class="button" type="submit">Continue</button>
      </form>
      <small>Use any email/password to continue.</small>
    </section>
  `;

  const form = document.getElementById('login-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    alert('Login successful! Redirecting to quizzes...');
    navigateTo('/quizzes');
  });
}

function renderQuizzes() {
  const quizItems = quizzes.map(quiz => `
    <li class="quiz-card">
      <h3>${quiz.title}</h3>
      <p>${quiz.description}</p>
      <div class="button-row">
        <button class="button" onclick="startQuiz(${quiz.id})">Start Quiz</button>
      </div>
    </li>
  `).join('');

  root.innerHTML = `
    <section class="page-card">
      <h1>Available Quizzes</h1>
      <ul class="quiz-list">${quizItems}</ul>
    </section>
  `;
}

function renderResults() {
  const completed = currentQuiz ? `Quiz: ${currentQuiz.title}` : 'No quiz attempted yet.';
  const answerCount = Object.keys(currentAnswers).length;
  root.innerHTML = `
    <section class="page-card">
      <h1>Results</h1>
      <p>${completed}</p>
      <p>${answerCount > 0 ? 'You have answered ' + answerCount + ' question(s).' : 'Try a quiz first to view results.'}</p>
      <div class="button-row">
        <button class="button" onclick="navigateTo('/quizzes')">Choose a quiz</button>
      </div>
    </section>
  `;
}

function renderQuizDetail(quizId) {
  currentQuiz = quizzes.find(quiz => quiz.id === quizId);
  if (!currentQuiz) {
    root.innerHTML = `<section class="page-card"><h1>Quiz not found</h1></section>`;
    return;
  }

  const questionsHtml = currentQuiz.questions.map((item, index) => `
    <li class="quiz-card">
      <h3>${item.question}</h3>
      <ul class="answer-list">
        ${item.answers.map((answer, answerIdx) => `
          <li>
            <label>
              <input type="radio" name="question-${index}" value="${answerIdx}" />
              ${answer}
            </label>
          </li>
        `).join('')}
      </ul>
    </li>
  `).join('');

  root.innerHTML = `
    <section class="page-card">
      <h1>${currentQuiz.title}</h1>
      <p>${currentQuiz.description}</p>
      <form id="quiz-form">
        <ol>${questionsHtml}</ol>
        <div class="button-row">
          <button class="button" type="submit">Submit Answers</button>
          <button class="button" type="button" onclick="navigateTo('/quizzes')">Back</button>
        </div>
      </form>
    </section>
  `;

  const form = document.getElementById('quiz-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    currentAnswers = {};
    currentQuiz.questions.forEach((_, index) => {
      currentAnswers[index] = formData.get(`question-${index}`) ?? null;
    });
    alert('Quiz submitted! Redirecting to results.');
    navigateTo('/results');
  });
}

function navigateTo(path) {
  window.location.hash = `#${path}`;
}

function updateActiveNav() {
  const currentHash = window.location.hash.replace(/^#/, '') || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPath = link.getAttribute('href').replace(/^#/, '');
    link.classList.toggle('active', linkPath === currentHash);
  });
}

function route() {
  updateActiveNav();
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const segments = hash.split('/').filter(Boolean);
  const routePath = segments.length ? `/${segments[0]}` : '/';
  const param = segments.length > 1 ? Number(segments[1]) : undefined;

  if (routePath === '/quiz' && param) {
    renderQuizDetail(param);
    return;
  }

  const view = routes[hash] || routes[routePath] || renderNotFound;
  view();
}

function renderNotFound() {
  root.innerHTML = `
    <section class="page-card">
      <h1>Page not found</h1>
      <p>The route you requested does not exist.</p>
      <div class="button-row">
        <button class="button" onclick="navigateTo('/')">Go home</button>
      </div>
    </section>
  `;
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

window.startQuiz = function (quizId) {
  navigateTo(`/quiz/${quizId}`);
};

import { useState } from 'react';
import { NavLink, Link, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const quizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'A quick quiz for JavaScript fundamentals.',
    questions: [
      {
        question: 'What does DOM stand for?',
        answers: ['Document Object Model', 'Data Object Model', 'Desktop Object Model'],
      },
      {
        question: 'Which keyword defines a constant in JavaScript?',
        answers: ['const', 'let', 'var'],
      },
    ],
  },
  {
    id: 2,
    title: 'Web App Routing',
    description: 'Test your knowledge of client-side routes.',
    questions: [
      {
        question: 'Which URL part is used for hash routing?',
        answers: ['#', '?', '/'],
      },
    ],
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  return (
    <div className="app-shell">
      <header>
        <div className="brand">Test App</div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Login
          </NavLink>
          <NavLink to="/quizzes" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Quizzes
          </NavLink>
          <NavLink to="/results" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Results
          </NavLink>
        </nav>
      </header>

      <main id="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
          <Route path="/quizzes" element={<QuizList onSelect={quiz => setSelectedQuiz(quiz)} />} />
          <Route path="/quiz/:id" element={<QuizDetail onSubmit={data => setAnswers(data)} />} />
          <Route path="/results" element={<Results quiz={selectedQuiz} answers={answers} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <span>{loggedIn ? 'Logged in' : 'Not logged in yet'}</span>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <section className="page-card">
      <h1>Welcome to Test App</h1>
      <p>This React frontend demo includes route-based pages for login, quizzes, and results.</p>
    </section>
  );
}

function Login({ onLogin }) {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    onLogin();
    navigate('/quizzes');
  }

  return (
    <section className="page-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter password" required />
        </div>
        <button className="button" type="submit">Continue</button>
      </form>
      <small>Use any email/password to continue.</small>
    </section>
  );
}

function QuizList({ onSelect }) {
  return (
    <section className="page-card">
      <h1>Available Quizzes</h1>
      <ul className="quiz-list">
        {quizzes.map(quiz => (
          <li key={quiz.id} className="quiz-card">
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <div className="button-row">
              <Link to={`/quiz/${quiz.id}`} className="button link-button" onClick={() => onSelect(quiz)}>
                Start Quiz
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function QuizDetail({ onSubmit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find(item => item.id === Number(id));
  const [values, setValues] = useState({});

  if (!quiz) {
    return (
      <section className="page-card">
        <h1>Quiz not found</h1>
      </section>
    );
  }

  function handleChange(event, index) {
    setValues(prev => ({ ...prev, [index]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
    navigate('/results');
  }

  return (
    <section className="page-card">
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      <form onSubmit={handleSubmit}>
        <ol>
          {quiz.questions.map((question, index) => (
            <li key={index} className="quiz-card">
              <h3>{question.question}</h3>
              <ul className="answer-list">
                {question.answers.map((answer, answerIndex) => (
                  <li key={answerIndex}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={answer}
                        checked={values[index] === answer}
                        onChange={event => handleChange(event, index)}
                        required
                      />
                      {answer}
                    </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="button-row">
          <button className="button" type="submit">Submit Answers</button>
          <button className="button" type="button" onClick={() => navigate('/quizzes')}>
            Back
          </button>
        </div>
      </form>
    </section>
  );
}

function Results({ quiz, answers }) {
  if (!quiz) {
    return (
      <section className="page-card">
        <h1>Results</h1>
        <p>No quiz selected yet. Please choose a quiz first.</p>
      </section>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <section className="page-card">
      <h1>Results</h1>
      <p>Quiz: {quiz.title}</p>
      <p>You answered {answeredCount} question(s).</p>
    </section>
  );
}

function NotFound() {
  return (
    <section className="page-card">
      <h1>Page not found</h1>
    </section>
  );
}

export default App;

import { useState } from 'react';
import { Card } from '../components/common/Card';
import { SimulatedLabel, Disclaimer } from '../components/common/SimulatedLabel';
import { useStore } from '../store/useStore';
import { Check, ChevronDown, BookOpen, HelpCircle } from 'lucide-react';

export function Learn() {
  const { lessons, toggleLesson, completedLessonCount } = useStore();
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});

  const filtered = activeCategory === 'all'
    ? lessons
    : lessons.filter((l) => l.category === activeCategory);

  const handleQuiz = (lessonId: string, questionIdx: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    const correct = lesson.quiz[questionIdx].correct === quizAnswers[`${lessonId}-${questionIdx}`];
    setQuizResults((prev) => ({ ...prev, [`${lessonId}-${questionIdx}`]: correct }));
  };

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Learn</h1>
          <p className="text-text-secondary text-sm mt-1">
            {completedLessonCount()}/{lessons.length} lessons completed
          </p>
        </div>
        <SimulatedLabel />
      </div>

      {/* Progress bar */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-bg-hover rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${(completedLessonCount() / lessons.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-text-primary">
            {Math.round((completedLessonCount() / lessons.length) * 100)}%
          </span>
        </div>
      </Card>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-text-secondary bg-bg-hover hover:bg-border-light hover:text-text-primary border border-border-light'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lesson) => (
          <Card key={lesson.id} className={lesson.completed ? 'glow-accent' : ''}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">{lesson.title}</h3>
              </div>
              {lesson.completed && <Check size={16} className="text-profit" />}
            </div>
            <p className="text-xs text-text-secondary mb-3">{lesson.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                lesson.category === 'beginner' ? 'bg-profit/10 text-profit' :
                lesson.category === 'intermediate' ? 'bg-accent/10 text-accent' :
                'bg-loss/10 text-loss'
              }`}>
                {lesson.category}
              </span>
              <span className="text-[10px] text-text-secondary">{lesson.quiz.length} questions</span>
            </div>

            {expandedLesson === lesson.id ? (
              <div className="space-y-3 animate-slide-up">
                <div className="bg-bg-hover rounded-lg p-3 text-xs text-text-secondary leading-relaxed border border-border-light">
                  {lesson.content}
                </div>

                {/* Quiz */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-text-primary flex items-center gap-1">
                    <HelpCircle size={12} /> Quiz
                  </div>
                  {lesson.quiz.map((q, qi) => {
                    const answer = quizAnswers[`${lesson.id}-${qi}`];
                    const quizResult = quizResults[`${lesson.id}-${qi}`];
                    const isCorrect = q.correct === answer;
                    let btnClass = 'bg-bg-panel border border-border-light text-text-secondary hover:border-accent';
                    if (answer !== undefined) {
                      if (isCorrect) btnClass = 'bg-profit/10 border-profit text-profit';
                      else if (qi === answer) btnClass = 'bg-loss/10 border-loss text-loss';
                      else btnClass = 'bg-bg-panel border-border-light text-text-muted';
                    }
                    return (
                      <div key={qi} className="bg-bg-hover rounded-lg p-2.5 border border-border-light/50">
                        <p className="text-xs text-text-primary mb-2">{q.question}</p>
                        <div className="space-y-1">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => {
                                if (answer === undefined) {
                                  setQuizAnswers((prev) => ({ ...prev, [`${lesson.id}-${qi}`]: oi }));
                                  handleQuiz(lesson.id, qi);
                                }
                              }}
                              disabled={answer !== undefined}
                              className={`w-full text-left text-xs px-2 py-1.5 rounded transition-all ${btnClass}`}
                            >
                              <span className="mr-1">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                              {answer !== undefined && isCorrect && <Check size={10} className="inline ml-1" />}
                            </button>
                          ))}
                        </div>
                        {quizResult !== undefined && (
                          <p className={`text-[10px] mt-1 font-medium ${quizResult ? 'text-profit' : 'text-loss'}`}>
                            {quizResult ? 'Correct!' : 'Incorrect'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    lesson.completed
                      ? 'bg-bg-hover text-text-muted cursor-default'
                      : 'btn-primary'
                  }`}
                >
                  {lesson.completed ? 'Completed' : 'Mark as Complete'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setExpandedLesson(lesson.id)}
                className="w-full text-left text-xs text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
              >
                Expand <ChevronDown size={12} />
              </button>
            )}
          </Card>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CookMode = ({ recipe, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Request fullscreen
    const requestFullscreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.log('Fullscreen not supported');
      }
    };
    requestFullscreen();

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (timer && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            // Timer finished
            playNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, timerSeconds]);

  const playNotificationSound = () => {
    // Play a beep sound or show notification
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzGH0fPTgjM');
    audio.play().catch(() => {});
  };

  const startTimer = (minutes) => {
    setTimer('active');
    setTimerSeconds(minutes * 60);
  };

  const stopTimer = () => {
    setTimer(null);
    setTimerSeconds(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStep < (recipe.instructions?.length || 0) - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    if (onExit) {
      onExit();
    }
  };

  const currentInstruction = recipe.instructions?.[currentStep] || {};
  const instructionText = typeof currentInstruction === 'string' 
    ? currentInstruction 
    : currentInstruction.instruction || '';

  return (
    <div className="cook-mode">
      <div className="cook-mode-header">
        <button onClick={exitFullscreen} className="exit-cook-mode-btn">
          <i className="fas fa-times"></i> Exit Cook Mode
        </button>
        <h2>{recipe.title}</h2>
        <div className="cook-mode-progress">
          Step {currentStep + 1} of {recipe.instructions?.length || 0}
        </div>
      </div>

      <div className="cook-mode-content">
        {/* Timer */}
        {timer && (
          <div className="cook-mode-timer">
            <div className="timer-display">
              <i className="fas fa-clock"></i>
              {formatTime(timerSeconds)}
            </div>
            <button onClick={stopTimer} className="btn btn-sm">
              <i className="fas fa-stop"></i> Stop Timer
            </button>
          </div>
        )}

        {/* Current Step */}
        <div className="cook-mode-step">
          <div className="step-number">{currentStep + 1}</div>
          <div className="step-content">
            <p className="step-instruction">{instructionText}</p>
            
            {/* Quick Timer Buttons */}
            {!timer && (
              <div className="quick-timers">
                <button onClick={() => startTimer(5)} className="timer-btn">
                  <i className="fas fa-clock"></i> 5 min
                </button>
                <button onClick={() => startTimer(10)} className="timer-btn">
                  <i className="fas fa-clock"></i> 10 min
                </button>
                <button onClick={() => startTimer(15)} className="timer-btn">
                  <i className="fas fa-clock"></i> 15 min
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div className="cook-mode-ingredients">
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients?.slice(0, 8).map((ing, index) => (
              <li key={index}>
                {ing.amount} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="cook-mode-navigation">
        <button
          onClick={previousStep}
          disabled={currentStep === 0}
          className="btn btn-large"
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep >= (recipe.instructions?.length || 0) - 1}
          className="btn btn-large btn-primary"
        >
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default CookMode;


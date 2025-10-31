import { useState, useEffect } from 'react'

const CookingTimer = ({ isOpen, onClose }) => {
  const [minutes, setMinutes] = useState(10)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      // Play alert sound
      playAlert()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const playAlert = () => {
    // Simple alert
    alert('⏰ Timer finished! Your dish is ready!')
  }

  const startTimer = () => {
    const totalSeconds = (minutes * 60) + seconds
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds)
      setIsRunning(true)
    }
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setMinutes(10)
    setSeconds(0)
  }

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <div className="timer-modal-overlay" onClick={onClose}>
      <div className="timer-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <h3><i className="fas fa-clock"></i> Cooking Timer</h3>
        
        {!isRunning && timeLeft === 0 ? (
          <div className="timer-setup">
            <div className="time-inputs">
              <div className="time-input-group">
                <label>Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <span className="time-separator">:</span>
              <div className="time-input-group">
                <label>Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>
            <div className="quick-times">
              <button onClick={() => { setMinutes(5); setSeconds(0) }}>5 min</button>
              <button onClick={() => { setMinutes(10); setSeconds(0) }}>10 min</button>
              <button onClick={() => { setMinutes(15); setSeconds(0) }}>15 min</button>
              <button onClick={() => { setMinutes(20); setSeconds(0) }}>20 min</button>
              <button onClick={() => { setMinutes(30); setSeconds(0) }}>30 min</button>
            </div>
          </div>
        ) : (
          <div className="timer-display-large">
            {formatTime(timeLeft)}
          </div>
        )}
        
        <div className="timer-controls">
          {!isRunning && timeLeft === 0 ? (
            <button className="btn primary" onClick={startTimer}>
              <i className="fas fa-play"></i> Start Timer
            </button>
          ) : (
            <>
              {isRunning ? (
                <button className="btn" onClick={pauseTimer}>
                  <i className="fas fa-pause"></i> Pause
                </button>
              ) : (
                <button className="btn primary" onClick={() => setIsRunning(true)}>
                  <i className="fas fa-play"></i> Resume
                </button>
              )}
              <button className="btn outline" onClick={resetTimer}>
                <i className="fas fa-redo"></i> Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CookingTimer


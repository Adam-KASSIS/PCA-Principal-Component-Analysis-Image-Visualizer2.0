import React from 'react';
import Game2048 from './Game2048';

function ColdStartExperience({
  progress,
  coldStart,
  showGame,
  isReady,
  readyNotice,
  finalScore,
  onStartGame,
  onSkipGame,
  onScoreChange,
  onGameOver,
  stopGameSignal
}) {
  return (
    <div className="loading-stage">
      <div className="loading-shell">
        <div className="loading-header">
          <p className="loading-kicker">PCA Image Lab</p>
          <h1 className="loading-title">Warming the server</h1>
          <p className="loading-subtitle">
            We are spinning up the free tier backend. Thanks for your patience.
          </p>
        </div>

        <div className="loading-bar-wrap" aria-live="polite">
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="loading-bar-meta">
            <span>{progress}%</span>
            <span>{isReady ? 'Ready' : 'Starting server'}</span>
          </div>
        </div>

        {!showGame && !readyNotice && (
          <div
            className={`cold-start-card${
              coldStart && !isReady ? '' : ' cold-start-card--placeholder'
            }`}
          >
            <p className="cold-start-title">Cold start detected</p>
            <p className="cold-start-note">
              The server is on a free tier and may take up to a minute to boot.
              Want to play a quick game while we wait?
            </p>
            <button
              type="button"
              className="cold-start-button"
              onClick={onStartGame}
            >
              Play 2048
            </button>
          </div>
        )}

        {showGame && !readyNotice && (
          <div className="game-2048-wrap">
            <button type="button" className="game-skip" onClick={onSkipGame}>
              Skip game
            </button>
            <Game2048
              onScoreChange={onScoreChange}
              onGameOver={onGameOver}
              stopSignal={stopGameSignal}
            />
          </div>
        )}

        {readyNotice && (
          <div className="ready-card">
            <p className="ready-title">The website is ready to use.</p>
            {finalScore !== null && (
              <p className="ready-score">Your 2048 score: {finalScore}</p>
            )}
            <p className="ready-note">Redirecting you to the main page...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColdStartExperience;

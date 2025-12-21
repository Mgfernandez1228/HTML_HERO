import './GameOver.css';

export default function GameOver({ onRestart }) {
  return (
    <div className="gameover-overlay">
      <div className="gameover-box">
        <h1>GAME OVER</h1>
        <p>You ran out of hearts.</p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
}

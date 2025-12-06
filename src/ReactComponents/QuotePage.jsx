import { useState } from "react";

const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Creativity is intelligence having fun.",
  "Do what you can, with what you have, where you are.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Happiness is not something ready-made. It comes from your own actions."
];

export default function QuotePage() {
  const [quote, setQuote] = useState(quotes[0]);

  const generateQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>💡 Inspirational Quotes</h1>
      <div style={styles.card}>
        <p style={styles.quote}>"{quote}"</p>
        <button style={styles.button} onClick={generateQuote}>
          Generate New Quote
        </button>
      </div>
      <p style={styles.footer}>Powered by React</p>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",           // full viewport height
    margin: 0,                 // remove default margin
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #9b5de5, #f15bb5, #fee440)",
    color: "white",
    padding: "20px",
    boxSizing: "border-box",
    textAlign: "center"
  },
};


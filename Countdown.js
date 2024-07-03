export default function startCountdown(mins, secs) {
  setMin(mins);
  setSec(secs);

  const countdownInterval = setInterval(() => {
    secs--;

    if (secs < 0) {
      mins--;
      secs = 59;
    }

    setMin(mins);
    setSec(secs);

    if (mins === 0 && secs === 0) {
      clearInterval(countdownInterval);
      console.log("Countdown completed!");
    }
  }, 1000);
}

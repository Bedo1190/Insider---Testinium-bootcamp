    let countdown;
    let timeLeft = 0;

    function appendNumber(num) {
      const display = document.getElementById('inputDisplay');
      if (display.textContent === "0") {
        display.textContent = num.toString();
      } else {
        display.textContent += num.toString();
      }
    }

    function clearInput() {
      document.getElementById('inputDisplay').textContent = "0";
    }

    function backspace() {
      const display = document.getElementById('inputDisplay');
      let val = display.textContent;
      val = val.slice(0, -1);
      display.textContent = val.length > 0 ? val : "0";
    }

    function startCountdown() {
      timeLeft = parseInt(document.getElementById('inputDisplay').textContent);
      if (isNaN(timeLeft) || timeLeft <= 0) {
        alert("Geçerli bir süre girin.");
        return;
      }

      clearInterval(countdown);
      updateDisplay();

      countdown = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
          clearInterval(countdown);
          document.getElementById('countdownDisplay').textContent = "Süre doldu!";
        }
      }, 1000);
    }

    function resetCountdown() {
      clearInterval(countdown);
      timeLeft = 0;
      document.getElementById('countdownDisplay').textContent = "Süre: -";
      clearInput();
    }

    function updateDisplay() {
      document.getElementById('countdownDisplay').textContent = `Süre: ${timeLeft} saniye`;
    }

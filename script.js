    const questions = [
      { question: "A device used to transmit sound over long distances.", answer: "telephone" },
      { question: "A vehicle that flies in the sky.", answer: "airplane" },
      { question: "A machine that computes.", answer: "computer" },
      { question: "A large body of water.", answer: "ocean" },
      { question: "The opposite of cold.", answer: "hot" },
      { question: "The planet we live on.", answer: "earth" },
      { question: "An animal that barks.", answer: "dog" },
      { question: "A color of the sky.", answer: "blue" },
      { question: "A fruit that is yellow.", answer: "banana" },
      { question: "An item used to cut paper.", answer: "scissors" }
    ];

    let selectedPair;
    let remainingGuesses;
    let guessedLetters;

    function startGame() {
      selectedPair = questions[Math.floor(Math.random() * questions.length)];
      remainingGuesses = 6;
      guessedLetters = [];
      renderGame();
    }

    function renderGame() {
      document.body.innerHTML = `
        <div id="game-container">
          <canvas id="gallows" width="200" height="250"></canvas>
          <div id="question">Hint: ${selectedPair.question}</div>
          <div id="word">${getMaskedWord()}</div>
          <div id="keyboard">
            ${createKeyboard()}
          </div>
          <div id="status">Incorrect guesses: ${6 - remainingGuesses} / 6</div>
        </div>
      `;
      drawGallows();
    }

    function getMaskedWord() {
      return selectedPair.answer
        .split("")
        .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
    }

    function createKeyboard() {
      return "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .map(
          (letter) => `<button class="key ${
            guessedLetters.includes(letter) ? "disabled" : ""
          }" onclick="handleGuess('${letter}')">${letter}</button>`
        )
        .join("");
    }

    function handleGuess(letter) {
      if (guessedLetters.includes(letter) || remainingGuesses <= 0) return;

      guessedLetters.push(letter);
      if (!selectedPair.answer.includes(letter)) {
        remainingGuesses--;
      }

      if (remainingGuesses === 0 || !getMaskedWord().includes("_")) {
        endGame();
      } else {
        renderGame();
      }
    }

    function endGame() {
      const message = remainingGuesses > 0 ? "You won!" : "You lost!";
      const wordReveal = `The word was: ${selectedPair.answer}`;
      document.body.innerHTML += `
        <div id="modal">
          <div>${message}</div>
          <div>${wordReveal}</div>
          <button onclick="startGame()">Play Again</button>
        </div>
      `;
    }

    function drawGallows() {
      const canvas = document.getElementById("gallows");
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;

      // Draw gallows
      ctx.beginPath();
      ctx.moveTo(50, 220);
      ctx.lineTo(150, 220);
      ctx.moveTo(100, 220);
      ctx.lineTo(100, 20);
      ctx.lineTo(150, 20);
      ctx.lineTo(150, 50);
      ctx.stroke();

      // Draw body parts based on incorrect guesses
      if (remainingGuesses <= 5) ctx.arc(150, 70, 20, 0, Math.PI * 2); // Head
      if (remainingGuesses <= 4) ctx.moveTo(150, 90), ctx.lineTo(150, 150); // Body
      if (remainingGuesses <= 3) ctx.moveTo(150, 110), ctx.lineTo(120, 90); // Left arm
      if (remainingGuesses <= 2) ctx.moveTo(150, 110), ctx.lineTo(180, 90); // Right arm
      if (remainingGuesses <= 1) ctx.moveTo(150, 150), ctx.lineTo(120, 180); // Left leg
      if (remainingGuesses <= 0) ctx.moveTo(150, 150), ctx.lineTo(180, 180); // Right leg

      ctx.stroke();
    }

    startGame();

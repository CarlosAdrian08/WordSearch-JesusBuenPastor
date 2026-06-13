function checkAnswer(option, isCorrect) {
    const feedback = option.parentElement.nextElementSibling;

    if (isCorrect) {
        feedback.textContent = "¡Correcto! Jesús es el Buen Pastor que cuida de nosotros.";
        feedback.className = "feedback correct";
    } else {
        feedback.textContent = "Incorrecto. Intenta de nuevo.";
        feedback.className = "feedback incorrect";
    }

    feedback.style.display = 'block';
}

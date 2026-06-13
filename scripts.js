function validateSentences() {
    const sentence1 = document.getElementById('sentence1').value.trim().toUpperCase();
    const sentence2 = document.getElementById('sentence2').value.trim().toUpperCase();
    const sentence3 = document.getElementById('sentence3').value.trim().toUpperCase();
    const sentence4 = document.getElementById('sentence4').value.trim().toUpperCase();
    const sentence5 = document.getElementById('sentence5').value.trim().toUpperCase();
    const sentence6 = document.getElementById('sentence6').value.trim().toUpperCase();

    let correct = true;

    if (sentence1 !== "BUEN" || sentence2 !== "PASTOR") {
        correct = false;
        alert("Frase 1 incorrecta");
    }

    if (sentence3 !== "LLAMA") {
        correct = false;
        alert("Frase 2 incorrecta");
    }

    if (sentence4 !== "OYEN" || sentence5 !== "SIGUEN") {
        correct = false;
        alert("Frase 3 incorrecta");
    }

    if (sentence6 !== "VIDA") {
        correct = false;
        alert("Frase 4 incorrecta");
    }

    if (correct) {
        alert("¡Correcto! Todas las frases están bien.");
    }
}

let selectedLetters = [];
let foundWords = [];

function selectLetter(letterButton) {
    // Agregar letra seleccionada a la lista
    selectedLetters.push(letterButton.innerText);

    // Cambiar el color de fondo de la letra seleccionada
    letterButton.style.backgroundColor = "rgba(255, 255, 0, 0.5)"; // amarillo bajito

    // Comprobar si la palabra formada es correcta
    const word = selectedLetters.join('');
    const newFoundWords = checkWords(word);

    newFoundWords.forEach(word => {
        // Mostrar mensaje solo si la palabra no ha sido encontrada antes
        if (!foundWords.includes(word)) {
            alert("¡Palabra encontrada: " + word + "!");
            foundWords.push(word); // Agregar a las palabras ya encontradas
        }
    });

    // Verificar si se han encontrado todas las palabras
    if (foundWords.length === getTotalWords()) {
        alert("¡Has encontrado todas las palabras!");
    }
}

function checkWords(word) {
    const wordsToFind = ["BUEN", "LLAMA", "PASTOR", "OYEN", "SIGUEN", "VIDA"];
    return wordsToFind.filter(w => word.includes(w));
}

function getTotalWords() {
    return ["BUEN", "LLAMA", "PASTOR", "OYEN", "SIGUEN", "VIDA"].length;
}

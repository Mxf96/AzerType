document.addEventListener('DOMContentLoaded', function () {
    const motsRadio = document.getElementById('mots');
    const BtnDemarrer = document.getElementById('BtnDemarrer');
    const inputDisplay = document.querySelector('.input');
    const inputUser = document.querySelector('.input2');
    const ErrorMessage = document.getElementById('ErrorMessage');
    const TimerMessage = document.getElementById('TimerMessage')
    const scoreDisplay = document.querySelector('.score span');
    const timerDisplay = document.getElementById('Timer-Container');
    const expertModeRadio = document.getElementById('expert');
    let timer;
    let score = 0;
    let jeuActif = false;
    let mots = [];
    const phrases = ['Le chat dort sur le canapé', 'Il fait beau aujourd\'hui', 'La voiture est rouge'];

    function afficherNouveauContenu() {
        if (motsRadio.checked) {
            inputDisplay.value = mots[Math.floor(Math.random() * mots.length)];
        } else {
            inputDisplay.value = phrases[Math.floor(Math.random() * phrases.length)];
        }
        inputUser.value = '';
        cacherErrorMessage();
    }

    function afficherErrorMessage() {
        ErrorMessage.textContent = "Dommage !!! Vous avez fait une erreur. Votre score était de " + score + ". Veuillez relancer le jeu";
        ErrorMessage.style.display = "block";
        jeuActif = false;
        inputDisplay.value = '';
    }

    function cacherErrorMessage() {
        ErrorMessage.style.display = "none";
    }

    function verifierReponse() {
        if (jeuActif) {
            if (inputUser.value === inputDisplay.value) {
                score++;
                scoreDisplay.textContent = score;
                afficherNouveauContenu();
            } else if (!inputDisplay.value.startsWith(inputUser.value)) {
                afficherErrorMessage();
            }
        }
    }

    function chargerMots() {
        fetch('scripts/data.json')
            .then(response => response.json())
            .then(data => {
                mots = data;
                initGame();
            })
            .catch(error => console.error('Erreur lors du chargement du fichier JSON:', error));
    }

    function endGame() {
        jeuActif = false;
        inputUser.disabled = true; // Désactiver l'entrée utilisateur
        TimerMessage.textContent = "Temps écoulé ! Votre score est " + score + ". Veuillez relancer le jeu";
        TimerMessage.style.display = "block";
        inputDisplay.value = '';
    }
    
    function reinitialiserMessageMinuteur() {
        // Réinitialiser le message du minuteur
        TimerMessage.textContent = '';
        TimerMessage.style.display = 'none'; 
        // Réinitialiser le message d'erreur
        ErrorMessage.textContent = '';
        ErrorMessage.style.display = 'none';
    }

    document.querySelectorAll('input[name="optionSource"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleTimerDisplay();
            reinitialiserMessageMinuteur(); // Ajoutez cet appel ici
        });
    });

    function toggleTimerDisplay() {
        timerDisplay.style.display = expertModeRadio.checked ? "block" : "none";
    }

    function startTimer() {
        toggleTimerDisplay(); 
        if (expertModeRadio.checked) { // Démarrer le minuteur si le mode expert est sélectionné
            timeLeft = 10; // 10 secondes
            timer = setInterval(function () {
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endGame();
                } else {
                    timeLeft--;
                    document.getElementById('timer').textContent = timeLeft;
                }
            }, 1000);
        }
    }

    // Ajout d'un écouteur d'événement pour les boutons radio
    document.querySelectorAll('input[name="optionSource"]').forEach(radio => {
        radio.addEventListener('change', toggleTimerDisplay);
    });

    // Appeler toggleTimerDisplay au chargement pour masquer le minuteur
    toggleTimerDisplay();

    function initGame() {
        BtnDemarrer.addEventListener('click', function () {
            afficherNouveauContenu();
            jeuActif = true;
            score = 0;
            scoreDisplay.textContent = score;
            cacherErrorMessage();
            startTimer(); // Appel de startTimer dans initGame
            inputUser.disabled = false;
        });

        inputUser.addEventListener('input', verifierReponse);
    }
    chargerMots();
});
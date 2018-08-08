'use strict';
(function () {

    var buttonRock = document.getElementById('rock');
    var buttonPaper = document.getElementById('paper');
    var buttonScissors = document.getElementById('scissors');
    var output = document.getElementById('output');
    var result = document.getElementById('result');
    var playerWins = 0;
    var computerWins = 0;
    var buttonNewGame = document.getElementById('new-game');
    var roundsCounter = document.getElementById('rounds-counter');
    var roundsNumber = 3;
    var endGame = true;

    // Funkcja, która wyświetla tekst na stronie, odpowiednio dodając nową linię.
    var log = function (output, text) {
        output.innerHTML = output.innerHTML + text + '<br>';
    };
    // Funkcja, która kasuje wyświetlony dotychczas tekst
    var logDelete = function (output) {
        output.innerHTML = '';
    };

    //Funkcja, która losuje liczbę z zakresu 1-3 i przypisuje jej nazwę ruchu
    var getGestureComputer = function () {
        var moves = ['rock', 'paper', 'scissors'];
        return moves[Math.floor(Math.random() * 3)];
    }

    var playerMove = function (gesturePlayer) {
        logDelete(output);
        log(output, 'You played: ' + gesturePlayer);

        var gestureComputer = getGestureComputer();
        log(output, 'Computer played: ' + gestureComputer);

        if (gesturePlayer == gestureComputer) {
            log(output, 'Tie');
        } else if ((gesturePlayer == 'paper' && gestureComputer == 'rock') || (gesturePlayer == 'rock' && gestureComputer == 'scissors') || (gesturePlayer == 'scissors' && gestureComputer == 'paper')) {
            log(output, ' Player wins!');
            playerWins++;
        } else {
            log(output, ' Computer wins');
            computerWins++;
        }
        logDelete(result);
        log(result, playerWins + ' - ' + computerWins);

        if (playerWins == roundsNumber) {
            endGame = true;
            log(output, 'YOU WON THE ENTIRE GAME!!!');
        } else if (computerWins == roundsNumber) {
            endGame = true;
            log(output, 'YOU LOST THE ENTIRE GAME :(');
        } else {}
    };

    var pressButton = function (move, event) {  
        if (endGame == true) {
            event.stopPropagation();
            logDelete(output);
            log(output, 'Please press the new game button!');
        } else {
            playerMove(move);
        }
    };

    buttonRock.addEventListener('click', function (event) {
        pressButton('rock', event);
    });

    buttonPaper.addEventListener('click', function (event) {
        pressButton('paper', event);
    });
    
    buttonScissors.addEventListener('click', function (event) {
        pressButton('scissors', event);
    });

    buttonNewGame.addEventListener('click', function () {
        // kasuje dotychczas wyswietlone informacje, zeruje zmienne
        logDelete(output);
        logDelete(result);
        logDelete(roundsCounter);
        roundsNumber = 0;
        playerWins = 0;
        computerWins = 0;
        endGame = true;

        roundsNumber = window.prompt('How many wins should end the game?', '3');

        if (roundsNumber != null) {
            if (roundsNumber == '') {
                log(output, 'Please enter the number!');
            } else if (isNaN(roundsNumber)) {
                log(output, 'It is not a number!');
            } else if (roundsNumber == 0) {
                log(output, 'Please enter a number greater than 0');
            } else {
                log(roundsCounter, roundsNumber + ' wins end the game');
                endGame = false;
            }
        } else if (roundsNumber === null) {
            log(output, 'You clicked cancel');
        }
    });

})();
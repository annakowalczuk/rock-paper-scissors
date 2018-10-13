'use strict';
(function () {

    var output = document.getElementById('output');
    var result = document.getElementById('result');
    var buttonNewGame = document.getElementById('new-game');
    var roundsCounter = document.getElementById('rounds-counter');
    var params = {
        playerWins: 0,
        computerWins: 0,
        roundsNumber: 3,
        endGame: true,
        roundScore: '0-0',
        progress: [
            //     {
            //     roundNumber: 0,
            //     player: 'rock',
            //     computer: 'paper',
            //     roundScore: '0-1',
            //     gameScore: []
            // }
        ],
    };
    var ind = 0;

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
    };

    // Funkcja, która wyswietla w modalu tabele z przebiegiem gry 
    var tableCreate = function () {
        var table = document.getElementById('progressTable');
        var row = table.insertRow(0);
        row.insertCell(0).innerHTML = 'Round number';
        row.insertCell(1).innerHTML = 'Player move';
        row.insertCell(2).innerHTML = 'Computer move';
        row.insertCell(3).innerHTML = 'Round score';
        row.insertCell(4).innerHTML = 'Game score';

        params.progress.forEach(function (item, index) {
            row = table.insertRow(index + 1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            cell1.innerHTML = params.progress[index].roundNumber;
            cell2.innerHTML = params.progress[index].player;
            cell3.innerHTML = params.progress[index].computer;
            cell4.innerHTML = params.progress[index].roundScore;
            cell5.innerHTML = params.progress[index].gameScore.join('');
        });
    };

    // Kasowanie tabeli z przebiegiem gry
    var tableDelete = function () {
        var table = document.getElementById('progressTable');
        if (table != null) {
            table.remove(table);
        } else {}
    };

    // dezaktywacja buttonów
    var disableButtons = function(){
        document.querySelectorAll('.player-move').forEach(function (item) {
            item.disabled = true;
        });
    };
    // aktywacja buttonów
    var enableButtons = function(){
        document.querySelectorAll('.player-move').forEach(function (item) {
            item.disabled = false;
        });
    };

    var playerMove = function (gesturePlayer) {
        // ruch zawodnika
        logDelete(output);
        log(output, 'You played: ' + gesturePlayer);

        // ruch komputera
        var gestureComputer = getGestureComputer();
        log(output, 'Computer played: ' + gestureComputer);

        // ustalenie wyniku rozgrywki
        if (gesturePlayer == gestureComputer) {
            log(output, 'Tie');
            params.roundScore = '0-0';
        } else if ((gesturePlayer == 'paper' && gestureComputer == 'rock') || (gesturePlayer == 'rock' && gestureComputer == 'scissors') || (gesturePlayer == 'scissors' && gestureComputer == 'paper')) {
            log(output, ' Player wins!');
            params.roundScore = '1-0';
            params.playerWins++;
        } else {
            log(output, ' Computer wins');
            params.roundScore = '0-1';
            params.computerWins++;
        }

        logDelete(result);
        log(result, params.playerWins + ' - ' + params.computerWins);

        // zapisanie postepu gry
        params.progress.push({
            roundNumber: ind + 1,
            player: gesturePlayer,
            computer: gestureComputer,
            roundScore: params.roundScore,
            gameScore: new Array(params.playerWins, '-', params.computerWins)
        });
        console.log(params.progress);

        // Sprawdzenie czy gra się skonczyla, jeśli tak, to wyswietl modal i zablokuj przyciski
        if (params.playerWins == params.roundsNumber) {
            params.endGame = true;
            showModal('#modal-won', event);
            disableButtons();
           } else if (params.computerWins == params.roundsNumber) {
            params.endGame = true;
            showModal('#modal-lost', event);
            disableButtons();
        }

        ind++;
    };

    var pressButton = function (move, event) {
        if (params.endGame == true) {
            event.stopPropagation();
            logDelete(output);
            log(output, 'Please press the new game button!');
        } else {
            playerMove(move);
        }
    };

    document.querySelectorAll('.player-move').forEach(function (item) {
        item.addEventListener('click', function (event) {
            pressButton(item.getAttribute('data-move'), event);
        });
    });


    buttonNewGame.addEventListener('click', function () {
        // kasuje dotychczas wyswietlone informacje, zeruje zmienne
        logDelete(output);
        logDelete(result);
        logDelete(roundsCounter);
        params.roundsNumber = 0;
        params.playerWins = 0;
        params.computerWins = 0;
        params.endGame = true;
        params.progress = [];
        ind = 0;
        params.roundsNumber = window.prompt('How many wins should end the game?', '3');
        
        if (params.roundsNumber != null) {
            if (params.roundsNumber == '') {
                log(output, 'Please enter the number!');
            } else if (isNaN(params.roundsNumber)) {
                log(output, 'It is not a number!');
            } else if (params.roundsNumber == 0) {
                log(output, 'Please enter a number greater than 0');
            } else {
                log(roundsCounter, params.roundsNumber + ' wins end the game');
                params.endGame = false;
                // odblokuj przyciski
                enableButtons();
            }
        } else if (params.roundsNumber === null) {
            log(output, 'You clicked cancel');
        }
    });

    // MODAL
    var showModal = function (attribute, event) {
        event.preventDefault();
        tableDelete();

        var content = document.getElementById('modal-content');
        if (content != null) {
            // content.remove(content);
            content.innerHTML = '';
        }

        document.querySelectorAll('.modal').forEach(function (currentValue) {
            currentValue.classList.remove('show');
        });
        document.querySelector('.modal').classList.add('show');
        document.querySelector('#modal-overlay').classList.add('show');

        
        // stworzenie tabeli w ktorej beda wyniki
        var table = document.createElement('table');
        table.id = 'progressTable';
        document.querySelector('#modal-one').appendChild(table);
        tableCreate();
        // wyswietlenie informacji o wyniku rozgrywki
        // jezeli wygrana gracza pokaz komunikat YOU WON THE ENTIRE GAME!!!, jeśli przegrana to YOU LOST THE ENTIRE GAME :(
        content = document.createElement('div');
        document.querySelector('#modal-content').appendChild(content);
        if (attribute == '#modal-won') {
            content.innerHTML = 'YOU WON THE ENTIRE GAME!!!';
        } else if (attribute == '#modal-lost') {
            content.innerHTML = 'YOU LOST THE ENTIRE GAME:(';
        }
    };

    // Mimo, że obecnie mamy tylko jeden link, stosujemy kod dla wielu linków. W ten sposób nie będzie trzeba go zmieniać, kiedy zechcemy mieć więcej linków lub guzików otwierających modale

    document.querySelectorAll('.show-modal').forEach(function (item) {
        item.addEventListener('click', function (event) {
            showModal(item.getAttribute('href'), event);
        });

    });


    // Dodajemy też funkcję zamykającą modal, oraz przywiązujemy ją do kliknięć na elemencie z klasą "close". 

    var hideModal = function (event) {
        event.preventDefault();
        document.querySelector('#modal-overlay').classList.remove('show');
    };

    var closeButtons = document.querySelectorAll('.modal .close');

    for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', hideModal);
    }

    // Dobrą praktyką jest również umożliwianie zamykania modala poprzez kliknięcie w overlay. 

    document.querySelector('#modal-overlay').addEventListener('click', hideModal);

    // Musimy jednak pamiętać, aby zablokować propagację kliknięć z samego modala - inaczej każde kliknięcie wewnątrz modala również zamykałoby go. 

    var modals = document.querySelectorAll('.modal');

    for (var i = 0; i < modals.length; i++) {
        modals[i].addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

})();
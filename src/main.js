import {mainField} from "./mainFields.js";
import {figures} from "./figures.js";
import * as utils from "./utils.js";
import {Key} from "./enums.js";
import {L, I, L_i, T, Z_i, Z, O} from "./figures.js";


export let startCell = 4;
let figure, interval, number = 0, timeout = 800, leftSideChecker = false, previousNumber = 0, rightSideChecker = false,
    footerChecker = false, figureSubViewsName, counter = 0;


function paintField() {
    for (let i = 0; i < mainField.length; i++) {
        for (let j = 0; j < mainField[i].length; j++) {
            let element = document.createElement('div');
            element.id = 'figure' + [i] + [j];
            element.className = 'figure';
            if (mainField[i][j] === 1) {
                element.style.backgroundColor = 'red';
            }
            document.getElementById('window').appendChild(element);
        }
    }
    move();
}

paintField();


function birthElement() {
    let i = utils.randomElement();
    Object.keys(figures[i]).forEach(v => {
        figure = figures[i][v];
        figureSubViewsName = v;
    })
}


function move(birth = true) {
    if (birth) {
        birthElement();
        keyListeners();
    }
    interval = setInterval(function () {
        previousNumber = number++;
        let endGame = false;
        if (previousNumber + figure.length > mainField.length || footerChecker) {
            let count = 0;
            startCell = 4;
            mainField.forEach((t, i) => t.forEach((v, j) => {
                if (mainField[i][j] == 1) mainField[i][j] = 2;
                if (mainField[i][j] == 2) ++count;
                if (j == mainField[i].length - 1) {
                    if (count == mainField[i].length) {
                        mainField.splice(i, 1);
                        mainField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                        mainField.forEach((t, i) => t.forEach((v, j) => {
                            if (document.getElementById('figure' + [i] + [j]) && mainField[i][j] == 2)
                                document.getElementById('figure' + [i] + [j]).style.backgroundColor = 'blue';
                            else if (document.getElementById('figure' + [i] + [j]) && mainField[i][j] == 0)
                                document.getElementById('figure' + [i] + [j]).style.backgroundColor = 'gainsboro';
                        }));
                    }
                    count = 0;
                }
            }));
            number = previousNumber = 0;
            footerChecker = false;
            counter = 0;
            birthElement();
            let x = 0;
            for (let y = 0; y < figure.length; y++) {
                for (let j = startCell; j < startCell + figure[y].length; j++) {
                    if (mainField[y][j] == 2 && figure[y][x] == 1) {
                        clearInterval(interval);
                        endGame = true;
                        document.removeEventListener('keydown', keyDownListener);
                        document.removeEventListener('keyup', keyUpListener);
                        break;
                    }
                }
            }
        }

        if (!endGame) {
            clearPreviousCells(figure, previousNumber, startCell, true);
            assignToMainField(figure, previousNumber, startCell);
        }
    }, timeout);
}


function assignToMainField(figure, y, x) {
    let startX = x;
    let leftCount = 0, rightCount = 0, footerCount = 0;
    for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
            if (mainField[y][x] != 2) mainField[y][x] = figure[i][j];
            if (document.getElementById('figure' + [y] + [x]) && mainField[y][x] == 1)
                document.getElementById('figure' + [y] + [x]).style.backgroundColor = 'blue';

            if (y + 1 < mainField.length && mainField[y + 1][x] == 2 && mainField[y][x] == 1)
                footerChecker = true;
            else if (y + 1 < mainField.length && mainField[y + 1][x] != 2)
                footerCount++;

            if (startX + figure[i].length <= mainField[i].length && mainField[y][startX + figure[i].length] == 2
                && mainField[y][startX + figure[i].length - 1] == 1) {
                rightSideChecker = true;
            } else if (startX + figure[i].length <= mainField[i].length
                && (mainField[y][startX + figure[i].length] != 2 && mainField[y][startX + figure[i].length - 1] == 0
                    || mainField[y][startX + figure[i].length] == 2 && mainField[y][startX + figure[i].length - 1] == 0
                    || mainField[y][startX + figure[i].length] != 2 && mainField[y][startX + figure[i].length - 1] == 1)) {
                rightCount++;
            }
            if (startX - 1 >= 0 && mainField[y][startX - 1] == 2 && mainField[y][startX] == 1) {
                leftSideChecker = true;
            } else if (startX - 1 >= 0 && mainField[y][startX - 1] != 2 && mainField[y][startX] == 0
                || startX - 1 >= 0 && mainField[y][startX - 1] == 2 && mainField[y][startX] == 0
                || startX - 1 >= 0 && mainField[y][startX - 1] != 2 && mainField[y][startX] == 1) {
                leftCount++
            }
            x++;
        }
        x = startX;
        y++;
    }
    if (leftCount == figure.length * figure[0].length) leftSideChecker = false;
    if (rightCount == figure.length * figure[0].length) rightSideChecker = false;
    if (footerCount == figure.length * figure[0].length) footerChecker = false;
}


function clearPreviousCells(figure, previousY, previousX, fromSetInterval) {
    if (fromSetInterval && previousY > 0) --previousY;
    let startX = previousX;
    for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
            if (mainField[previousY][previousX] == 1)
                mainField[previousY][previousX] = 0;
            if (document.getElementById('figure' + [previousY] + [previousX]) && mainField[previousY][previousX] == 0)
                document.getElementById('figure' + [previousY] + [previousX]).style.backgroundColor = 'gainsboro';

            previousX++;
        }
        previousX = startX;
        previousY++;
    }
}


function keyListeners() {
    document.addEventListener('keydown', keyDownListener);
    document.addEventListener('keyup', keyUpListener);
}

function keyDownListener(ev) {
    switch (ev.code) {
        case Key.LEFT:
            if (startCell > 0 && !leftSideChecker) {
                clearPreviousCells(figure, previousNumber, startCell, false);
                startCell -= 1;
                assignToMainField(figure, previousNumber, startCell)
            }
            break;
        case Key.RIGHT:
            if (startCell < mainField[0].length - figure[0].length && !rightSideChecker) {
                clearPreviousCells(figure, previousNumber, startCell, false);
                startCell += 1;
                assignToMainField(figure, previousNumber, startCell)
            }
            break;
        case Key.DOWN:
            timeout = 30;
            clearInterval(interval);
            move(false);
            break;
        case Key.UP:
            turn();
            break;
    }
}

function keyUpListener(ev) {
    switch (ev.code) {
        case Key.DOWN:
            timeout = 800;
            clearInterval(interval);
            move(false);
            break;
    }
}

function turn() {
    let size = 0, figureSubViews;
    switch (figureSubViewsName) {
        case 'L':
            figureSubViews = L;
            size = L.length;
            break;
        case 'L_i':
            figureSubViews = L_i;
            size = L_i.length;
            break;
        case 'I':
            figureSubViews = I;
            size = I.length;
            break;
        case 'T':
            figureSubViews = T;
            size = T.length;
            break;
        case 'Z_i':
            figureSubViews = Z_i;
            size = Z_i.length;
            break;
        case 'Z':
            figureSubViews = Z;
            size = Z.length;
            break;
        case 'O':
            figureSubViews = O;
            size = O.length;
            break;
    }
    let previousFigure = figure;
    figure = figureSubViews[counter];
    if (counter >= size - 1) counter = 0;
    else counter++;
    clearPreviousCells(previousFigure, previousNumber, startCell, false);
    if (startCell + figure[0].length > mainField[0].length) {
        startCell = mainField[0].length - figure[0].length;
    } else if (previousNumber + figure.length > mainField.length) {
        previousNumber = mainField.length - figure.length;
        number = mainField.length - figure.length
    }
    assignToMainField(figure, previousNumber, startCell);
}

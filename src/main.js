import {mainField} from "./mainFields.js";
import {figures} from "./figures.js";
import * as utils from "./utils.js";
import {Key} from "./enums.js";
import {L, I, L_i, T, Z_i, Z, O} from "./figures.js";


export let currentX = 4;
let figure, interval, futureY = 0, timeout = 500, leftSideChecker = false, currentY = 0, rightSideChecker = false,
    footerChecker = false, figureSubViewsName, view = 0, figureSubViews, score = 0, scoreStep = 0, newStep = false, changeTimeout = 500;


function paintField() {
    for (let i = 0; i < mainField.length; i++) {
        for (let j = 0; j < mainField[i].length; j++) {
            let element = document.createElement('div');
            element.id = 'figure' + [i] + [j];
            element.className = 'figure';
            if (mainField[i][j] === 1) {
                element.style.backgroundColor = 'red';
            }
            document.getElementById('game-filed').appendChild(element);
            document.getElementById('game-score').innerText = '0';
            document.getElementById('game-step').innerText = '0';
        }
    }
    move();
    keyListeners();
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
    }
    interval = setInterval(function () {
        if (scoreStep == 2 && !newStep) {
            changeTimeout = timeout = 400;
            newStep = true;
            clearInterval(interval);
            move(birth);
        } else if (scoreStep == 60 && !newStep) {
            changeTimeout = timeout = 250;
            newStep = true;
            clearInterval(interval);
            move(birth);
        } else if (scoreStep == 90 && !newStep) {
            changeTimeout = timeout = 150;
            newStep = true;
            clearInterval(interval);
            move(birth);
        }
        currentY = futureY++;
        let endGame = false;
        for (let i = 0; i < figure.length; i++) {
            for (let j = 0; j < figure[i].length; j++) {
                if (currentY + i < mainField.length && currentX + j < mainField.length) {
                    if (figure[i][j] == 1 && mainField[currentY + i][currentX + j] == 2) {
                        footerChecker = true;
                        break;
                    }
                }
            }
        }
        if (currentY + figure.length > mainField.length || footerChecker) {
            let count = 0, scoreCount = 0;
            currentX = 4;
            mainField.forEach((t, i) => t.forEach((v, j) => {
                if (mainField[i][j] == 1) mainField[i][j] = 2;
                if (mainField[i][j] == 2) ++count;
                if (j == mainField[i].length - 1) {
                    if (count == mainField[i].length) {
                        scoreCount++;
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
            if (scoreCount == 4) score += 4000;
            else if (scoreCount == 3) score +=2000;
            else if (scoreCount == 2) score += 1000;
            else if (scoreCount == 1) score += 500;
            if (scoreCount) {
                scoreStep++;
                newStep = false;
            }
            document.getElementById('game-score').innerText = score.toString();
            document.getElementById('game-step').innerText = scoreStep.toString();
            scoreCount = 0;
            futureY = currentY = 0;
            footerChecker = false;
            view = 0;
            birthElement();
            let x = 0;
            for (let y = 0; y < figure.length; y++) {
                for (let j = currentX; j < currentX + figure[y].length; j++) {
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
            clearPreviousCells(figure, currentY, currentX, true);
            assignToMainField(figure, currentY, currentX);
        }
    }, timeout);
}


function assignToMainField(figure, y, x) {
    let startX = x;
    let leftCount = 0, rightCount = 0;
    for (let i = 0; i < figure.length; i++) {
        for (let j = 0; j < figure[i].length; j++) {
            if (mainField[y][x] != 2) mainField[y][x] = figure[i][j];
            if (document.getElementById('figure' + [y] + [x]) && mainField[y][x] == 1)
                document.getElementById('figure' + [y] + [x]).style.backgroundColor = 'blue';

            if (startX + figure[i].length <= mainField[i].length && mainField[y][x + 1] == 2 && mainField[y][x] == 1) {
                rightSideChecker = true;
            } else {
                rightCount++;
            }
            if (startX - 1 >= 0 && mainField[y][x - 1] == 2 && mainField[y][x] == 1) {
                leftSideChecker = true;
            } else {
                leftCount++
            }
            x++;
        }
        x = startX;
        y++;
    }
    if (leftCount == figure.length * figure[0].length) leftSideChecker = false;
    if (rightCount == figure.length * figure[0].length) rightSideChecker = false;
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
            if (currentX > 0 && !leftSideChecker) {
                clearPreviousCells(figure, currentY, currentX, false);
                currentX -= 1;
                assignToMainField(figure, currentY, currentX)
            }
            break;
        case Key.RIGHT:
            if (currentX < mainField[0].length - figure[0].length && !rightSideChecker) {
                clearPreviousCells(figure, currentY, currentX, false);
                currentX += 1;
                assignToMainField(figure, currentY, currentX)
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
            timeout = changeTimeout;
            clearInterval(interval);
            move(false);
            break;
    }
}

function turn() {
    let size = 0, prohibited = false, minusX = 0, minusY = 0, count = 0, check = false;
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
    for (let y = 0; y < figureSubViews[view].length; y++) {
        if (check) break;
        for (let x = 0; x < figureSubViews[view][y].length; x++) {
            if (figureSubViews != I) {
                if (currentX + figureSubViews[view][0].length - 1 >= mainField[y].length) {
                    if (mainField[currentY + y][currentX - 1] == 0 && figureSubViews[view][y][0] == 1) {
                        minusX = 1;
                    } else if (mainField[currentY + y][currentX - 1] == 2 && figureSubViews[view][y][0] == 1) {
                        prohibited = true;
                        break
                    }
                } else if (currentY + figureSubViews[view].length - 1 >= mainField.length) {
                    if (mainField[currentY - 1][currentX + x] == 0 && figureSubViews[view][0][x] == 1) {
                        minusY = 1;
                    } else if (mainField[currentY - 1][currentX + x] == 2 && figureSubViews[view][0][x] == 1) {
                        prohibited = true;
                        break
                    }
                } else if (figureSubViews[view][y][x] == 1 && mainField[currentY + y][currentX + x] == 2) {
                    if (figureSubViews[view].length == 2) {
                        for (let i = 0; i < figureSubViews[view].length; i++) {
                            if (mainField[currentY + i][currentX - 1] == 0 && figureSubViews[view][i][0] == 1) {
                                minusX = 1;
                            } else if (currentX - 1 < 0 || mainField[currentY + i][currentX - 1] == 2 && figureSubViews[view][i][0] == 1) {
                                prohibited = true;
                                break
                            }
                        }
                    } else if (figureSubViews[view].length == 3) {
                        for (let i = 0; i < figureSubViews[view].length; i++) {
                            if (mainField[currentY - 1][currentX + i] == 0 && figureSubViews[view][0][i] == 1) {
                                minusY = 1;
                            } else if (mainField[currentY - 1][currentX + i] == 2 && figureSubViews[view][0][i] == 1
                                || mainField[currentY + 1][currentX] == 2 && figureSubViews[view][figureSubViews[view].length - 1][0] == 1) {
                                prohibited = true;
                                break
                            }
                        }
                    }
                }
            } else if (figureSubViews == I) {
                if (figureSubViews[view].length == 1) {
                    if (currentX + x >= mainField[y].length || mainField[currentY][currentX+x] == 2) {
                        for (let i = figureSubViews[view][y].length - x; i > 0 ; i--) {
                            if (mainField[currentY][currentX - i] == 0) {
                                minusX = figureSubViews[view][y].length - x;
                            } else {
                                prohibited = true;
                                break
                            }
                        }
                        break
                    }
                } else if (figureSubViews[view].length == 4) {
                    if (currentY + y >= mainField.length || mainField[currentY+y][currentX] == 2) {
                        for (let i = figureSubViews[view].length - y; i > 0 ; i--) {
                            if (mainField[currentY-i][currentX] == 0) {
                                minusY = figureSubViews[view].length - y;
                                check = true;
                            } else {
                                prohibited = true;
                                break
                            }
                        }
                    }
                }
            }
        }
    }
    if (!prohibited) {
        let previousFigure = figure;
        figure = figureSubViews[view];
        view = view >= size - 1 ? 0 : view + 1;
        clearPreviousCells(previousFigure, currentY, currentX, false);
        if (minusX) currentX -= minusX;
        else if (minusY) futureY = currentY -= minusY;
        assignToMainField(figure, currentY, currentX);
    }
}

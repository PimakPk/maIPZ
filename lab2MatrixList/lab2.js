class MatrixNode {
    constructor(value, row, col) {
        this.value = value; // Значение элемента
        this.row = row;     // Номер строки
        this.col = col;     // Номер столбца
        this.nextRow = null; // Следующий элемент в строке
        this.nextCol = null; // Следующий элемент в столбце
    }
}

class SparseMatrix {
    constructor(rows, cols) {
        this.rows = rows; // Количество строк
        this.cols = cols; // Количество столбцов
        this.rowHeaders = Array(rows).fill(null); // Указатели на начало каждой строки
        this.colHeaders = Array(cols).fill(null); // Указатели на начало каждого столбца
    }

    // Метод добавления элемента в матрицу
    addElement(value, row, col) {
        if (value === 0) return; // Пропускаем нулевые элементы

        const newNode = new MatrixNode(value, row, col);

        // Вставляем в строку
        if (!this.rowHeaders[row] || this.rowHeaders[row].col > col) {
            newNode.nextRow = this.rowHeaders[row];
            this.rowHeaders[row] = newNode;
        } else {
            let current = this.rowHeaders[row];
            while (current.nextRow && current.nextRow.col < col) {
                current = current.nextRow;
            }
            newNode.nextRow = current.nextRow;
            current.nextRow = newNode;
        }

        // Вставляем в столбец
        if (!this.colHeaders[col] || this.colHeaders[col].row > row) {
            newNode.nextCol = this.colHeaders[col];
            this.colHeaders[col] = newNode;
        } else {
            let current = this.colHeaders[col];
            while (current.nextCol && current.nextCol.row < row) {
                current = current.nextCol;
            }
            newNode.nextCol = current.nextCol;
            current.nextCol = newNode;
        }
    }

    // Метод отображения матрицы
    display() {
        console.log("Матрица:");
        for (let i = 0; i < this.rows; i++) {
            let row = Array(this.cols).fill(0);
            let current = this.rowHeaders[i];
            while (current) {
                row[current.col] = current.value;
                current = current.nextRow;
            }
            console.log(row.join(" "));
        }
    }

    // Умножение матрицы на число
    multiplyByNumber(number) {
        for (let i = 0; i < this.rows; i++) {
            let current = this.rowHeaders[i];
            while (current) {
                current.value *= number;
                current = current.nextRow;
            }
        }
    }

    // Транспонирование матрицы
    transpose() {
        const transposed = new SparseMatrix(this.cols, this.rows);

        for (let i = 0; i < this.rows; i++) {
            let current = this.rowHeaders[i];
            while (current) {
                transposed.addElement(current.value, current.col, current.row);
                current = current.nextRow;
            }
        }

        return transposed;
    }

    // Сложение двух матриц
    static addMatrices(matrixA, matrixB) {
        if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) {
            throw new Error("Матрицы должны быть одинакового размера для сложения.");
        }

        const result = new SparseMatrix(matrixA.rows, matrixA.cols);

        for (let i = 0; i < matrixA.rows; i++) {
            let currentA = matrixA.rowHeaders[i];
            let currentB = matrixB.rowHeaders[i];

            while (currentA || currentB) {
                if (currentA && (!currentB || currentA.col < currentB.col)) {
                    result.addElement(currentA.value, currentA.row, currentA.col);
                    currentA = currentA.nextRow;
                } else if (currentB && (!currentA || currentB.col < currentA.col)) {
                    result.addElement(currentB.value, currentB.row, currentB.col);
                    currentB = currentB.nextRow;
                } else {
                    const sum = currentA.value + currentB.value;
                    if (sum !== 0) {
                        result.addElement(sum, currentA.row, currentA.col);
                    }
                    currentA = currentA.nextRow;
                    currentB = currentB.nextRow;
                }
            }
        }

        return result;
    }
}




const matrix = new SparseMatrix(4, 4);

// Добавляем элементы
matrix.addElement(5, 0, 1);
matrix.addElement(3, 2, 3);
matrix.addElement(7, 1, 2);

console.log("Исходная матрица:");
matrix.display();

// Умножение на число
matrix.multiplyByNumber(2);
console.log("После умножения на 2:");
matrix.display();

// Транспонирование
const transposed = matrix.transpose();
console.log("Транспонированная матрица:");
transposed.display();

// Сложение двух матриц
const matrixB = new SparseMatrix(4, 4);
matrixB.addElement(1, 0, 1);
matrixB.addElement(2, 1, 2);

const result = SparseMatrix.addMatrices(matrix, matrixB);
console.log("Результат сложения двух матриц:");
result.display();

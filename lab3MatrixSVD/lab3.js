const { Matrix, SingularValueDecomposition } = require('ml-matrix');

// Функция для ввода матрицы
async function inputMatrix() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const ask = (query) =>
        new Promise((resolve) => readline.question(query, resolve));

    const rows = parseInt(await ask("Введите количество строк матрицы: "));
    const cols = parseInt(await ask("Введите количество столбцов матрицы: "));

    console.log("Введите элементы матрицы построчно через пробел:");
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = (await ask(`Строка ${i + 1}: `))
            .trim()
            .split(" ")
            .map(Number);
        matrix.push(row);
    }

    readline.close();
    return new Matrix(matrix);
}

// SVD-разложение
function svdDecompose(matrix) {
    const svd = new SingularValueDecomposition(matrix);
    return {
        U: svd.leftSingularVectors,
        S: svd.diagonalMatrix,
        V: svd.rightSingularVectors,
    };
}

// Функция для обрезки сингулярных чисел
function truncateSVD(U, S, V, k) {
    const truncatedS = S.clone();
    for (let i = k; i < S.rows; i++) {
        truncatedS.set(i, i, 0);
    }
    return U.mmul(truncatedS).mmul(V.transpose());
}

// Основная программа
(async function main() {
    try {
        // Ввод исходной матрицы
        const matrix = await inputMatrix();
        console.log("\nИсходная матрица:");
        console.log(matrix.toString());

        // Выполнение SVD
        const { U, S, V } = svdDecompose(matrix);
        console.log("\nМатрица U:");
        console.log(U.toString());
        console.log("\nМатрица S (диагональная):");
        console.log(S.toString());
        console.log("\nМатрица V:");
        console.log(V.toString());

        // Пользователь выбирает количество оставляемых сингулярных чисел
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.question(
            "\nВведите количество оставляемых сингулярных чисел: ",
            (k) => {
                k = parseInt(k);
                const compressedMatrix = truncateSVD(U, S, V, k);
                console.log("\nСжатая матрица:");
                console.log(compressedMatrix.toString());
                readline.close();
            }
        );
    } catch (error) {
        console.error("Произошла ошибка:", error.message);
    }
})();

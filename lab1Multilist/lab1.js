class MultiNode {
    constructor(value) {
        this.value = value; // Значення елемента
        this.next = null;   // Вказівник на наступний елемент
        this.child = null;  // Вказівник на вкладений рівень
    }
}

function addElement(head, value) {
    if (!head) {
        return new MultiNode(value);
    }
    let temp = head;
    while (temp.next) {
        temp = temp.next;
    }
    temp.next = new MultiNode(value);
    return head;
}

function deleteElement(head, value) {
    if (!head) return null;

    if (head.value === value) {
        return head.next;
    }

    let current = head;
    while (current.next && current.next.value !== value) {
        current = current.next;
    }

    if (current.next) {
        current.next = current.next.next;
    }

    return head;
}

function deleteLevel(head) {
    if (!head) return null;

    while (head) {
        if (head.child) {
            head.child = deleteLevel(head.child);
        }
        head = head.next;
    }
    return null;
}

function copyList(head) {
    if (!head) return null;

    const newHead = new MultiNode(head.value);
    newHead.next = copyList(head.next);
    newHead.child = copyList(head.child);

    return newHead;
}

function clearList(head) {
    while (head) {
        if (head.child) {
            clearList(head.child);
        }
        head = head.next;
    }
    return null;
}

function printList(head, level = 0) {
    if (!head) return;

    let indent = "  ".repeat(level); // Відступ для візуалізації вкладеності
    let current = head;

    while (current) {
        console.log(`${indent}- ${current.value}`);
        if (current.child) {
            printList(current.child, level + 1); // Рекурсивний виклик для вкладеного рівня
        }
        current = current.next;
    }
}

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function menu() {
    console.log("\nМеню:");
    console.log("1. Додати елемент");
    console.log("2. Видалити елемент");
    console.log("3. Видалити рівень");
    console.log("4. Створити копію списку");
    console.log("5. Очистити список");
    console.log("6. Вихід");
    console.log("7. Показати список");

    rl.question("Оберіть опцію: ", (choice) => {
        switch (choice) {
            case "1":
                rl.question("Введіть значення: ", (value) => {
                    head = addElement(head, parseInt(value));
                    console.log("Елемент додано.");
                    menu();
                });
                break;
            case "2":
                rl.question("Введіть значення для видалення: ", (value) => {
                    head = deleteElement(head, parseInt(value));
                    console.log("Елемент видалено.");
                    menu();
                });
                break;
            case "3":
                console.log("Потрібно визначити рівень для видалення. Дотримуйтесь інструкцій.");
                let temp = head;

                function navigateToLevel(callback) {
                    rl.question("Наступний елемент? (так, ні): ", (value) => {
                        if (value === "так") {
                            if (temp.next) {
                                temp = temp.next;
                                console.log(`Перейшли до наступного елемента: ${temp.value}`);
                                navigateToLevel(callback);
                            } else {
                                console.log("Немає наступного елемента.");
                                navigateToLevel(callback);
                            }
                        } else {
                            rl.question("Наступний рівень? (так, ні): ", (value) => {
                                if (value === "так") {
                                    if (temp.child) {
                                        temp = temp.child;
                                        console.log("Перейшли до вкладеного рівня.");
                                        navigateToLevel(callback);
                                    } else {
                                        console.log("Немає вкладеного рівня.");
                                        navigateToLevel(callback);
                                    }
                                } else {
                                    rl.question("Ви знайшли потрібний рівень? (так, ні): ", (value) => {
                                        if (value === "так") {
                                            callback();
                                        } else {
                                            navigateToLevel(callback);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                navigateToLevel(() => {
                    console.log("Видалення вибраного рівня...");
                    deleteLevel(temp);
                    console.log("Рівень видалено.");
                    menu();
                });
                break;
            case "4":
                const copiedList = copyList(head);
                console.log("Копію списку створено.");
                menu();
                break;
            case "5":
                head = clearList(head);
                console.log("Список очищено.");
                menu();
                break;
            case "6":
                console.log("Вихід.");
                rl.close();
                break;
            case "7":
                console.log("\nПоточний список:");
                if (!head) {
                    console.log("Список порожній.");
                } else {
                    printList(head);
                }
                menu();
                break;
            default:
                console.log("Неправильний вибір. Спробуйте ще раз.");
                menu();
                break;
        }
    });
}

let head = null;

// Приклад попереднього заповнення списку
head = addElement(head, 1);
head = addElement(head, 2);
head = addElement(head, 3);
head.next.child = addElement(head.next.child, 4);
head.next.child = addElement(head.next.child, 5);
head.next.child.next.child = addElement(head.next.child.next.child, 6);

console.log("Заповнений список:");
printList(head);

// Запуск меню
menu();

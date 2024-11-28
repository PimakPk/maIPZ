class MultiNode {
    constructor(value) {
      this.value = value; // Значение элемента
      this.next = null;   // Указатель на следующий элемент
      this.child = null;  // Указатель на вложенный уровень
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
  
    let indent = "  ".repeat(level); // Отступ для визуализации вложенности
    let current = head;
  
    while (current) {
      console.log(`${indent}- ${current.value}`);
      if (current.child) {
        printList(current.child, level + 1); // Рекурсивный вызов для вложенного уровня
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
  console.log("1. Добавить элемент");
  console.log("2. Удалить элемент");
  console.log("3. Удалить уровень");
  console.log("4. Создать копию списка");
  console.log("5. Очистить список");
  console.log("6. Выход");
  console.log("7. Показать список");

  rl.question("Выберите опцию: ", (choice) => {
    switch (choice) {
      case "1":
        rl.question("Введите значение: ", (value) => {
          head = addElement(head, parseInt(value));
          console.log("Элемент добавлен.");
          menu();
        });
        break;
      case "2":
        rl.question("Введите значение для удаления: ", (value) => {
          head = deleteElement(head, parseInt(value));
          console.log("Элемент удален.");
          menu();
        });
        break;
        case "3":
            console.log("Нужно определить уровень для удаления. Следуйте инструкциям.");
            let temp = head;
        
            function navigateToLevel(callback) {
                rl.question("Следующий элемент? (yes, no): ", (value) => {
                    if (value === "yes") {
                        if (temp.next) {
                            temp = temp.next;
                            console.log(`Перешли к следующему элементу: ${temp.value}`);
                            navigateToLevel(callback);
                        } else {
                            console.log("Нет следующего элемента.");
                            navigateToLevel(callback);
                        }
                    } else {
                        rl.question("Следующий уровень? (yes, no): ", (value) => {
                            if (value === "yes") {
                                if (temp.child) {
                                    temp = temp.child;
                                    console.log("Перешли к вложенному уровню.");
                                    navigateToLevel(callback);
                                } else {
                                    console.log("Нет вложенного уровня.");
                                    navigateToLevel(callback);
                                }
                            } else {
                                rl.question("Вы нашли нужный уровень? (yes, no): ", (value) => {
                                    if (value === "yes") {
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
                console.log("Удаление выбранного уровня...");
                deleteLevel(temp);
                console.log("Уровень удален.");
                menu();
            });
            break;
        
      case "4":
        const copiedList = copyList(head);
        console.log("Копия списка создана.");
        menu();
        break;
      case "5":
        head = clearList(head);
        console.log("Список очищен.");
        menu();
        break;
      case "6":
        console.log("Выход.");
        rl.close();
        break;
        case "7":
        console.log("\nТекущий список:");
        if (!head) {
          console.log("Список пуст.");
        } else {
          printList(head);
        }
        menu();
        break;
      default:
        console.log("Неверный выбор. Попробуйте снова.");
        menu();
        break;
    }
  });
}


let head = null;

// Пример предварительного заполнения списка
head = addElement(head, 1);
head = addElement(head, 2);
head = addElement(head, 3);
head.next.child = addElement(head.next.child, 4);
head.next.child = addElement(head.next.child, 5);
head.next.child.next.child = addElement(head.next.child.next.child, 6);

console.log("Заполненный список:");
printList(head);

// Запуск меню
menu();


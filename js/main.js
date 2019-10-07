const todoList = document.getElementById('todo-list');
const form = document.getElementById(`modal-form`);
let tempTarget;

getToDosFromLocalStorage();
sortByDefault();

document.addEventListener('click', (e) => {
    e.preventDefault();

    let target = e.target;

    if (target.classList.contains('open-modal-btn')) {
        document.getElementsByClassName('overlay')[0].classList.remove('overlay-hidden');
        form.querySelector('.edit-btn').style.display = 'none';
        form.querySelector('.create-btn').style.display = 'inline-block';
    }
    if (target.classList.contains('overlay') || target.classList.contains('cross') || target.classList.contains('cancel-btn')) {
        closeModal();
    }
    if (target.classList.contains('create-btn')) {
        createNewToDoItem();
        sortByDefault();
    }
    if (target.classList.contains('delete-cross')) {
        deleteToDoItem(target);
    }
    if (target.classList.contains('edit-icon') && !target.classList.contains('edit-forbidden')) {
        document.getElementsByClassName('overlay')[0].classList.remove('overlay-hidden');
        editToDoItem(target);
    }
    if (target.classList.contains('edit-btn')){
        doEdit();
    }
    if (target.classList.contains('todo-item-piece') || target.classList.contains('done-checkbox')) {
        toggleDoneUndone(target);
        sortByDefault();
    }
    if (target.classList.contains('todo-header-done')) {
        sortByDoneUndone();
    }
    if(target.classList.contains('todo-header-priority')) {
        sortByPriority();
    }
});

function createNewToDoItem() {
    const div = document.createElement("div");
    div.classList.add('todo-item');
    let name = form.querySelector('[name=name]').value;
    let description = form.querySelector('[name=description]').value;
    let priority = form.querySelector('[name=priority]').value;
    let deadline = form.querySelector('[name=deadline]').value;

    if (!isValidate()) {
        alert("Your name must contains only letters, digits and spaces!");
    } else {
        div.innerHTML = `
            <div class="todo-item-piece"><input class="done-checkbox" name="done-check" type="checkbox"></div>
            <div class="todo-item-piece">${name}</div>
            ${colorizeAndCreatePriorityItem(priority)}
            <div class="todo-item-piece">${description}</div>
            <div class="todo-item-piece">${deadline}</div>
             <div class="todo-item-piece">
                <i class="fas fa-edit edit-icon"></i>
             </div>
             <div class="todo-item-piece">
                <i class="fas fa-times delete-cross"></i>
             </div>`;

        setToLocalStorage(div);

        todoList.append(div);

        clearModalSettings();
        closeModal();
    }
}

function editToDoItem(target) {
    tempTarget = target;
    let parent = target.parentNode.parentNode;
    parent = parent.getElementsByClassName('todo-item-piece');
    form.querySelector('[name=name]').value = parent[1].innerHTML;
    form.querySelector('[name=description]').value = parent[3].innerHTML;
    form.querySelector('.edit-btn').style.display = 'inline-block';
    form.querySelector('.create-btn').style.display = 'none';
}

function doEdit() {
    console.log(tempTarget);
    let parent = tempTarget.parentNode.parentNode;
    parent = parent.getElementsByClassName('todo-item-piece');

    if (!isValidate()) {
        alert("Your name must contain only letters, digits and spaces!");
    } else {
        parent[1].innerHTML = form.querySelector('[name=name]').value;
        parent[2].innerHTML = form.querySelector('[name=priority]').value;
        parent[3].innerHTML = form.querySelector('[name=description]').value;
        parent[4].innerHTML = form.querySelector('[name=deadline]').value;
    }

    clearModalSettings();
    closeModal();
}

function closeModal() {
    document.getElementsByClassName('overlay')[0].classList.add('overlay-hidden');
}

function isValidate() {
    let name = form.querySelector('[name=name]').value;
    return /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(name);
}

function clearModalSettings() {
    const forms = document.querySelectorAll('.info-input');
    forms.forEach((item) => {
        item.value = '';
    });
}

function colorizeAndCreatePriorityItem(priority) {
    let div;

    switch (priority) {
        case ("high"):
            div = `<div class="todo-item-piece priority-high priority">${priority}</div>`;
            break;
        case ("medium"):
            div = `<div class="todo-item-piece priority-medium priority">${priority}</div>`;
            break;
        case ("low"):
            div = `<div class="todo-item-piece priority-low priority">${priority}</div>`;
            break;
        default:
            break;
    }
    return div;
}

// function makeChangesToLocalStorage(id,item) {
//     localStorage.setItem(`${id}`, item);
// }

function setToLocalStorage(div) {
    let newID = new Date().toISOString().substr(0, 19);
    div.setAttribute('data-id', `${newID}`);
    localStorage.setItem(`${newID}`, div.outerHTML);
}

function getToDosFromLocalStorage() {
    let local = localStorage.length;
    if (local > 0) {
        todoList.innerHTML = '';
        for (let l = 0; l < local; l++) {
            let key = localStorage.key(l);
            let item = localStorage.getItem(key);
            todoList.innerHTML += item;
        }
    }
}

function deleteToDoItem(target) {
    let item = target.parentNode.parentNode;
    item.style.display = 'none';
    localStorage.removeItem(item.dataset.id);

}

function toggleDoneUndone(target) {
    let checkInput = target.parentNode.querySelector('[name=done-check]');
    target.parentNode.parentNode.querySelector('.edit-icon').classList.toggle("edit-forbidden");
    if (!checkInput.getAttribute('checked')) {
        checkInput.setAttribute('checked', 'checked');
    } else {
        checkInput.removeAttribute( 'checked');
    }

    if (target.classList.contains('done-checkbox')) {
        target.parentNode.parentNode.classList.toggle('done');
        // makeChangesToLocalStorage(target.parentNode.parentNode.dataset.id, target.parentNode.parentNode.innerHTML);
    } else {
        target.parentNode.classList.toggle('done');
        // makeChangesToLocalStorage(target.parentNode.dataset.id, target.parentNode.parentNode.innerHTML);
    }
}

function sortByDefault() {
    sortByPriority();
    sortByDoneUndone();
}

function sortByDoneUndone() {
    let collectionOfRestItems = [];

    [...document.getElementsByClassName('todo-item')].forEach(item => {
        if(item.classList.contains('done')) {
            todoList.append(item);
        } else {
            collectionOfRestItems.push(item);
        }
    });

    collectionOfRestItems.forEach(item => {
        if(!item.classList.contains('done')) {
            todoList.append(item);
        }
    })
}

function sortByPriority() {
    let collectionOfRestPriorities = [];

    [...document.getElementsByClassName('todo-item')].forEach(item => {
        if(item.querySelector('.priority-high')) {
            todoList.append(item);
        } else {
            collectionOfRestPriorities.push(item);
        }
    });

    collectionOfRestPriorities.forEach(item => {
        if(item.querySelector('.priority-medium')) {
            todoList.append(item);
        }
    });

    collectionOfRestPriorities.forEach(item => {
        if(item.querySelector('.priority-low')) {
            todoList.append(item);
        }
    })
}

function doSearch() {
    let input, filter, todoItems, itemPiece, cell, i, j;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    todoItems = todoList.getElementsByClassName('todo-item');

    for (i = 0; i < todoItems.length; i++) {
        todoItems[i].style.display = "none";

        itemPiece = todoItems[i].getElementsByClassName('todo-item-piece');
        for (j = 0; j < itemPiece.length; j++)  {
            cell = todoItems[i].getElementsByClassName("todo-item-piece")[j];
            if (cell.innerHTML.toUpperCase().includes(filter)) {
                todoItems[i].style.display = "flex";
                break;
            }
        }
    }
}


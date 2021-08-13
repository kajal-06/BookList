// using es6 class
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  // adding book to list --------
  addBookToList(bookDetails) {
    // console.log(bookDetails);
    const list = document.getElementById('book-list');

    // create tr element
    const row = document.createElement('tr');

    // insert cols

    row.innerHTML = `
      <td>${bookDetails.title}</td>
      <td>${bookDetails.author}</td>
      <td>${bookDetails.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
    `;
    // list.appendChild(row);
    list.insertAdjacentElement('afterbegin', row);

    // console.log(row);
  }

  // showing alerts --------
  showAlert(message, className) {
    // create a div
    const div = document.createElement('div');
    // add classes
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(message));
    // get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(div, form);

    // timeout after 3 secs
    setTimeout(() => {
      document.querySelector('.alert').remove();
      // document.querySelector('#submit-btn').disabled = false;
    }, 3000);
  }

  // deleting book --------
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  // clearing input fields --------
  clearFields() {
    Array.from(document.getElementsByTagName('input')).forEach(function (
      input
    ) {
      input.value = '';
    });
  }
}

// local storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (bookDetails) {
      const ui = new UI();

      // add book to UI
      ui.addBookToList(bookDetails);
    });
  }

  static addBook(bookDetails) {
    const books = Store.getBooks();
    books.push(bookDetails);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    // console.log(isbn);
    const books = Store.getBooks();
    books.forEach(function (bookDetails, index) {
      if (bookDetails.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

const ui = new UI();
// console.log(ui);

// dom load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// ---- event listeners ----
// event listener for adding book

document.getElementById('book-form').addEventListener('submit', function (e) {
  // getting form values and storing it to variables

  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  // instantiate Book constructor
  const bookDetails = new Book(title, author, isbn);

  // validate
  if (title === '' || author === '' || isbn === '') {
    // error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    // add book to list
    ui.addBookToList(bookDetails);

    // add to local storage
    Store.addBook(bookDetails);

    // show success
    ui.showAlert('Book Added!', 'success');

    // clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// event listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  // delete book
  ui.deleteBook(e.target);

  // remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  if (e.target.className === 'delete') {
    // show alert
    ui.showAlert('Book Removed', 'success');
  }

  e.preventDefault();
});

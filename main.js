document.addEventListener("DOMContentLoaded", function () {
  displayBooks();
});

document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    displayBooks(searchTitle);
  });

function displayBooks(searchTitle = "") {
  const books = getBooksFromStorage();
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books
    .filter((book) => book.title.toLowerCase().includes(searchTitle))
    .forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.setAttribute("data-bookid", book.id);
      bookItem.setAttribute("data-testid", "bookItem");
      bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">${
            book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
          }</button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

      if (book.isComplete) {
        completeBookList.appendChild(bookItem);
      } else {
        incompleteBookList.appendChild(bookItem);
      }
    });
}

function getBooksFromStorage() {
  const books = localStorage.getItem("books");
  return books ? JSON.parse(books) : [];
}

function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value, 10);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const id = Date.now();

    const newBook = {
      id,
      title,
      author,
      year,
      isComplete,
    };

    const books = getBooksFromStorage();

    books.push(newBook);

    saveBooksToStorage(books);

    displayBooks();

    document.getElementById("bookForm").reset();
  });

document.addEventListener("click", function (event) {
  const target = event.target;

  if (target.dataset.testid === "bookItemIsCompleteButton") {
    const bookId = target.closest("[data-bookid]").getAttribute("data-bookid");
    const books = getBooksFromStorage();
    const book = books.find((b) => b.id == bookId);
    book.isComplete = !book.isComplete;
    saveBooksToStorage(books);
    displayBooks();
  }

  if (target.dataset.testid === "bookItemDeleteButton") {
    const bookId = target.closest("[data-bookid]").getAttribute("data-bookid");
    let books = getBooksFromStorage();
    books = books.filter((b) => b.id != bookId);
    saveBooksToStorage(books);
    displayBooks();
  }
});

let currentEditBookId = null;

document.addEventListener('click', function (event) {
  const target = event.target;

  if (target.dataset.testid === 'bookItemEditButton') {
    const bookId = target.closest('[data-bookid]').getAttribute('data-bookid');
    const books = getBooksFromStorage();
    const book = books.find(b => b.id == bookId);

    if (book) {
      currentEditBookId = bookId;
      document.getElementById('editBookTitle').value = book.title;
      document.getElementById('editBookAuthor').value = book.author;
      document.getElementById('editBookYear').value = book.year;
      document.getElementById('editBookIsComplete').checked = book.isComplete;
      document.getElementById('editBookModal').style.display = 'flex';
    }
  }

  if (target.id === 'cancelEditButton') {
    document.getElementById('editBookModal').style.display = 'none';
  }
});

document.getElementById('editBookForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('editBookTitle').value;
  const author = document.getElementById('editBookAuthor').value;
  const year = parseInt(document.getElementById('editBookYear').value, 10);
  const isComplete = document.getElementById('editBookIsComplete').checked;

  let books = getBooksFromStorage();
  const bookIndex = books.findIndex(b => b.id == currentEditBookId);

  if (bookIndex > -1) {
    books[bookIndex] = { id: currentEditBookId, title, author, year, isComplete };
    saveBooksToStorage(books);
    displayBooks();
    document.getElementById('editBookModal').style.display = 'none';
  }
});

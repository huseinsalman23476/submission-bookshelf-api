/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  // eslint-disable-next-line no-multi-assign
  const reqPayload = {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  let finished = false;
  if (pageCount === readPage) finished = true;

  const newBook = {
    ...reqPayload, id, finished, insertedAt, updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (name !== undefined) {
    if (readPage < pageCount || pageCount === readPage) {
      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
    }
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

// eslint-disable-next-line consistent-return, no-unused-vars
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name === undefined && reading === undefined && finished === undefined) {
    if (books.length === 0) {
      return {
        status: 'success',
        data: {
          books: [],
        },
      };
    }

    if (books.length > 0) {
      return {
        status: 'success',
        data: {
          books: (books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
        },
      };
    }
  }

  if (name !== undefined) {
    const tmpBooks = [];
    books.forEach((book) => {
      if (book.name !== undefined && name !== undefined) {
        if ((book.name.toLowerCase()).includes((name.toLowerCase()))) tmpBooks.push(book);
      }
    });
    return {
      status: 'success',
      data: {
        books: (tmpBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
      },
    };
  }

  if (reading !== undefined) {
    if (reading === '0') {
      const tmpBooks = [];
      books.forEach((book) => {
        if (book.reading === false) tmpBooks.push(book);
      });
      return {
        status: 'success',
        data: {
          books: (tmpBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
        },
      };
    }

    if (reading === '1') {
      const tmpBooks = [];
      books.forEach((book) => {
        if (book.reading === true) tmpBooks.push(book);
      });
      return {
        status: 'success',
        data: {
          books: (tmpBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
        },
      };
    }

    return {
      status: 'success',
      data: {
        books: (books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
      },
    };
  }

  if (finished !== undefined) {
    if (finished === '0') {
      const tmpBooks = [];
      books.forEach((book) => {
        if (book.finished === false) tmpBooks.push(book);
      });
      return {
        status: 'success',
        data: {
          books: (tmpBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
        },
      };
    }

    if (finished === '1') {
      const tmpBooks = [];
      books.forEach((book) => {
        if (book.finished === true) tmpBooks.push(book);
      });
      return {
        status: 'success',
        data: {
          books: (tmpBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
        },
      };
    }

    return {
      status: 'success',
      data: {
        books: (books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }))),
      },
    };
  }
};

// eslint-disable-next-line consistent-return
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// eslint-disable-next-line consistent-return
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // eslint-disable-next-line no-multi-assign
  const reqPayload = {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  let finished = false;
  if (pageCount === readPage) finished = true;

  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    if (name !== undefined && readPage < pageCount) {
      books[index] = {
        ...books[index],
        ...reqPayload,
        finished,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);
  let response;

  if (index === -1) {
    response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
  }

  if (index !== -1) {
    books.splice(index, 1);
    response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
  }
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};

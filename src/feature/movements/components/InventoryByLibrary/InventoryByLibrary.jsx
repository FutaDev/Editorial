import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBooksByFilter } from '../../../books/services/books';
import getLibrariesByPublisher from '../../../libraries/services/allLibraries';
import './InventoryByLibrary.scss';

const InventoryByLibrary = () => {
  const [fullInventory, setFullInventory] = useState([]);
  const { allLibraries } = useSelector((state) => state.allLibraries);
  const { catalogue } = useSelector((state) => state.catalogue);
  const { publisher } = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const publisherData = useSelector((state) => state.publisher.publisher);
  const userToken = localStorage.getItem('login-token');

  useEffect(() => {
    dispatch(getBooksByFilter({ publisher, userToken }));
  }, [publisher, userToken]);

  useEffect(() => {
    if (publisher) {
      dispatch(getLibrariesByPublisher({ publisher, userToken }));
    }
  }, [publisher, userToken]);

  useEffect(() => {
    if (Array.isArray(allLibraries)) {
      const finalObject = allLibraries.map(({ _id, name }) => {
        if (!catalogue || !Array.isArray(catalogue)) {
          return null;
        }
        const books = catalogue.map(({ inventory, ...book }) => {
          let copies = 0;
          if (!inventory || !Array.isArray(inventory)) {
            return null;
          }
          const libraryInventory = inventory.findIndex(
            (library) => String(library.placeId) === String(_id),
          );
          if (libraryInventory >= 0) {
            copies = inventory[libraryInventory].copies;
          }
          return ({
            id: book._id,
            title: book.title,
            cover: book.cover,
            copies,
          });
        });
        return ({ id: _id, name, books });
      });
      const pub = { id: publisherData._id, name: publisherData.name };
      if (catalogue && Array.isArray(catalogue)) {
        const pubBooks = catalogue.map(({ inventory, ...book }) => {
          let copies = 0;
          if (!inventory || !Array.isArray(inventory)) {
            return null;
          }
          const libraryInventory = inventory.findIndex(
            (library) => String(library.placeId) === String(publisherData._id),
          );
          if (libraryInventory >= 0) {
            copies = inventory[libraryInventory].copies;
          }
          return ({
            id: book._id,
            title: book.title,
            cover: book.cover,
            copies,
          });
        });
        pub.books = pubBooks;
        finalObject.unshift(pub);
      }
      setFullInventory(finalObject);
    }
  }, [allLibraries, catalogue, publisherData]);

  return (
    <section className="by-library">
      <h3>Por librería</h3>
      {fullInventory && Array.isArray(fullInventory)
        ? fullInventory.map((library) => (
          <article key={library.id}>
            <h4>{library.name}</h4>
            {library.books && Array.isArray(library.books) && (
              <div>
                {library.books.map((book) => (
                  <>
                    <figure className="by-library__book-fig">
                      <img className="by-library__book-img" src={book.cover} alt={book.title} />
                    </figure>
                    <div key={book.id}>
                      <p><b>{book.title}</b></p>
                      <p>Cantidad de ejemplares: {book.copies}</p>
                    </div>
                  </>
                ))}
              </div>
            )}
            <hr />
          </article>
        ))
        : null}
    </section>
  );
};
export default InventoryByLibrary;

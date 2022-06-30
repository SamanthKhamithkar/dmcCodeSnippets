using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  // @readonly entity Books as SELECT from my.Books {*,
  //   author.name as author
  // } excluding { createdBy, modifiedBy };
  entity Books @readonly as projection on my.Books;
  entity Authors @readonly as projection on my.Authors;
  entity Books_Authors @readonly as projection on my.Books_Authors;

  //To add a property into your 'Entity' on the run/dynamically(without changing schema file)
  view StockInfo as select from Books {
    *,
    null as level: Integer
  };

  @requires_: 'authenticated-user'
  action submitOrder (book: Books:ID, quantity: Integer);
}

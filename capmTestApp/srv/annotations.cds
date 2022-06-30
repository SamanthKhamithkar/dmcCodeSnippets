annotate CatalogService.Books with @(
    UI: {
        SelectionFields: [],
        LineItem: [
            {Value: title, Label: 'Book Title'},
            {Value: stock, Label: 'Stock Remaining', Criticality: level}
        ],
        HeaderInfo: {
            TypeName: 'Book',
            TypeNamePlural: 'Books',
            Title: {Value: title},
            Description: {Value: author.name}
        }
    }
);

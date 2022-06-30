namespace scp.dmc;

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';

type Url : String;

type TechnicalBooleanFlag : Boolean @(
    UI.Hidden,
    Core.Computed
);

type TechnicalFieldControlFlag : Integer @(
    UI.Hidden,
    Core.Computed
);
type TechnicalString : String @(
    UI.Hidden,
    Core.Computed
);

type Criticality : Integer @(
    UI.Hidden,
    Core.Computed
);

type Identifier : String(50) @(title : '{i18n>Ordernumber}');
@cds.autoexpose
aspect identified : cuid {
    identifier : Identifier not null;
}


//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.

annotate identified with @(
    Common.SemanticKey : [identifier],
    UI.Identification  : [{Value : identifier}]
) {

    ID         @Common : {
        Text            : identifier,
        TextArrangement : #TextOnly,
        
    };
}

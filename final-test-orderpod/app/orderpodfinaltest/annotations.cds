using orderpodservice as service from '../../srv/orderpodservice';
using from '../../srv/common_orderpod';

//To remove common search field in header section
annotate service.Serials with @Capabilities : {
    SearchRestrictions : {
        $Type : 'Capabilities.SearchRestrictionsType',
        Searchable: false
    }
};

annotate service.Serials with @(
    UI.SelectionFields : [
        identifier,
        to_order_ID,
        to_status_code,
        to_plant_code,
        to_material_ID,
        quantity,
        createdAt
    ],

    UI.HeaderInfo : {
        TypeName       : '{i18n>SFC}',
        TypeNamePlural : '{i18n>SFCs}',
        Title          : {Value : identifier},
        Description    : {Value : to_material.descr},
        ImageUrl       : 'http://localhost:4004/ns/orderpodfinaltest/webapp/test/image/pudding.jpg'
    },

    UI.PresentationVariant : {
        SortOrder : [{
            $Type    : 'Common.SortOrderType',
            Property : identifier
        }],
        Visualizations : ['@UI.LineItem']
    },

    UI.LineItem : {
        ![@UI.Criticality] : to_status.criticalitytable,
        $value : [
            {
                $Type : 'UI.DataField',
                Value : identifier,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : to_order_ID,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target : '@UI.FieldGroup#Material',
                Label : '{i18n>Material}',
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>OperationPhase}',
                Value : to_orderOperationsAndPhases.to_operations.operation
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : to_status_code,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : to_plant_code,
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
                ![@UI.Importance] : #High,
            },
            //insert your line item enhancement here
        ]
    },

    UI.FieldGroup #Material : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : to_material_ID
            },
            {
                $Type : 'UI.DataField',
                Value : to_material.descr
            },
        ]
    }
);

//This entity is associated with "Orders" entity which generates 'to_material_ID' property
//Hence we can see a 'Link' control when we use above property, which opens
//Popover showing the below data
annotate service.Materials with @(UI : {
    QuickViewFacets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>MaterialInformation}',
            Target : '@UI.FieldGroup#MaterialInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>PlantStock}',
            Target : '@UI.FieldGroup#PlantStock'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>InternalContact}',
            Target : '@UI.FieldGroup#ContactInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>MaterialMasterData}',
            Target : '@UI.FieldGroup#MasterData'
        }
    ],

    FieldGroup #MaterialInfo : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : descr},
            {
                Value : to_status_code,
                Criticality : to_status.criticality,
                CriticalityRepresentation : #WithIcon
            },
            {Value : type},
            {Value : to_plant_code}
        ]
    },

    FieldGroup #PlantStock : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : unrestrictedUseStock}
        ]
    },

    FieldGroup #ContactInfo : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : controller},
            {Value : supervisor}
        ]
    },

    FieldGroup #MasterData : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : batchRecordRequired},
            {Value : underdeliveryTolerance},
            {Value : overdeliveryTolerance},
            {Value : MRPType},
            {Value : procurementType},
            {Value : safetyStock}
        ]
    }
});

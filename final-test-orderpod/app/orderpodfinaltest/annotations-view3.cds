using orderpodservice as service from '../../srv/orderpodservice';
using from '../../srv/common_orderpod';

annotate service.Serials with @(UI : {
    HeaderFacets : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>MaterialInformation}',
            Target : '@UI.FieldGroup#MaterialForHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>CurrentPhase}',
            Target : '@UI.FieldGroup#CurrentPhaseForHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Operation}',
            Target : '@UI.FieldGroup#OperationForHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Quantities}',
            Target : '@UI.FieldGroup#QuantitiesForHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Status}',
            Target : '@UI.DataPoint#Status'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Order}',
            Target : '@UI.DataPoint#OrderForHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Batch}',
            Target : '@UI.DataPoint#BatchForHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>OrderProgress}',
            Target : '@UI.DataPoint#ProgressForHeader'
        }
    ],

    FieldGroup #MaterialForHeader : {
        Label  : '{i18n>MaterialInformation}',
        $Type  : 'UI.FieldGroupType',
        Data   : [
            {Value : to_material_ID,
                Label : '{i18n>Material}'},
            {Value : to_material.descr,
                Label : '{i18n>Description}'},
            {Value : to_material.version,
                Label : '{i18n>Version}'},
            {Value : to_material.currentVersion,
                Label : '{i18n>CurrentVersion}'}
        ]
    },

    FieldGroup #CurrentPhaseForHeader : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Label  : '{i18n>OperationGroup}', Value : to_orderOperationsAndPhases.operationGroup},
            {Value : to_orderOperationsAndPhases.to_operations.operation},
            {Value : to_orderOperationsAndPhases.to_operations.descr}
        ]
    },

    FieldGroup #OperationForHeader : {
        Label  : '{i18n>Operation}',
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                Label  : '{i18n>OperationGroup}',
                Value : to_orderOperationsAndPhases.operationGroup
            },
            {Value : to_orderOperationsAndPhases.operation,
                Label : '{i18n>Operation}'},
            {Value : to_orderOperationsAndPhases.operationDescr,
                Label : '{i18n>Description}'}
        ]
    },

    FieldGroup #QuantitiesForHeader : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {Value : quantity,
                Label : '{i18n>Quantity}'},
            {Value : to_order.quantityOpen,
                Label : '{i18n>QuantityOpen}'},
            {Value : to_order.GRQuantity,
                Label : '{i18n>GRQuantity}'}
        ]
    },

    DataPoint #Status : {
        Title       : '{i18n>Status}',
        Value       : to_status.descr,
        Criticality : to_status.criticality
    },

    DataPoint #OrderForHeader : {
        Title : '{i18n>Order}',
        $Type : 'UI.DataPointType',
        Value : to_order.identifier
    },

    DataPoint #BatchForHeader : {
        Title : '{i18n>Batch}',
        $Type : 'UI.DataPointType',
        Value : defaultBatch
    },

    DataPoint #ProgressForHeader : {
        Title  : '{i18n>OrderProgress}',
        Value : to_orderOperationsAndPhases.quantityProduced,
        TargetValue : to_orderOperationsAndPhases.quantity,
        Visualization : #Progress,
        Criticality: to_orderOperationsAndPhases.criticality
    },

    Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'PARefFacet1',
            Label : '{i18n>PhaseActions}',
            //Target : '@UI.FieldGroup#PhaseActionsFG1',
            Target : 'to_phases/@UI.LineItem#PhasesTable',
        }    
    ]
});

//TO add uom on quantity field in header as suffix in ()
annotate service.Serials with {
    quantity @Common.Text : {
            $value : uom,
            ![@UI.TextArrangement] : #TextLast,
        }
};

//Tab 1 - Item 5 FG Begins
annotate service.SFCPhasesList with @(UI : {
    PresentationVariant  : {
        SortOrder : [
            {
                $Type    : 'Common.SortOrderType',
                Property : phase
            }
        ]
    },

    HeaderInfo  : {
        TypeName       : '{i18n>Phase}',
        TypeNamePlural : '{i18n>Phases}',
        Title          : {Value : phase},
        Description    : {Value : phaseGroup}
    },

    LineItem #PhasesTable : {
        //![@UI.Criticality] : to_status.criticalitytable,
        $value: [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Phase ID}',
                Value : phase,
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataFieldWithUrl',
                Value : phaseGroup,
                Label : '{i18n>Phase Group}',
                Url : 'http://localhost:4005/phases/webapp/index.html#fe-lrop-v4&/SFCPhasesList(152c6f1c-3fb7-469a-bf27-9a2341379f96)',
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target : '@UI.FieldGroup#WorkcenterPhasesList',
                Label : '{i18n>WorkCenter}',
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Target : '@UI.FieldGroup#DatesPhasesList',
                Label : '{i18n>Start/End}',
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : to_status_code
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Label : '{i18n>OrderProgress}',
                Criticality : criticality,
                ![@HTML5.CssDefaults] : {width : '15rem'},
                Target : '@UI.DataPoint#ProgressPhasesList',
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataFieldForAction',
                Label : '{i18n>Start Phase}',
                Action : 'orderpodservice.start',
                InvocationGrouping : #Isolated,
                ![@UI.Importance] : #High,
                Inline : true
            }
        ]
    },
    
    DataPoint #ProgressPhasesList : {
        Title  : '{i18n>OrderProgress}',
        Value : quantityProduced,
        TargetValue : quantity,
        Visualization : #Progress,
        Criticality: criticality
    },

    FieldGroup #DatesPhasesList : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : startTime
            },
            {
                $Type : 'UI.DataField',
                Value : endTime
            },
        ]
    },

    FieldGroup #WorkcenterPhasesList : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : workcenter
            },
            {
                $Type : 'UI.DataField',
                Value : workcentertype
            },
        ]
    }
});

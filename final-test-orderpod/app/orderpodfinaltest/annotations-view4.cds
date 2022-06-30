using orderpodservice as service from '../../srv/orderpodservice';
using from '../../srv/common_orderpod';

annotate service.SFCPhasesList with @(UI : {
    Identification : [
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'orderpodservice.change_dates',
            Label : 'Change Dates',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'orderpodservice.start',
            Label : 'Start Phase',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'orderpodservice.createBatch',
            Label : 'Create Batch',
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'orderpodservice.complete',
            Label : 'Complete Phase',
            Determining : true,
            Criticality : #Positive
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'orderpodservice.scan',
            Label : 'Scan',
            Determining : true,
        },
    ],

    HeaderFacets  : [
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Dates}',
            Target : '@UI.FieldGroup#DatesPhasesHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Workcenter}',
            Target : '@UI.FieldGroup#WorkcenterPhasesHeader'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Status}',
            Target : '@UI.FieldGroup#Status'
        }
    ],

    FieldGroup #DatesPhasesHeader : {
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

    
    FieldGroup #WorkcenterPhasesHeader : {
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
    },

    FieldGroup #Status : {
        Data : [
            {
                $Type : 'UI.DataField',
                Label  : '{i18n>Status}',
                Value : to_status.descr
            },
        ]
    },

    Facets : [
        //Tab 1
        {
            $Type  : 'UI.CollectionFacet',
            Label  : '{i18n>PhaseInformation}',
            ID     : 'PhaseInfoCollectionFacet1',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID : 'PhaseInfoRefFacet1',
                    Label : '{i18n>PhaseInformation}',
                    Target : '@UI.FieldGroup#PhaseInfoFG1'
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    ID : 'DateInfoRefFacet1',
                    Label : '{i18n>OrderTimes}',
                    Target : '@UI.FieldGroup#DateTimeInfoFG1'
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : '{i18n>Status}',
                    ID : 'StatusInfoRefFacet1',
                    Target : '@UI.FieldGroup#StatusInfoFG1',
                }
            ]
        },
        //Tab 2
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Work Instructions}',
            ID     : 'InstructionsFacet',
            Target : '@UI.FieldGroup#Workinstructions'
        },
        //Tab 3
        {
            $Type  : 'UI.ReferenceFacet',
            Label  : '{i18n>Consumption}',
            ID     : 'MatConsumptionsFacet',
            Target : 'to_consumptions/@UI.LineItem#MatConsumptionTable'
        },
    ],

    //Tab 1 FG Begins
    FieldGroup #PhaseInfoFG1 : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Label : 'Phase Group',
                Value : phaseGroup
            },
            {
                $Type : 'UI.DataField',
                Label : 'Phase ID',
                Value : phase
            },
            {
                $Type : 'UI.DataField',
                Label : 'Descricption',
                Value : phaseDescr
            },
            {
                $Type : 'UI.DataField',
                Label : 'Work Center',
                Value : workcenter
            }
        ]
    },

    FieldGroup #DateTimeInfoFG1 : {
        $Type : 'UI.FieldGroupType',
        Data  : [
            {
                $Type : 'UI.DataField',
                Value : startTime,
                Label : '{i18n>PlannedStart}',
            },
            {
                $Type : 'UI.DataField',
                Value : endTime,
                Label : '{i18n>PlannedEnd}',
            },
            {
                $Type : 'UI.DataField',
                Value : startTime,
                Label : '{i18n>ScheduledStart}',
            },
            {
                $Type : 'UI.DataField',
                Value : endTime,
                Label : '{i18n>ScheduledEnd}',
            }
        ]
    },

    FieldGroup #StatusInfoFG1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : to_status.descr,
                Label : '{i18n>Description}',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Action : 'orderpodservice.EntityContainer/createRandom',
                Label : '{i18n>ChangeDates}',
            },
        ],
    },

    //Tab 2 FG Begins
    FieldGroup #Workinstructions : {
        Data : [
            {
                $Type : 'UI.DataField',
                Label  : '{i18n>Phase Description}',
                Value : phaseDescr
            },
        ]
    }
});

//Tab 3 FG Begins
annotate service.MaterialConsumptions with @(UI : { 
    PresentationVariant                  : {
        SortOrder      : [{
            $Type    : 'Common.SortOrderType',
            Property : ID
        }]
    },

    HeaderInfo : {
        TypeName       : '{i18n>MaterialConsumption}',
        TypeNamePlural : '{i18n>MaterialConsumptions}',
        Title          : {Value : ID}
    },

    LineItem #MatConsumptionTable : {
        ![@UI.Criticality] : criticality,
        $value: [
            {
                $Type : 'UI.DataField',
                Value : to_material_ID,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataFieldForAnnotation',
                Label : '{i18n>OrderProgress}',
                Criticality : criticalityprogress,
                ![@HTML5.CssDefaults] : {width : '15rem'},
                Target : '@UI.DataPoint#Progress',
                ![@UI.Importance] : #High
            },
            {
                $Type : 'UI.DataField',
                Value : threshold,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : to_storage_code,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : quantityPosted,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : to_uom_code,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
                ![@UI.Importance] : #High,
            },
            {
                $Type : 'UI.DataFieldForAction',
                Label : '{i18n>Add Non-BOM Component}',
                Action : 'orderpodservice.addNoneBomComponent',
                InvocationGrouping : #Isolated,
                ![@UI.Importance] : #High,
            },
            //insert your line item enhancement here
        ]
    },

    DataPoint #Progress : {
        Title  : '{i18n>OrderProgress}',
        Value : postedValue,
        TargetValue : quantity,
        Visualization : #Progress,
        Criticality: criticalityprogress
    }
});

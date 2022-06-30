using scp.dmc from '../db';
using scp.cloud from '../db/schema';
//using scp.dmc from '../db/new';

using { scp.dmc as our } from '../db';
// extend our.Orders with {
//   to_phases                                         : Association to many OrderPhases2 on to_phases.to_order = $self;
  
// };

service orderpodservice /*@(requires:'authenticated-user')*/ {
    action createRandom (
        amount:Integer
        @mandatory
        @title : '{i18n>Quantity}',
        
        @Common : {
                // Text            : to_material.identifier,
                // TextArrangement : #TextOnly,
                ValueList                : {
                        CollectionPath : 'Plant',
                        SearchSupported : true,
                        Parameters     : [{
                            $Type             : 'Common.ValueListParameterInOut',
                            LocalDataProperty : plant,
                            ValueListProperty : 'code'
                        },
                        
                        { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'code' },
                        ]
                    },
                ValueListWithFixedValues

            }
        plant:String @title : '{i18n>Plant}',
        
        @Common : {
                // Text            : to_material.identifier,
                // TextArrangement : #TextOnly,
                ValueList                : {
                        CollectionPath : 'MaterialsProducable',
                        SearchSupported : true,
                        Parameters     : [{
                            $Type             : 'Common.ValueListParameterInOut',
                            LocalDataProperty : material,
                            ValueListProperty : 'ID'
                        },
                        
                        { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'identifier' },
                        ]
                    },
                ValueListWithFixedValues

            }
        material:UUID @title : '{i18n>Material}',
        @Common : {
                // Text            : to_material.identifier,
                // TextArrangement : #TextOnly,
                ValueList                : {
                        CollectionPath : 'OrderSelectStatus',
                        SearchSupported : true,
                        Parameters     : [{
                            $Type             : 'Common.ValueListParameterInOut',
                            LocalDataProperty : status,
                            ValueListProperty : 'code'
                        },
                        
                        { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'code' },
                        ]
                    },
                ValueListWithFixedValues

            }
        status:String @title : '{i18n>Status}',

    );
    //@odata.draft.enabled
    entity Orders               as select from dmc.Orders where to_status.code = 'O_002' or to_status.code = 'O_003' or to_status.code = 'O_005';

    @readonly
    entity MaterialsProducable               as select from dmc.Materials 
    {
        ID,
        identifier,
        descr,
        version,
        to_plant,
        to_status.descr as to_status_code,
        currentVersion,
    }
    where Materials.to_procurementType_code = 'Manufactured';

    @cds.redirection.target: true
    @readonly
    entity Materials               as projection on dmc.Materials;
    // @cds.redirection.target: true
    // entity OrderOperationsAndPhases as select from dmc.OrderOperationsAndPhases;
    @readonly
    @cds.redirection.target: true
    entity OrderOperations               as select from dmc.OrderOperations;
    @readonly
    entity OrderPhases               as select from dmc.OrderPhases;
    @readonly
    entity Customer               as projection on cloud.Customer;
    @readonly
    entity Serials as projection on dmc.Serials;
    @readonly
    entity Components as select from dmc.Components;
    @readonly
    entity OrderOperationsAndPhases as projection on dmc.OrderOperationsAndPhases

    @readonly
    entity Operations as projection on dmc.Operations;
    @readonly
    entity Phases as projection on dmc.Phases;
    @readonly
    entity Holds as projection on dmc.Holds;
    @readonly
    entity ReasonCodes as projection on dmc.ReasonCodes;
    @readonly
    entity Users as projection on cloud.Users;
    @readonly
    entity OrderIssues as projection on dmc.OrderIssues;
    @readonly
    entity OrderStatusOverview as projection on dmc.OrderStatusOverview;
    @readonly
    entity OrderSelectStatus as select from dmc.OrderStatus where OrderStatus.code = 'O_003' or OrderStatus.code = 'O_006'; 
    @cds.redirection.target: true
    @readonly
    entity OrderStatus as projection on dmc.OrderStatus;
    
    @readonly
    entity Billofmaterials as select from dmc.Billofmaterials {
        ID,
        identifier,
        to_plant,
        currentVersion,
        version,
        to_status.descr as to_status_code
    };
    @readonly
    @cds.redirection.target: true
    entity Routings as projection on dmc.Routings;


    @readonly
    entity RoutingsCreate as select from dmc.Routings {
        ID,
        identifier,
        descr,
        relaxedFlow,
        currentVersion,
        version,
        to_plant,
        to_status.descr as to_status_code
    } where Routings.isProcess = false;
    @readonly
    entity RecipeCreate as select from dmc.Routings {
        ID,
        descr,
        identifier,
        relaxedFlow,
        currentVersion,
        version,
        to_plant,
        to_status.descr as to_status_code
    } where Routings.isProcess = true;
    
    annotate orderpodservice.Orders.to_phases with @(
	UI: {
		Identification: [{Value:descr}],
		SelectionFields: [ locale, descr ],
		LineItem: [
			{Value: locale, Label: 'Language Code'},
			// {Value: title, Label: 'Title'},
			{Value: descr, Label: '{i18n>Description}'},
		]
	});
    @readonly
    entity Workcenters as projection on dmc.Workcenters;
    @readonly
    entity OrderQuantityConfirmations as projection on dmc.OrderQuantityConfirmations;
    @readonly
    entity OrderConfirmations as projection on dmc.OrderConfirmations;
    @readonly
    entity ComponentsToSFCs as projection on dmc.ComponentsToSFCs;
    @readonly
    entity SFCToOperationPhasesList @(cds.redirection.target: true) as projection on dmc.SFCToOperationPhasesList;

    entity MaterialConsumptions as projection on dmc.MaterialConsumptions
        actions {
            action addNoneBomComponent(
                @mandatory
                to_material_ID: UUID  @title : '{i18n>Material}'
            );
        };
    
    @odata.draft.enabled
    entity SFCPhasesList  as projection on  dmc.SFCPhasesList
        actions {
            action scan(
                value:String 
                @title : '{i18n>Value}'
            );
            action createBatch(
                @mandatory
                @Common : {
                    Text            : to_material.identifier,
                    TextArrangement : #TextOnly,
                    ValueList                : {
                            CollectionPath : 'Materials',
                            SearchSupported : true,
                            Parameters     : [{
                                $Type             : 'Common.ValueListParameterInOut',
                                LocalDataProperty : to_material_ID,
                                ValueListProperty : 'ID'
                            },
                            { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'identifier' },
                            { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'descr' },
                            { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'version' },
                            { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'to_status_code' },
                            { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'currentVersion' },
                            ]
                        },
                }
                to_material_ID:UUID 
                @title : '{i18n>Material}'
            );
            //@Core.OperationAvailable : 'isCurrent'

            @sap.applicable.path:'isCurrent'
            action start(

            );
            action complete();
            action change_dates(
                startTime:DateTime  @title : '{i18n>Start}',
                endTime:DateTime  @title : '{i18n>End}'
            );
        };

    @readonly
    entity SFCOperationList as projection on  dmc.SFCOperationList;
    
    @readonly
    entity Batches as projection on  dmc.Batches;

    function test() returns String; 
};
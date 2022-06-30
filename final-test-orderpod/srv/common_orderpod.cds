namespace scp.dmc;
using orderpodservice as service from './orderpodservice';

//Display Description when code is binded
annotate service.OrderStatus with {
    code @Common : {
        Text            : descr,
        TextArrangement : #TextOnly,
        ValueListWithFixedValues
    };
    descr 
    @title : '{i18n>Status}';
}

//To display Description in Status filter dropdown which belongs to Serials entity
annotate service.SFCStatus with {
    code @Common : {
        Text            : descr,
        TextArrangement : #TextOnly,
        ValueListWithFixedValues
    };
    descr 
    @title : '{i18n>Status}';
}

//Below annotations defines the way a property should display or behave in edit/display mode
annotate service.MaterialConsumptions with {
    @mandatory
    @readonly
    to_material @Common : {
        Text            : to_material.identifier,
        TextArrangement : #TextOnly,
        ValueList       : {
                CollectionPath  : 'Materials',
                SearchSupported : true,
                Parameters      : [
                    {
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
    };

    @readonly
    threshold;

    @readonly
    to_uom;

    to_storage @Common : {
        Text            : to_storage.name,
        TextArrangement : #TextOnly,
        ValueList                : {
                CollectionPath : 'Storages',
                SearchSupported : true,
                Parameters     : [{
                    $Type             : 'Common.ValueListParameterInOut',
                    LocalDataProperty : to_storage_code,
                    ValueListProperty : 'code'
                },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'code' },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'descr' },
                ]
            }
    };

    @mandatory
    quantityPosted;

    quantity;

    @readonly
    postedValue;

    to_batch @Common : {
        Text            : to_batch.identifier,
        TextArrangement : #TextOnly,
    }
}

//To make the text look BOLD
annotate service.Serials with @(Common.SemanticKey : [identifier]);
annotate service.SFCPhasesList with @(Common.SemanticKey : [phase]);
annotate service.MaterialConsumptions with @(Common.SemanticKey : [to_material_ID]);

//To display Description of 'phase'
annotate service.SFCPhasesList with {
    phase @Common : {
        Text            : phaseDescr,
        TextArrangement : #TextFirst,
        ValueListWithFixedValues
    }
    @title : '{i18n>Phase ID}';

    @Common.SemanticObject : 'PhasesTest'
    to_status @Common : {
        Text            : to_status.descr,
        TextArrangement : #TextOnly,
    };
}

annotate service.Orders with {
    //Status Filter Item
    to_status @Common : {
        Text            : to_status.descr,
        TextArrangement : #TextOnly,
        ValueListWithFixedValues
    };

    GRQuantity @Common.Text : {
        $value : to_uom.code,
        ![@UI.TextArrangement] : #TextLast,
    };

    quantityOpen @Common.Text : {
        $value : to_uom.code,
        ![@UI.TextArrangement] : #TextLast,
    };

//     @sap.unit: 'to_uom_code'
//     @Precision: 11
//     @Scale:3 
//     @(Common.FieldControl: createMandatoryFieldControl)
//     quantity;

//     @Common.SemanticObject : 'Material'
//     @mandatory
//     to_material @Common : {
//         Text            : to_material.identifier,
//         TextArrangement : #TextOnly,
//         ValueList                : {
//                 CollectionPath : 'MaterialsProducable',
//                 SearchSupported : true,
//                 Parameters     : [{
//                     $Type             : 'Common.ValueListParameterInOut',
//                     LocalDataProperty : to_material_ID,
//                     ValueListProperty : 'ID'
//                 },
//                 {
//                     $Type             : 'Common.ValueListParameterIn',
//                     LocalDataProperty : to_plant_code,
//                     ValueListProperty : 'to_plant_code'
//                 },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'identifier' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'descr' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'version' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'to_status_code' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'currentVersion' },
//                 ]
//             },
//     }@(Common.FieldControl: createMandatoryFieldControl);

//     @Common.SemanticObject : 'BOM'
//     to_bom @Common : {
//         Text            : to_bom.identifier,
//         TextArrangement : #TextOnly,
//         ValueList                : {
//                 CollectionPath : 'Billofmaterials',
//                 SearchSupported : true,
//                 Parameters     : [{
//                     $Type             : 'Common.ValueListParameterInOut',
//                     LocalDataProperty : to_bom_ID,
//                     ValueListProperty : 'ID'
//                 },
//                 {
//                     $Type             : 'Common.ValueListParameterIn',
//                     LocalDataProperty : to_plant_code,
//                     ValueListProperty : 'to_plant_code'
//                 },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'identifier' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'to_status_code' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'version' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'currentVersion' },
//                 ]
//             },
//     }@(Common.FieldControl: createMandatoryFieldControl);

//     @Common.SemanticObject : 'Routing'
//     to_routing @Common : {
//         Text            : to_routing.identifier,
//         TextArrangement : #TextOnly,
//         ValueList                : {
//                 CollectionPath : 'RoutingsCreate',
//                 SearchSupported : true,
//                 Parameters     : [{
//                     $Type             : 'Common.ValueListParameterInOut',
//                     LocalDataProperty : to_routing_ID,
//                     ValueListProperty : 'ID'
//                 },
//                 {
//                     $Type             : 'Common.ValueListParameterIn',
//                     LocalDataProperty : to_plant_code,
//                     ValueListProperty : 'to_plant_code'
//                 },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'identifier' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'descr' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'version' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'to_status_code' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'currentVersion' },
//                 { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'relaxedFlow' },
//                 ]
//             },
//     }@(Common.FieldControl: materialProductionFieldControl);

//     //Order Type Filter Item
//     //Displays dropdown in filter section
//     to_ordertype @Common : {
//         Text            : to_ordertype.descr,
//         TextArrangement : #TextFirst,
//         ValueListWithFixedValues
//     };

//     @sap.unit: 'to_uom_code'
//     @readonly
//     @(Common.FieldControl: FieldControl)
//     quantityProduced;

//     @sap.filter.restriction: 'interval'
//     @(Common.FieldControl: FieldControl)
//     plannedStart;

//     @(Common.FieldControl: FieldControl)
//     @sap.filter.restriction: 'interval'
//     plannedEnd;

//     @sap.filter.restriction: 'interval'
//     @(Common.FieldControl: FieldControl)
//     scheduledStart;

//     @sap.filter.restriction: 'interval'
//     @(Common.FieldControl: FieldControl)
//     scheduledEnd;

//     @sap.filter.restriction: 'interval'
//     @(Common.FieldControl: FieldControl)
//     start;

//     @sap.filter.restriction: 'interval'
//     @(Common.FieldControl: FieldControl)
//     end;
}

annotate service.Materials with {
    ID @Common : {
        Text            : descr,
        TextArrangement : #TextFirst
    }@UI.HiddenFilter
    @UI.Hidden;

    @sap.unit: 'uom'
    unrestrictedUseStock;
    
    @sap.unit: 'uom'
    safetyStock;

    @Common.SemanticObject : 'Status'
    to_status @Common : {
        Text            : to_status.descr,
        TextArrangement : #TextOnly,
        ValueListWithFixedValues
    };

    to_plant @Common : {
        Text            : to_plant.name,
        TextArrangement : #TextFirst
    };

    @sap.semantics: 'unit-of-measure'
    @readonly
    uom;

    identifier @title : '{i18n>Material}';
}

annotate service.RoutingsCreate with {
    ID @Common : {
        Text            : identifier,
        TextArrangement : #TextOnly
    }@UI.HiddenFilter
    @UI.Hidden
    @title : '{i18n>Routing}';

    to_status_code
    @title : '{i18n>Status}';

    identifier
    @title : '{i18n>Routing}';
}

annotate service.Billofmaterials with {
    ID @Common : {
        Text            : identifier,
        TextArrangement : #TextOnly
    }@UI.HiddenFilter
    @UI.Hidden
    @title : '{i18n>BOM}';

    identifier
    @title : '{i18n>BOM}';
    
    to_status @Common : {
        Text            : to_status.descr,
        TextArrangement : #TextOnly
    };
    
    to_status_code
    @title : '{i18n>Status}';
}

annotate service.Serials with {
    ID
    @UI.Hidden;

    @Precision: 11
    @Scale:3 
    @sap.unit: 'uom'
    quantity;

    @sap.semantics: 'unit-of-measure'
    @readonly
    uom;

    @Common.SemanticObject : 'Plant'
    to_plant @Common : {
        Text            : to_plant.name,
        TextArrangement : #TextFirst,
        ValueListWithFixedValues
    };

    @Common.SemanticObject : 'Material'
    @mandatory
    to_material @Common : {
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
                {
                    $Type             : 'Common.ValueListParameterIn',
                    LocalDataProperty : to_plant_code,
                    ValueListProperty : 'to_plant_code'
                },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'identifier' },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'descr' },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'version' },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'to_status_code' },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'currentVersion' },
                ]
            },
    };
    
    //Status Filter Item
    to_status @Common : {
        Text            : to_status.descr,
        TextArrangement : #TextOnly,
        ValueListWithFixedValues
    };

    //@Common.SemanticObject : 'Operation'
    to_orderOperations @Common : {
        Text            : to_orderOperations.to_operations.combo,
        TextArrangement : #TextOnly
    };
    to_orderPhases @Common : {
        Text            : to_orderPhases.to_phases.combo,
        TextArrangement : #TextOnly
    };

    @Common.SemanticObject : 'Order'
    @mandatory
    to_order @Common : {
        Text            : to_order.identifier,
        TextArrangement : #TextOnly,
        ValueList                : {
                CollectionPath : 'Orders',
                SearchSupported : true,
                Parameters     : [{
                    $Type             : 'Common.ValueListParameterInOut',
                    LocalDataProperty : to_order_ID,
                    ValueListProperty : 'identifier'
                },
                {
                    $Type             : 'Common.ValueListParameterIn',
                    LocalDataProperty : to_plant_code,
                    ValueListProperty : 'to_plant_code'
                },
                { $Type:'Common.ValueListParameterDisplayOnly', ValueListProperty:'to_status_code' },
                ]
            },
    };
}
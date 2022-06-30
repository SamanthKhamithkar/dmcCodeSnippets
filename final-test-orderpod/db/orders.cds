namespace scp.dmc;

using scp.dmc.Url from './common';
using scp.dmc.TechnicalBooleanFlag from './common';
using scp.dmc.TechnicalString from './common';
using scp.dmc.TechnicalFieldControlFlag from './common';
using scp.dmc.Criticality from './common';
using scp.dmc.Identifier from './common';
using scp.dmc.identified from './common';
using scp.dmc.Materials from './material';
using scp.dmc.Billofmaterials from './boms';
using scp.dmc.OrderComponents from './boms';
using scp.dmc.Components from './boms';
using scp.dmc.Batches from './SFCs';
using scp.cloud.Plant from './schema';
using scp.cloud.Customer from './schema';
using scp.cloud.Users from './schema';
using scp.dmc.Serials from './SFCs';
using scp.dmc.Routings from './routing';
using scp.dmc.Operations from './routing';

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';




//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.


entity Orders : managed, identified {
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  quantity                                          : Integer                                       @title : '{i18n>QuantityTotal}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  quantityReleased                                  : Integer default '0'                           @title : '{i18n>QuantityReleased}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  quantityProduced                                  : Integer default '0'                           @title : '{i18n>QuantityProduced}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  quantityScrap                                     : Integer default '0'                           @title : '{i18n>QuantityScrap}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  quantityReleasable                                : Integer default '0'                           @title : '{i18n>QuantityReleasable}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  @Aggregation.default : #COUNT
  quantityOpen                                      : Integer default '0'                           @title : '{i18n>QuantityOpen}';
  isERP                                             : Boolean not null default false                @title : '{i18n>ERP}';
  start                                             : Timestamp                @title : '{i18n>Start}';
  end                                               : Timestamp                @title : '{i18n>End}';
  plannedStart                                      : Timestamp                @title : '{i18n>PlannedStart}';
  plannedEnd                                        : Timestamp                @title : '{i18n>PlannedEnd}';
  scheduledStart                                    : Timestamp                @title : '{i18n>ScheduledStart}';
  scheduledEnd                                      : Timestamp                @title : '{i18n>ScheduledEnd}';
  scheduledRelease                                  : Date                @title : '{i18n>ScheduledRelease}';
  /*Fake Stuff*/
  milestone                                         : String(50) default 'DELO'                           @title : '{i18n>Milestone}';
  controller                                        : String(50) default '001 (PERSON 1)'                           @title : '{i18n>MRPController}';
  supervisor                                        : String(50) default 'DMO (Mechanical Parts Team)'                           @title : '{i18n>Supervisor}';
  element                                           : String(50) default 'DN_5 (DN_5)'                           @title : '{i18n>WBSElement}';
  project                                           : String(50) default 'DN_5 (DN_5)'                           @title : '{i18n>Project}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  GRQuantity                                        : Integer default '0'                           @title : '{i18n>GRQuantity}';
  @Semantics.quantity.unitOfMeasure: 'to_uom_code'
  YieldDeviation                                    : Integer default '0'                           @title : '{i18n>YieldDeviation}';
  matTest                                           : String default ''                           @title : '{i18n>Material}';
  //to_order_ID                                       : UUID @(title : '{i18n>Ordernumber}');

  /*Discret Manufacturing*/
  isNotDicrete                                      : TechnicalBooleanFlag not null default true;
  defectsCount                                      : String default '(2)'                                      @title : '{i18n>Defects}';
  @assert.integrity       : false
  to_currentOperation                               : Association to one OrderOperations                  @title : '{i18n>CurrentOperation}';
  /*Process Manufacturing*/
  isNotProcess                                      : TechnicalBooleanFlag not null default true;
  @assert.integrity       : false
  to_currentPhase                                   : Association to one OrderPhases                  @title : '{i18n>CurrentPhase}';
  batch                                             : String(3)                                     @title : '{i18n>Batch}';
  /* Navigation */
  @assert.integrity                                 : false
  to_material                                       : Association to one Materials                  @title : '{i18n>Material}';
  @assert.integrity       : false
  to_status                                         : Association to one OrderStatus                @title : '{i18n>Status}';
  @assert.integrity       : false
  to_activity_status                                : Association to one ActivityStatus                @title : '{i18n>Active}';
  @assert.integrity       : false
  to_bom                                            : Association to one Billofmaterials                  @title : '{i18n>BOM}';
  /*Discret Manufacturing*/
  @assert.integrity       : false
  to_routing                                        : Association to one Routings                                    @title : '{i18n>Routing}';
  to_routing_operations                             : Association to many OrderOperations on to_routing_operations.to_order = $self;
  /*Process Manufacturing*/
  @assert.integrity       : false
  to_recipe                                      : Association to one Routings                                       @title : '{i18n>Recipe}';
  @assert.integrity       : false
  to_phases                                         : Association to many OrderPhases on to_phases.to_order = $self;
  @assert.integrity       : false
  to_quantity_confirmations                         : Composition of many OrderQuantityConfirmations on to_quantity_confirmations.to_order = $self;
  @assert.integrity       : false
  to_confirmations                                  : Composition of many OrderConfirmations on to_confirmations.to_order = $self;
  @assert.integrity       : false
  to_goods_receipt                                  : Composition of many GoodsReceipt on to_goods_receipt.to_order = $self;
  @assert.integrity       : false
  to_goods_issue                                    : Composition of many GoodsIssues on to_goods_issue.to_order = $self;
  @assert.integrity       : false
  to_inspections                                    : Composition of many OrderInspections on to_inspections.to_order = $self;
  @assert.integrity       : false
  to_defects                                        : Composition of many OrderDefects on to_defects.to_order = $self;
  to_productionType_code                            : String(10)                                     @title : '{i18n>ProductionType}';
  to_prio                                           : Association to one OrderPriority                                     @title : '{i18n>Prio}';
  to_customer_order_code : String(10)                                     @title : '{i18n>Customer}';
  @assert.integrity       : false
  to_plant                                          : Association to one Plant @title : '{i18n>ProductionPlant}';
  @assert.integrity       : false
  to_plant1                                          : Association to one Plant @title : '{i18n>PlanningPlant}';
  to_SFCs                                           : Composition of many Serials on to_SFCs.to_order = $self;
  @assert.integrity       : false
  to_components              : Composition of many Components on to_components.to_order = $self;
  @assert.integrity       : false
  to_batches              : Composition of many Batches on to_batches.to_order = $self;
  
  @assert.integrity       : false
  to_customer                : Association to one Customer       @title : '{i18n>Customer}';
  @assert.integrity       : false
  hasIssues : Composition of one OrderIssues on hasIssues.to_order = $self;
  @assert.integrity       : false
  to_issuelist              : Composition of many OrderIssuesList on to_issuelist.to_order = $self;
  @assert.integrity       : false
  to_ordertype              : Association to one OrderType @title : '{i18n>OrderType}';
  @Semantics.unitOfMeasure
  to_uom                    : Association to one UOM                          @title : '{i18n>UOM}';

  @assert.integrity : false
  modifiedByNav                            : Association to one Users /*@cds.on.insert : $user @cds.on.update : $user*/ @title : '{i18n>ChangedBy}';
  // @assert.integrity : false
  createdByNav                            : Association to one Users /*@cds.on.insert : $user*/ @title : '{i18n>CreatedBy}';

  to_storageLocation_code : String default 'Location 002 (002)' @title : '{i18n>StorageLocation}';
  to_batch_code : String default '187556788' @title : '{i18n>Batch}';
  

                                                      

  /*Technical Settings*/
  isDraft                         : TechnicalBooleanFlag not null default true;
  isNew                         : TechnicalBooleanFlag not null default true;
  hasDefects                       : TechnicalBooleanFlag not null default false;
  Delete_mc                       : TechnicalBooleanFlag not null default false;
  Edit_mc                         : TechnicalBooleanFlag not null default false;
  Release_ac                      : TechnicalBooleanFlag not null default false;
  Discard_ac                      : TechnicalBooleanFlag not null default false;
  Hold_ac                         : TechnicalBooleanFlag not null default true;
  Prio_ac                         : TechnicalBooleanFlag not null default true;
  Reset_ac                        : TechnicalBooleanFlag not null default false;
  Change_ac                       : TechnicalBooleanFlag not null default false;
  hidePlanned                    : TechnicalBooleanFlag not null default true;
  hideScheduled                  : TechnicalBooleanFlag not null default true;
  hideActive                     : TechnicalBooleanFlag not null default true;
  //hasIssues               : TechnicalBooleanFlag not null default false;
  plantFieldControl  : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
  FieldControl  : TechnicalFieldControlFlag not null default 0; // 7 = #Mandatory;
  materialProcessFieldControl  : TechnicalFieldControlFlag not null default 0; // 7 = #Mandatory;
  materialProductionFieldControl  : TechnicalFieldControlFlag not null default 0; // 7 = #Mandatory;
  createFieldControl  : TechnicalFieldControlFlag not null default 0; // 7 = #Mandatory;
  createMandatoryFieldControl  : TechnicalFieldControlFlag not null default 0; // 7 = #Mandatory;
  hold_code : TechnicalString default 'S1';
  issueHoldsCrititcality : String not null default 'Error';
  issueTimeCrititcality : String not null default 'None';
  issueComponentCrititcality : String not null default 'None';
  issueQualityCrititcality : String not null default 'None';

  /*Not needed if Hana DB is used */
  issueComponent                                    : TechnicalBooleanFlag  default false;
  issueTime                                    : TechnicalBooleanFlag default false;
  issueHolds                                    : TechnicalBooleanFlag default false;
  issueQuality                                    : TechnicalBooleanFlag default false;
  issueDimension                                    : TechnicalBooleanFlag default false;
  timezone: String;


}

entity OrderStatus : common.CodeList {
  key code : String;
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 3;

  to_orderstatusoverview                                           : Association to many OrderStatusOverview 
                                                      on to_orderstatusoverview.to_orderstatus = $self;
}
entity ActivityStatus : common.CodeList {
  key code : String;
  criticality : Criticality not null default 3;
}

entity OrderStatusOverview {
  key ID : UUID;
  descr:localized String;
  sortedBy:Integer;
  /* Navigation */
  to_orderstatus                                           : Association to one OrderStatus;
}
entity OrderPriority : common.CodeList {
  key code : String;
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 3;
}

entity OrderOperationsAndPhases : managed, cuid{
  startTime:DateTime @title : '{i18n>Start}';
  endTime:DateTime @title : '{i18n>End}';
  quantity:Integer @title : '{i18n>Quantity}';
  quantityProduced:Integer @title : '{i18n>QuantityProduced}';
  criticality : Criticality not null default 3;
  /* Navigation */
  to_order                                          : Association to one Orders                     @title : '{i18n>Order}';
  to_SFCs                                           : Association to many Serials 
                                                      on to_SFCs.to_orderOperationsAndPhases = $self;
  to_status                                         : Association to one OrderStatus                @title : '{i18n>Status}';
  to_operations                                     : Association to one Operations                     @title : '{i18n>Operation}';
}
entity OrderOperations as select from OrderOperationsAndPhases {
  ID,
  to_order,
  to_operations, 
  to_operations.operation as operation,
  to_operations.descr as operationDescr, 
  to_SFCs, 
  to_status, 
  startTime, 
  endTime,
  quantity,
  quantityProduced,
  criticality, 
  to_operations.to_workcenter.name as workcenter, 
  to_operations.to_workcenter.type as workcentertype, 
  to_order.to_material.to_uom.code as uom, 
  to_operations.to_operationAndPhasesGroup.group as operationGroup
};
entity OrderPhases as select from OrderOperationsAndPhases {
  ID,
  to_order, 
  to_operations.operation as phase,
  to_operations.descr as phaseDescr, 
  to_SFCs, 
  to_status, 
  startTime, 
  endTime,
  quantity,
  quantityProduced,
  criticality, 
  to_operations.to_workcenter.name as workcenter, 
  to_operations.to_workcenter.type as workcentertype, 
  to_order.to_material.to_uom.code as uom, 
  to_operations.to_operationAndPhasesGroup.group as phaseGroup
};


entity OrderOperationsAndPhases2 as select from OrderOperationsAndPhases {
  ID,to_order, to_operations, to_SFCs, to_status, startTime, endTime,quantity,quantityProduced,criticality, //to_operations.workcenter as workcenter, to_operations.workcentertype as workcentertype,
};

entity Phases : common.CodeList {
  key code : String;
  text :localized String;
  combo :localized String;
  workcenter:String @title : '{i18n>WorkCenter}';
  workcentertype:localized String;
}

entity Holds : common.CodeList {
  key code : String;
}
entity ReasonCodes : common.CodeList {
  key code : String;
}
entity OrderType : common.CodeList {
  key code : String;
}
entity UOM : common.CodeList {
  key code                  : String;
  isocode                   : localized String(3)         @title : '{i18n>Isocode}';
  dimension                 : localized String   @title : '{i18n>Dimension}';
}
entity OrderIssues : cuid {
  issueComponent : TechnicalBooleanFlag default false;
  issueComponentCrititcality : String default 'None';
  issueTime : TechnicalBooleanFlag default false;
  issueTimeCrititcality : String default 'None';
  issueHolds : TechnicalBooleanFlag default false;
  issueHoldsCrititcality : String default 'None';
  issueQuality : TechnicalBooleanFlag default false;
  issueQualityCrititcality : String default 'None';
  issueDimension : TechnicalBooleanFlag default false;
  issueDimensionCrititcality : String default 'None';
  issueOrderCrititcality : Criticality not null default 3;
  to_order                             : Association to one Orders;
  to_SFC                                : Association to one Serials;
}

entity OrderIssuesList : cuid {
  descr  : localized String;
  details  : localized String;
  descrLong  : localized String;
  link  : localized String;
  Crititcality : String default 'Error';
  icon : String;
  sortedBy  : Integer;
  type :  String;
  to_order                             : Association to one Orders;
  to_SFC                             : Association to one Serials;
}

entity OrderQuantityConfirmations : cuid, managed {
  key ID: UUID;
  confirmationNO                                      : String(15)                                        @title : '{i18n>Confirmation}';
  confirmationCounter                                 : Integer                                       @title : '{i18n>ConfirmationCount}'; 	
  reversed                                            : Boolean default false                         @title : '{i18n>Reversed}';
  reversal                                            : Boolean default false                         @title : '{i18n>Reversal}';
  reversedCounter                                     : Integer                                       @title : '{i18n>ReversedCount}'; 
  finalConfirmation                                   : Boolean default false                         @title : '{i18n>FinalConfirmation}';
  @Semantics.quantity.unitOfMeasure: 'uom'
  quantity                                            : Integer                                       @title : '{i18n>Quantity}';
  @Semantics.quantity.unitOfMeasure: 'uom'
  produced                                            : Integer default '0'                           @title : '{i18n>Produced}';
  @Semantics.quantity.unitOfMeasure: 'uom'
  scrap                                               : Integer default '0'                           @title : '{i18n>Scrap}';
  @Semantics.quantity.unitOfMeasure: 'uom'
  rework                                              : Integer default '0'                           @title : '{i18n>Rework}';
  @Semantics.unitOfMeasure
  to_uom                                              : Association to one UOM                          @title : '{i18n>UOM}';
  /*Navigation*/
  to_order                                            : Association to one Orders                     @title : '{i18n>Order}';
  to_orderOperationsAndPhases                         : Association to one OrderOperationsAndPhases   @title : '{i18n>OperationPhase}';
  to_SFC                                              : Association to one Serials                    @title : '{i18n>SFC}';
  createdByNav                                        : Association to one Users                      @title : '{i18n>ConfirmedBy}';
  notCancelled : TechnicalBooleanFlag default false;
}

entity OrderConfirmations : cuid, managed {
  key ID: UUID;
  confirmationNO                                      : String(15)                                        @title : '{i18n>Confirmation}';
  confirmationCounter                                 : Integer                                       @title : '{i18n>ConfirmationCount}'; 	
  reversed                                            : Boolean default false                         @title : '{i18n>Reversed}';
  reversal                                            : Boolean default false                         @title : '{i18n>Reversal}';
  reversedCounter                                     : Integer                                       @title : '{i18n>ReversedCount}'; 
  finalConfirmation                                   : Boolean default false                         @title : '{i18n>FinalConfirmation}';
  hours                                               : Integer                                       @title : '{i18n>HRHours}';
  to_uom_hours                                        : Association to one UOM                          @title : '{i18n>UOM}';
  machineHours                                        : Integer                                       @title : '{i18n>MachineHours}';
  to_uom_machineHours                                 : Association to one UOM                          @title : '{i18n>UOM}';
  energy                                              : Integer                                       @title : '{i18n>Energy}';
  to_uom_energy                                       : Association to one UOM                          @title : '{i18n>UOM}';
  steam                                               : Integer                                       @title : '{i18n>Steam}';
  to_uom_steam                                        : Association to one UOM                          @title : '{i18n>UOM}';
  
  /*Navigation*/
  to_order                                            : Association to one Orders                       @title : '{i18n>Order}';
  to_orderOperationsAndPhases                       : Association to one OrderOperationsAndPhases            @title : '{i18n>OperationPhase}';
  createdByNav                                        : Association to one Users /*@cds.on.insert : $user*/ @title : '{i18n>ConfirmedBy}';
  notCancelled : TechnicalBooleanFlag default false;
}

entity OrderInspections : cuid {
  key ID: UUID;
  lotNO                                               : String                                    @title : '{i18n>InspectionLotNumber}';
  lotType                                             : String                                       @title : '{i18n>InspectionLotType}'; 	
  characteristics                                     : Integer                                       @title : '{i18n>NumberofCharacteristics}';
  characteristicsProgress                             : Integer                                       @title : '{i18n>ProgressofCharacteristics}';
  operations                                          : Integer                                       @title : '{i18n>NoOfOperations}';
  usageDecisionCode                                   : String(15)                                    @title : '{i18n>UsageDecisionCode}'; 
  quantity                                            : Integer                                       @title : '{i18n>Quantity}';
  actualQuantity                                      : Integer                                       @title : '{i18n>QuantityActual}';
  uom                                                 : localized String(3)                           @title : '{i18n>UOM}';
  descr                                               : localized String                              @title : '{i18n>Description}';
  /*Navigation*/
  to_order                                            : Association to one Orders                       @title : '{i18n>Order}';
}

entity OrderDefects : cuid {
  key ID: UUID;
  defect                                                : String(15)                                    @title : '{i18n>Defect}';
  notification                                          : String                                        @title : '{i18n>Notification}'; 	
  item                                                  : Integer                                       @title : '{i18n>Item}';
  defectCode                                            : Integer                                       @title : '{i18n>DefectCode}';
  decision                                              : String(15)                                    @title : '{i18n>Decision}'; 
  batch                                                 : Integer                                       @title : '{i18n>Batch}';
  defectCategory                                        : String                                        @title : '{i18n>DefectCategory}';
  uom                                                   : localized String(3)                           @title : '{i18n>UOM}';
  descr                                                 : localized String                              @title : '{i18n>Description}';
  /*Navigation*/
  to_order                                              : Association to one Orders                     @title : '{i18n>Order}';
  date : DateTime default $now;
}

entity GoodsReceiptIssues : cuid, managed {
  key ID: UUID;
  inventoryID                                         : String(15)                                        @title : '{i18n>InventoryID}';
  comments                                            : String default 'Some comment'                     @title : '{i18n>Comments}';
  reversed                                            : Boolean default false                             @title : '{i18n>Reversed}';
  type                                                : String default 'EWM'                              @title : '{i18n>Type}';
  @Semantics.quantity.unitOfMeasure: 'uom'
  quantity                                            : Decimal default '80'                              @title : '{i18n>Quantity}';
  @Semantics.unitOfMeasure
  to_uom                                              : Association to one UOM                            @title : '{i18n>UOM}';
  /*Navigation*/
  to_order                                            : Association to one Orders                         @title : '{i18n>Order}';
  to_SFC                                              : Association to one Serials                        @title : '{i18n>SFC}';
  createdByNav                                        : Association to one Users                          @title : '{i18n>ConfirmedBy}';
  notCancelled                                        : TechnicalBooleanFlag default false;
  isIssue                                             : TechnicalBooleanFlag;
  to_batch_code                                       : String default '187556788'                        @title : '{i18n>Batch}';
  to_storageLocation_code                             : String default 'Location 002 (002)'               @title : '{i18n>StorageLocation}';
  to_receiptType                                      : Association to one ReceiptTypes                   @title : '{i18n>ReceiptType}';
  to_material                                         : Association to one Materials                      @title : '{i18n>Material}';
}

entity GoodsIssues as select from GoodsReceiptIssues {
  *,
  to_order.to_material as to_material,
} where GoodsReceiptIssues.isIssue = true;

entity GoodsReceipt as select from GoodsReceiptIssues {
  *,
} where GoodsReceiptIssues.isIssue = false;

entity ReceiptTypes : common.CodeList {
  key code               : String;
  type                   : localized String(3)         @title : '{i18n>Type}';
}

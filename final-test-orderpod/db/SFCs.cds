namespace scp.dmc;

using scp.dmc.Url from './common';
using scp.dmc.TechnicalBooleanFlag from './common';
using scp.dmc.TechnicalFieldControlFlag from './common';
using scp.dmc.Criticality from './common';
using scp.dmc.Identifier from './common';
using scp.dmc.identified from './common';
using scp.dmc.Orders from './orders';
using scp.dmc.UOM from './orders';
using scp.dmc.OrderIssuesList from './orders';
using scp.dmc.OrderIssues from './orders';
using scp.dmc.OrderOperationsAndPhases from './orders';
using scp.dmc.OrderPhases from './orders';
using scp.dmc.OrderQuantityConfirmations from './orders';
using scp.dmc.OrderStatus from './orders';
using scp.dmc.Materials from './material';
using scp.dmc.ComponentsToSFCs from './boms';
using scp.cloud.Plant from './schema';

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';

//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.
@title : '{i18n>SFC}'
entity Serials {
  key ID                          : UUID;
      identifier                  : String                                      @title         : '{i18n>SFC}';
      //@Semantics.quantity.unitOfMeasure: 'uom'
      quantity                    : Double                                      @title         : '{i18n>Quantity}';
      //@Semantics.unitOfMeasure
      uom                         : String(3)                                   @title         : '{i18n>UOM}';
      /* Navigation */
      to_order                    : Association to one Orders                   @title         : '{i18n>Order}';
      to_status                   : Association to one SFCStatus                @title         : '{i18n>Status}';
      to_orderOperationsAndPhases : Association to one OrderOperationsAndPhases @title         : '{i18n>OperationPhase}';
      to_plant                    : Association to one Plant                    @title         : '{i18n>Plant}';
      to_material                 : Association to one Materials                @title         : '{i18n>Material}';
      to_components               : Association to many ComponentsToSFCs
                                      on to_components.to_SFC = $self;
      to_issuelist                : Composition of many OrderIssuesList
                                      on to_issuelist.to_SFC = $self;
      hasIssues                   : Composition of one OrderIssues
                                      on hasIssues.to_SFC = $self;
      to_operations               : Composition of many SFCOperationList
                                      on to_operations.to_SFC = $self;
      to_phases                   : Composition of many SFCPhasesList
                                      on to_phases.to_SFC = $self;
      to_quantityConfirmations    : Association to many OrderQuantityConfirmations
                                      on to_quantityConfirmations.to_SFC = $self;
      to_confirmations            : Composition of many SFCToOrderConfirmations
                                      on to_confirmations.to_SFC = $self;

      /*Technical Settings*/
      isNew                       : TechnicalBooleanFlag not null default true; //To emit new SFCs to the front end
      StartSFC_ac                 : TechnicalBooleanFlag not null default false;
      StopSFC_ac                  : TechnicalBooleanFlag not null default false;
      isNotProcess                : TechnicalBooleanFlag not null default true;
      isNotDicrete                : TechnicalBooleanFlag not null default true;
      /*Not needed if Hana DB is used */
      issueComponent              : TechnicalBooleanFlag default false;
      issueTime                   : TechnicalBooleanFlag default false;
      issueHolds                  : TechnicalBooleanFlag default false;
      issueQuality                : TechnicalBooleanFlag default false;
      issueDimension              : TechnicalBooleanFlag default false;
      /*Managed*/
      createdAt                   : Timestamp                                   @cds.on.insert : $now  @title          : '{i18n>CREATED_ON}';
      createdBy                   : String                                      @cds.on.insert : $user  @title         : '{i18n>CREATED_BY}';
      modifiedAt                  : Timestamp                                   @cds.on.insert : $now  @cds.on.update  : $now  @title  : '{i18n>MODIFIED_ON}';
      modifiedBy                  : String                                      @cds.on.insert : $user  @cds.on.update : $user  @title : '{i18n>MODIFIED_BY}';
      /*FAKE*/
      defaultBatch                : String(50) default '54888457';
      FieldControl                : TechnicalFieldControlFlag not null default 0; // 7 = #Mandatory;                          @title : '{i18n>defaultBatch}';
}

entity SFCStatus : common.CodeList {
  key code             : String;
      criticality      : Criticality not null default 3;
      criticalitytable : Criticality not null default 3;
}

@title : '{i18n>Batches}'
entity Batches : managed {
  key ID             : UUID;
      identifier     : String                                    @title : '{i18n>Batch}';
      @Semantics.quantity.unitOfMeasure :                                 'uom'
      quantity       : Integer                                   @title : '{i18n>Quantity}';
      @Semantics.unitOfMeasure
      uom            : String(3)                                 @title : '{i18n>UOM}';

      /*Fake Stuff*/
      to_silo_ID     : String(50) default 'Silo 1072 (SL1072)'   @title : '{i18n>SiloID}';
      to_storage_ID  : String(50) default 'Location 101B (101B)' @title : '{i18n>StorageLocation}';
      /* Navigation */
      to_order       : Association to one Orders                 @title : '{i18n>Order}';
      to_status      : Association to one SFCStatus              @title : '{i18n>Status}';
      to_orderPhases : Association to one OrderPhases            @title : '{i18n>Phase}';
      to_plant       : Association to one Plant                  @title : '{i18n>Plant}';
      to_material    : Association to one Materials              @title : '{i18n>Material}';
      /*Technical Settings*/
      isNew          : TechnicalBooleanFlag not null default true; //To emit new SFCs to the front end
}

@cds.redirection.target : true
entity SFCToOperationPhasesList : cuid {
  to_step          : Association to one OrderOperationsAndPhases @title : '{i18n>OperationPhase}';
  to_SFC           : Association to one Serials;
  quantity         : Integer                                     @title : '{i18n>Quantity}'  @Measures.Unit         : to_SFC.to_material.to_uom.descr;
  quantityProduced : Integer                                     @title : '{i18n>QuantityProduced}'  @Measures.Unit : to_SFC.to_material.to_uom.descr;
  quantityPending  : Integer                                     @title : '{i18n>QuantityPending}'  @Measures.Unit  : to_SFC.to_material.to_uom.descr;
  quantityInWork   : Integer                                     @title : '{i18n>QuantityInWork}'  @Measures.Unit   : to_SFC.to_material.to_uom.descr;
  quantityQueue    : Integer                                     @title : '{i18n>QuantityQueue}'  @Measures.Unit    : to_SFC.to_material.to_uom.descr;
  to_status        : Association to one SFCStatus                @title : '{i18n>Status}';
  @assert.integrity :                                                     false
  to_consumptions  : Composition of many MaterialConsumptions
                       on to_consumptions.to_SFCToOperationPhasesList = $self;
  criticality      : Criticality not null default 3;
  startTime        : DateTime                                    @title : '{i18n>Start}';
  endTime          : DateTime                                    @title : '{i18n>End}';
  type             : String;
  isCurrent        : TechnicalBooleanFlag;
  Start_ac         : TechnicalBooleanFlag default false;
  Complete_ac      : TechnicalBooleanFlag default false;
  ChangeDates_ac   : TechnicalBooleanFlag default false;
  Edit_ac          : TechnicalBooleanFlag default true;
}

entity MaterialConsumptions : cuid, managed {
  //key ID : UUID;
  to_SFCToOperationPhasesList : Association to one SFCToOperationPhasesList;
  to_material                 : Association to one Materials @title : 'Material';
  threshold                   : Decimal                      @title : 'Threshold';
  postedValue                 : Decimal                      @title : 'Posted Value'  @Measures.Unit          : to_uom.descr;
  quantityPosted              : Decimal                      @title : '{i18n>QuantityPosted}'  @Measures.Unit : to_uom.descr;
  quantity                    : Decimal                      @title : '{i18n>Quantity}'  @Measures.Unit       : to_uom.descr;
  to_batch                    : Association to one Batches   @title : 'Batch Number';
  to_storage                  : Association to one Storages  @title : 'Storage Location';
  @assert.integrity :                                                 false
  to_uom                      : Association to one UOM       @title : '{i18n>UOM}';
  info                        : TechnicalBooleanFlag default false;
  criticality                 : Criticality not null default 3;
  criticalityprogress         : Criticality not null default 3;
// criticalitytable : Criticality not null default 3;
}

entity Storages : common.CodeList {
  key code : String
}

@cds.redirection.target : true
entity SFCOperationList     as
  select from dmc.SFCToOperationPhasesList {
    ID,
    to_step.to_order,
    to_step.to_operations,
    to_step.to_operations.operation                        as operation,
    to_step.to_operations.descr                            as operationDescr,
    to_status,
    startTime,
    endTime,
    to_SFC,
    quantity,
    quantityProduced,
    quantityPending,
    quantityQueue,
    quantityInWork,
    criticality,
    isCurrent,
    to_consumptions,
    to_step.to_status                                      as to_operationStatus,
    to_step.to_operations.to_workcenter.name               as workcenter,
    to_step.to_operations.to_workcenter.type               as workcentertype,
    to_step.to_operations.to_workcenter.ID                 as to_workcenter,
    to_step.to_order.to_material.to_uom.code               as to_uom_code,
    to_step.to_operations.to_operationAndPhasesGroup.group as operationGroup

  }
  where
    SFCToOperationPhasesList.type = 'operation';

entity SFCPhasesList        as
  select from dmc.SFCToOperationPhasesList {
    ID,
    to_step.to_order,
    to_step.to_operations,
    to_step.to_operations.operation                        as phase,
    to_step.to_operations.descr                            as phaseDescr,
    to_status,
    startTime,
    endTime,
    to_SFC,
    quantity,
    quantityProduced,
    quantityPending,
    quantityQueue,
    quantityInWork,
    criticality,
    isCurrent,
    Start_ac,
    Complete_ac,
    ChangeDates_ac,
    Edit_ac,
    to_consumptions,
    to_step.to_status                                      as to_phaseStatus,
    to_step.to_operations.to_workcenter.name               as workcenter,
    to_step.to_operations.to_workcenter.type               as workcentertype,
    to_step.to_operations.to_workcenter.ID                 as to_workcenter,
    to_step.to_order.to_material.to_uom.code               as to_uom_code,
    to_step.to_operations.to_operationAndPhasesGroup.group as phaseGroup
  }
  where
    SFCToOperationPhasesList.type = 'phase';

entity SFCToOrderConfirmations : cuid {
  to_confirmation : Association to one OrderQuantityConfirmations @title : '{i18n>OperationPhase}';
  to_SFC          : Association to one Serials;
  quantity        : Integer                                       @title : '{i18n>Quantity}';
  produced        : Integer default '0'                           @title : '{i18n>Produced}';
  scrap           : Integer default '0'                           @title : '{i18n>Scrap}';
  rework          : Integer default '0'                           @title : '{i18n>Rework}';
}

entity SFCConfirmationsList as
  select from SFCToOrderConfirmations {
    ID,
    to_SFC,
    to_confirmation,
    to_confirmation.confirmationNO      as confirmationNO,
    to_confirmation.confirmationCounter as confirmationCounter,
    to_confirmation.reversed,
    to_confirmation.reversal,
    to_confirmation.reversedCounter,
    to_confirmation.finalConfirmation,
    quantity,
    produced,
    scrap,
    rework,
    to_confirmation.to_uom,
    to_confirmation.createdAt,
    /*Navigation*/
    to_confirmation.to_order,
    to_confirmation.to_orderOperationsAndPhases,
    to_confirmation.createdByNav,
  };

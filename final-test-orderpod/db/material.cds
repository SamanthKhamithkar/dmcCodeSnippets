namespace scp.dmc;

using scp.dmc.Url from './common';
using scp.dmc.TechnicalBooleanFlag from './common';
using scp.dmc.TechnicalFieldControlFlag from './common';
using scp.dmc.Criticality from './common';
using scp.dmc.Identifier from './common';
using scp.dmc.identified from './common';
using scp.dmc.Orders from './orders';
using scp.dmc.UOM from './orders';
using scp.dmc.OrderStatus from './orders';
using scp.dmc.Billofmaterials from './boms';
using scp.cloud.Plant from './schema';

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';




//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.

entity Materials : managed, identified {
  version                                          : String                                 @title : '{i18n>Version}';
  descr                                             : localized String(500)                            @title : '{i18n>Description}';
  currentVersion                                          : Boolean                                 @title : '{i18n>CurrentVersion}';
  //uom                                                 : String(2)                            @title : '{i18n>UOM}';
  to_orders                 : Association to many Orders
                              on to_orders.to_material = $self;
  to_materialType_code                                          : String                                 @title : 'Material Type';
  to_procurementType_code                                           : String                                 @title : 'Procurement Type';
  to_materialMethod_code                                           : String                                 @title : 'Method';
  to_boms                                          : Association to one Billofmaterials                                 @title : '{i18n>BOM}';
  to_routings_ID                                          : String                                 @title : '{i18n>Routing}';
  to_status                                         : Association to one OrderStatus                @title : '{i18n>Status}';
  to_plant                                          : Association to one Plant @title : '{i18n>Plant}';
  to_plantProduction                                : Association to one Plant @title : '{i18n>ProductionPlant}';
  returnable                                          : String                                 @title : 'Returnable Material';
  nameCombo : String                                 @title : '{i18n>Material}';

  to_uom                    : Association to one UOM                          @title : '{i18n>UOM}';

  /*Fake*/
  processing : localized String default 'Sequential' @title : '{i18n>Processing}';
  type : localized String default 'SFC-Based' @title : '{i18n>ProductionType}';
  lotSize : String default '1' @title : '{i18n>LotSize}';
  to_storageLocation_code                           : String default 'Location 002 (002)'                         @title : '{i18n>StorageLocation}';
  controller                                        : String(50) default '001 (PERSON 1)'                         @title : '{i18n>MRPController}';
  supervisor                                        : String(50) default 'DMO (Mechanical Parts Team)'            @title : '{i18n>Supervisor}';
  // element                                           : String(50) default 'DN_5 (DN_5)'                            @title : '{i18n>WBSElement}';
  // project                                           : String(50) default 'DN_5 (DN_5)'                            @title : '{i18n>Project}';
  unrestrictedUseStock                              : Integer default '2'                                         @title : '{i18n>UnrestrictedUseStock}';
  restricedUseStock                                 : Integer default '0'                                         @title : '{i18n>RestrictedUseStock}';
  to_serialNumberProfile                            : Association to one SerialNumberProfiles          @title : '{i18n>SerialNumberProfile}';
  //to_serialNumberProfile_code : localized String(50) default 'Integrated serial no (0001)'            @title : '{i18n>SerialNumberProfile}';
  batchRecordRequired                               : Boolean default true                                       @title : '{i18n>BatchRecordRequired}';
  underdeliveryTolerance                            : Integer default '0'                                         @title : '{i18n>UnderdeliveryTolerance}';
  overdeliveryTolerance                             : Integer default '0'                                         @title : '{i18n>OverdeliveryTolerance}';
  MRPType                                           : localized String(50) default 'MRP (PD)'                               @title : '{i18n>MRPType}';
  procurementType                                   : localized String(50) default 'Both procurement types'                 @title : '{i18n>ProcurementType}';
  safetyStock                                       : Integer default '0'                                         @title : '{i18n>SafetyStock}';
  isProcess                                          : TechnicalBooleanFlag not null default false;


}


entity SerialNumberProfiles {
  key code : String(4);
  descr : localized String(50) default 'Integrated serial no (0001)'            @title : '{i18n>SerialNumberProfile}';
}
entity MRPTypes {
  key code : String(4);
  descr : localized String(50) default 'MRP (PD)'                               @title : '{i18n>MRPType}';
}
entity ProcurementTypes {
  key code : String(4);
  descr : localized String(50) default 'Both procurement types'                 @title : '{i18n>ProcurementType}';
}
entity StorageLocations {
  key code : String(4);
  descr : localized String(50) default '001'                 @title : '{i18n>StorageLocation}';
}

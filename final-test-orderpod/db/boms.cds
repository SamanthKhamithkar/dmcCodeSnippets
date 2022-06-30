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
using scp.dmc.Materials from './material';
using scp.dmc.Serials from './SFCs';
using scp.cloud.Plant from './schema';

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';




//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.

entity Billofmaterials : managed, identified {
  type                                          : String                                 @title : '{i18n>Type}';
  currentVersion                                          : Boolean                                 @title : '{i18n>CurrentVersion}';
  version                                          : String                                 @title : '{i18n>Version}';
  to_orders                 : Association to many Orders
                              on to_orders.to_bom = $self;
  to_material              : Association to one Materials    ;      
  to_components              : Association to many Components
                              on to_components.to_bom = $self;
  to_status                                         : Association to one OrderStatus                @title : '{i18n>Status}';
  to_plant                                          : Association to one Plant @title : '{i18n>Plant}';
  to_plantProduction                                : Association to one Plant @title : '{i18n>ProductionPlant}';
}
entity BOMComponents : managed,cuid {
  to_material              : Association to one Materials    @title : '{i18n>Material}'; 
  to_bom              : Association to one Billofmaterials    @title : '{i18n>BOM}'; 
  quantity                                          : Integer                                       @title : '{i18n>Quantity}';
}
entity OrderComponents : managed, cuid {
  to_material              : Association to one Materials    @title : '{i18n>Material}';  
  to_order              : Association to one Orders    ; 
  quantity                                          : Integer                                       @title : '{i18n>Quantity}';
  quantityOpen                                      : Integer default '0'                           @title : '{i18n>QuantityOpen}';
  to_bom              : Association to one Billofmaterials    @title : '{i18n>BOM}';
  backflush : Boolean default false @title : '{i18n>Backflush}';
  to_coverage_code : String @title : '{i18n>Coverage}';
  componentScrap : Integer default '0.00' @title : '{i18n>ComponentScrap}';
  percent : String(1) default '%'                           @title : '{i18n>UOM}';
  requirementDateTime: DateTime default 'timestamp"2021-11-24 15:11:32.4209753"' @title : '{i18n>RequirementDateTime}';
  to_storageLocation_code : String default 'Location 002 (002)' @title : '{i18n>StorageLocation}';
  to_uom                                            : Association to one UOM                          @title : '{i18n>UOM}';
  quantityConsumed                                  : Integer                                       @title : '{i18n>QuantityConsumed}';
  quantityCommitted1                                : Integer                                       @title : '{i18n>QuantityCommitted1}';
  quantityCommitted2                                : Integer                                       @title : '{i18n>QuantityCommitted2}';
  quantityUncovered                                 : Integer                                       @title : '{i18n>QuantityUncovered}';
  hasMissing : Boolean;
  criticality : Criticality not null default 0;
}
entity Components as select from OrderComponents {
  ID,
  to_material,
  to_order, 
  to_bom,
  quantity,
  quantityOpen,
  backflush,
  to_coverage_code,
  componentScrap,
  percent,
  requirementDateTime,
  to_storageLocation_code,
  quantityConsumed,
  quantityCommitted1,
  quantityCommitted2,
  quantityUncovered,
  hasMissing,
  criticality,
  createdAt,
  createdBy,
  modifiedAt,
  modifiedBy,
  to_material.to_uom as to_uom
};
entity SFCComponents: cuid {
  to_components              : Association to one OrderComponents;
  to_SFC                     : Association to one  Serials;
  quantity                                          : Integer                                       @title : '{i18n>Quantity}';
  quantityOpen                                      : Integer default '0'                           @title : '{i18n>QuantityOpen}';
  quantityConsumed                                  : Integer                                       @title : '{i18n>QuantityConsumed}';
  quantityCommitted1                                : Integer                                       @title : '{i18n>QuantityCommitted1}';
  quantityCommitted2                                : Integer                                       @title : '{i18n>QuantityCommitted2}';
  quantityUncovered                                 : Integer                                       @title : '{i18n>QuantityUncovered}';
  hasMissing : Boolean;
  componentScrap : Integer default '0.00' @title : '{i18n>ComponentScrap}';
  criticality : Criticality not null default 0;
}


entity ComponentsToSFCs as select from SFCComponents {
  ID,
  to_SFC,
  to_components,
  to_components.to_material.identifier as materialID,
  to_components.to_material.descr as materialDescr,
  to_components.to_material.ID as to_material_ID,
  to_components.backflush as backflush,
  to_components.percent as percent,
  to_components.to_coverage_code as to_coverage_code,
  to_components.componentScrap as componentScrap,
  quantity,
  quantityOpen,
  quantityConsumed,
  quantityCommitted1,
  quantityCommitted2,
  quantityUncovered,
  to_components.to_material.to_uom as to_uom,
  hasMissing,
  criticality
  //to_components.criticality as criticality
};
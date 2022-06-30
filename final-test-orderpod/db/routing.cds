namespace scp.dmc;

using scp.dmc.Url from './common';
using scp.dmc.TechnicalBooleanFlag from './common';
using scp.dmc.TechnicalFieldControlFlag from './common';
using scp.dmc.Criticality from './common';
using scp.dmc.Identifier from './common';
using scp.dmc.identified from './common';
using scp.dmc.Orders from './orders';
using scp.dmc.OrderStatus from './orders';
using scp.dmc.Materials from './material';
using scp.cloud.Plant from './schema';

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';




//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.

entity Routings: identified, managed {
  version                                          : String                                 @title : '{i18n>Version}';
  descr                                             : localized String(500)                            @title : '{i18n>Description}';
  currentVersion                                    : Boolean default true                                 @title : '{i18n>CurrentVersion}';
  relaxedFlow                                          : Boolean default false                                @title : '{i18n>RelaxedFlow}';
  to_status                                         : Association to one RoutingStatus                @title : '{i18n>Status}';
  to_order                                           : Association to many Orders 
                                                      on to_order.to_routing = $self;
  isProcess                                          : TechnicalBooleanFlag not null default false;
  to_plant                                          : Association to one Plant @title : '{i18n>Plant}';
                                                    
}
entity RoutingOperationsAndPhasesGroups {
  key ID                                                              : UUID;
  group                                                      : String                                                                          ;
}
entity Operations {
  key ID                                                              : UUID;
  operation                                                           : String                                                                          @title : '{i18n>Operation}';
  descr                                                               : localized String                                                                @title : '{i18n>Description}';
  /*Navigation*/
  to_routing                                                          : Association to one Routings                                                     @title : '{i18n>Routing}';
  to_operationAndPhasesGroup                                          : Association to one RoutingOperationsAndPhasesGroups                             @title : '{i18n>OpsGroup}';
  to_workcenter                                                       : Association to one Workcenters                                                  @title : '{i18n>WorkCenter}';

}
entity Workcenters : cuid {
  name                                                                : String                                                                          @title : '{i18n>WorkCenter}';
  type                                                                : localized String                                                                @title : '{i18n>WorkCenterType}';
}
entity RoutingStatus as select from dmc.OrderStatus where OrderStatus.code = 'O_001' or OrderStatus.code = 'O_003' or OrderStatus.code = 'O_004' or OrderStatus.code = 'O_011';

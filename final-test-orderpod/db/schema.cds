namespace scp.cloud;
// using scp.dmcauto.CloudConnector from './dmc_automation/cloud_connectors';

using {
  managed,
  cuid,
  sap.common
} from '@sap/cds/common';

type Url : String;

type TechnicalBooleanFlag : Boolean @(
    UI.Hidden,
    Core.Computed
);

type TechnicalFieldControlFlag : Integer @(
    UI.Hidden,
    Core.Computed
);

type Criticality : Integer @(
    UI.Hidden,
    Core.Computed
);

type Identifier : String(100)@(title : 'Identifier');
@cds.autoexpose
abstract entity identified : cuid {
    identifier : Identifier not null;
}
type Identifier2 : String(100)@(title : 'Identifier');
@cds.autoexpose
abstract entity identified2 : cuid {
    identifier : Identifier not null;
}

//Bolded display of first table column values can be achieved by defining annotations Common.SemanticKey and
//Common.TextArrangment for the entities key and referring to a 'human-readable' identifier to be displayed instead.

annotate identified with @(
    Common.SemanticKey : [identifier],
    UI.Identification  : [{Value : identifier}]
) {

    ID         @Common : {
        Text            : identifier,
        TextArrangement : #TextOnly,
        
    };
}

annotate identified2 with @(
    Common.SemanticKey : [identifier],
    UI.Identification  : [{Value : identifier}]
) {

    ID     @Common : {
        Text            : identifier,
        TextArrangement : #TextOnly
        
    };
}
entity SFCs : managed, identified {
  to_order                : Association to one Orders                     @title : 'Order';
  to_status               : Association to one OrderStatus                @title : 'Status';
  isPacked                : Boolean default false;
  to_packages             : Association to one Packages;
  action                  : String                                        @title : 'Action';
  isDraft                 : TechnicalBooleanFlag not null default false;
  identifierFieldControl  : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
}
entity Packages : managed, identified {
  to_material             : Association to one Material                     @title : 'Material';
  carrier                 : Association to one Carrier                     @title : 'Carrier';
  to_SFCs                 : Association to many SFCs
                              on to_SFCs.to_packages = $self;
  to_status               : Association to one PackageStatus                @title : 'Status';
  to_status_state         : String;
  size: String;
  content: String;
  status_icon: String;
  colorradial: String;
  uom: String;
  current                 : Boolean                                      @title : 'Current Packaging Unit';
}

entity Incidents : managed, identified {
  title                   : String(50)                        @title : '{i18n>Title}';
  category                : Association to one Category       @title : '{i18n>Category}';
  priority                : Association to one Priority       @title : '{i18n>Priority}';
  incidentStatus          : Association to one IncidentStatus @title : '{i18n>IncidentStatus}';
  description             : String(1000)                      @title : '{i18n>IncidentDescription}';
  assignedIndividual      : Association to one Individual     @title : '{i18n>Assignee}';
  incidentFlow            : Association to many IncidentFlow
                              on incidentFlow.incident = $self;
  incidentProcessTimeline : Association to many IncidentProcessTimeline
                              on incidentProcessTimeline.incident = $self;
  isDraft                 : TechnicalBooleanFlag not null default false;
  identifierFieldControl  : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
}


entity IncidentFlow : managed {
  key id             : UUID;
      processStep    : String(30)@title : '{i18n>ProcessStep}';
      stepStatus     : String(10)@title : '{i18n>ProcessStepStatus}';
      criticality    : Integer;
      stepStartDate  : Date      @title : '{i18n>StepStartDate}';
      stepEndDate    : Date      @title : '{i18n>StepEndDate}';
      @assert.integrity :                 false
      incident      : Association to Incidents;
}

entity IncidentProcessTimeline : managed {
  key id             : UUID;
      text           : String;
      type           : String;
      startTime      : DateTime;
      endTime        : DateTime;
      @assert.integrity : false
      incident  : Association to Incidents;
}

entity Individual : managed{
  Key ID : UUID;
      fullName          : String    @title : 'Name';
      emailAddress      : String    @title : 'Email Address';
      @assert.integrity : false
      Incidents         : Association to many Incidents 
                            on Incidents.assignedIndividual = $self;
}

entity IncidentsCodeList : common.CodeList {
  key code : String(20);
}

entity Category : IncidentsCodeList {}

entity Priority : IncidentsCodeList {
  criticality : Criticality not null default 3;
  crittable : Criticality not null default 3;
  icon : String;
  color : String;
}

entity IncidentStatus : IncidentsCodeList {}

entity Carrier : managed, identified {
  description                           : String(250)                      @title : 'Description';

  material                : Association to one Material      @title : 'Material';
  status                          : Association to one MaterialStatus @title : 'Status';
  currentPackUnit : String(250)                      @title : 'Current Packaging Unit';
  isNotNew : TechnicalBooleanFlag default true @title : 'Schon angelegt';
  isCreate : TechnicalBooleanFlag default false @title : 'Ist im Create Mode?';
  returnable                               : String default 'yes' @title : 'Returnable';
  to_packages : Association to many Packages
                on to_packages.carrier= $self;
}



entity WebServers : managed, identified {
  target_outgoing               : Composition of many Connections 
                             on target_outgoing.source= $self;
  
  services                              : Association to many ServiceList 
                                          on services.webserver= $self;    
  servicesCount                         : Integer                       @title : 'Services Available';                                                              
  name                                  : String(50)                        @title : 'Name';
  plant                                 : Association to one Plant @title : 'Plant';
  online                                : Association to one Status       @title : 'Status';
  onlineStatus                          : Association to one IncidentStatus @title : 'Test Status';
  description                           : String(1000)                      @title : 'Description';
  assignedProduct                       : Association to one Service       @title : 'Product';
  type                                  : Association to one ProductType       @title : 'Type';
  Edit                                  : Boolean @title : 'EditStatus';//TechnicalBooleanFlag not null default false;
  active                                : TechnicalBooleanFlag not null default false;
  isDraft                               : TechnicalBooleanFlag not null default false;
  isNew                                 : TechnicalBooleanFlag not null default false;
  identifierFieldControl                : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
  hostURL                               : String(60)                                      @title : 'Host URL'; 
  visible                               : String default 'yes';
  @assert.integrity : false
  modifiedByKO                            : Association to one Users @title : 'Changed By';
  @assert.integrity : false
  createdByKO                            : Association to one Users @title : 'Created By';
  isNoPCO                                 : TechnicalBooleanFlag not null default true                @title : 'PCO';
  isDMC                                   : TechnicalBooleanFlag not null default false                @title : 'DMC';
  isNoRuntime                             : TechnicalBooleanFlag not null default true                @title : 'Runtime';
  Updatable_mc                            : TechnicalBooleanFlag not null default true                @title : 'Updatable_mc';
  Delete_mc                               : TechnicalBooleanFlag not null default true                @title : 'Delete_mc';
  to_security                           : Association to many Security
                                on to_security.source= $self; 
  noneMandatoryContentFieldControl           : TechnicalFieldControlFlag not null default 3;
  editableContentFieldControl                : TechnicalFieldControlFlag not null default 7;
  typeContentFieldControl                    : TechnicalFieldControlFlag not null default 7;
}
entity Security: common.CodeList {
  key ID    : UUID;
  source                                : Association to WebServers;
                                        
  authName                              : String(25)                                    @title : 'Name';
  description                           : String(200)                                   @title : 'Description';
  authURL                               : String                                        @title : 'URL';
  authProxyType                         : String                                        @title : 'Proxy Type';
  authAuth                              : Association to one Authentication             @title : 'Authentication';
  authClientID                          : String                                        @title : 'Client ID';
  authSecret                            : String                                        @title : 'Client Secret';
  authTSURL                             : String                                        @title : 'Token Service URL';
  authTSURLType                         : String                                        @title : 'Token Service URL Type';
  authTSUser                            : String                                        @title : 'Token Service User';
  authTSPW                              : String                                        @title : 'Token Service Password';
  authAudience                          : String                                        @title : 'Audience';
  isFav                                 : Boolean default false                         @title : 'Primary Destination';
  Edit_AC                               : TechnicalBooleanFlag not null default true                @title : 'Edit True';
  authBool001                           : TechnicalBooleanFlag not null default false                @title : 'OAuth2ClientCredentials';
  authBool002                           : TechnicalBooleanFlag not null default true                @title : 'OAuth2JWTBearer';
  authBool003                           : TechnicalBooleanFlag not null default true                @title : 'OAuth2SAMLBearerAssertion';
  authBool004                           : TechnicalBooleanFlag not null default true                @title : 'OAuth2UserTokenExchange';
  authBool005                           : TechnicalBooleanFlag not null default true                @title : 'ClientCertificateAuthentication';
  authBool006                           : TechnicalBooleanFlag not null default true                @title : 'BasicAuthentication';
  authBool007                           : TechnicalBooleanFlag not null default true                @title : 'PrincipalPropagation';

}
entity Authentication : WebServerCodeList {
  name                                  : String             @title : 'Type';
}
entity Users {
  key code : String;
  name                                  : String             @title : 'Name';
  phone                                 : String             @title : 'Phone';
  email                                 : String             @title : 'Email';
}
entity Status : WebServerCodeList {
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 3;
  connection : String;
}
entity DeploymentStatus : WebServerCodeList {
  key code : String;
  descr : String(100);
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 0;

}
entity WebServerCodeList : common.CodeList {
  key code : String(20);
}

entity Plant : PlantCodeList {}
entity PlantCodeList : common.CodeList {
  key code : String(20)              @title : 'Plant Code';
  name     : String(60)               @title : 'Plant';
  city: String(60)               @title : 'City';
  street: String(60)               @title : 'Street';
  orgcode: String(60)               @title : 'Org-Code';
  contact: String(60)               @title : 'Contact Person';
  phone: String(60)               @title : 'Phone';
  country: String(60)               @title : 'Country';
  isDiscreet : TechnicalBooleanFlag;
}

entity Service : managed, identified{
  //Key ID : UUID;
      product                 : String    @title : 'Product';
      ss                : String(20) @title : 'Services';
      custom_ss         : String(20) @title : 'Custom Services';
      type                    : Association to one ProductType    @title : 'Type';
      version                 : Association to one Version       @title : 'Version';
      to_services     : Association to many ProductServices       
                                on to_services.product = $self @title : 'Services';
      visible                    : String;
      isRuntime         : TechnicalBooleanFlag not null default false;
      isPCO         : TechnicalBooleanFlag not null default false;
      isDMC         : TechnicalBooleanFlag not null default false;
      //@assert.integrity       : false
      //WebServers              : Association to many WebServers 
      //                      on WebServers.assignedProduct = $self;
}
entity AssignedProductServices : cuid, managed{
      service_name: String @title : 'Name';
      identifier: String;
      product: Association to one Service       @title : 'Service';
}
entity ProductServices : identified, managed{
      service_name: String @title : 'Name';
      //identifier: String;
      product: Association to one Service       @title : 'Service';
      unassigned:Boolean default false;
}
entity Version : managed{
  Key code : String;
      version          : String    @title : 'Version';
      description : String @title : 'Suppenkasper';
      @assert.integrity : false
      Service         : Association to many Service 
                            on Service.version = $self;
}
entity ProductType : managed, common.CodeList {
  Key code : String;
      name          : String    @title : 'Type';
      @assert.integrity : false
      ProductType         : Association to many Service 
                            on ProductType.type = $self;
}
entity Connections : managed, identified {

  source                 : Association to one WebServers;    
  target                : Association to one WebServers @title : 'Target'; 
  online                 : Association to one Status       @title : 'Connection Status';
  connection :             Association to many ConnectionsToService 
                            on connection.connection = $self;
  @assert.integrity : false
  deployment : Association to one DeploymentStatus;
  isPCO                   : TechnicalBooleanFlag not null default false;
  isNoPCO                   : TechnicalBooleanFlag not null default true;
  isDMC                   : TechnicalBooleanFlag not null default false;
  deployedServicesCount : Integer @title : 'Services Selected';
  @assert.integrity : false
  deploymentGroup                 : Association to one DeploymentGroup @title : 'Deployment Group';
  virtual isDeployed : Boolean default true;
  virtual isNotDeployed : Boolean default true;
}


entity ServiceList : managed, identified{
  Key ID : UUID;
      webserver                 : Association to one WebServers;
      service_name         : String(120) @title : 'Name';
}
entity ConnectionsToService : cuid, managed, identified{
  Key ID : UUID;
      webserver                 : Association to one WebServers;
      connection                 : Association to one Connections;
      deployment : Association to one DeploymentStatus;
      service_name         : String(120) @title : 'Name';
      Remove_ac:Boolean default false;
      Deploy_ac:Boolean default false;
      UnDeploy_ac:Boolean default false;
      Refresh_ac:Boolean default false;
      noDeploy:Boolean default true;
      @assert.integrity : false
      deploymentGroup                 : Association to one DeploymentGroup @title : 'Deployment Group';
      to_service_status : Association to one ServiceStatus @title : 'Service Status';
      upToDate:Boolean default true;
}
entity DeploymentGroup : managed, identified{
  name:String @title : 'Name';
  descr:String @title : 'Description';
  deployment : Association to one DeploymentStatus;
  to_status               : Association to one PackageStatus                @title : 'Status';
}
entity ServiceStatus : WebServerCodeList {
  key code : String;
  descr : String(100);
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 0;

}

entity Orders : managed, identified {
  @Semantics.quantity.unitOfMeasure: 'uom'
  quantity                                  : Integer @title : 'Quantity' ;
  @Semantics.unitOfMeasure: true
  uom                                       : String(3) @title : 'Unit' ;
  progress                                  : Integer @title : 'Quantity Produced';
  available                                 : Integer @title : 'Quantity Available';
  customer_order                            : Integer @title : 'Customer Order';
  productionType                            : String(15) @title : 'Production Type';
  erp                                       : Boolean @title : 'ERP Order';
  start                                     : Date @title : 'Planned Start';
  end                                       : Date @title : 'Planned Completion';
  @assert.integrity       : false
  status                  : Association to one OrderStatus       @title : 'Status';
  @assert.integrity       : false
  prio                    : Association to one Priority       @title : 'Priority';
  @assert.integrity       : false
  customer                : Association to one Customer       @title : 'Customer';
  @assert.integrity       : false
  material                : Association to one Material       @title : 'Material';
  @assert.integrity       : false
  bom                     : Association to one BOM            @title : 'BOM';
  @assert.integrity       : false
  routing                 : Association to one Routing        @title : 'Routing';
  @assert.integrity       : false
  routingTimeline : Association to many RoutingTimeline
                              on routingTimeline.routing = $self;
  @assert.integrity       : false
  scheduling              : Association to many Scheduling 
                            on scheduling.scheduling_orders = $self;
  isDraft                 : TechnicalBooleanFlag not null default false;
  identifierFieldControl  : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
  @assert.integrity       : false
  testservice                 : Association to one TestService        @title : 'TestService';
  @assert.integrity       : false
  orderStatusSF                    : Association to one orderSF       @title : 'Order Status';
  to_SFCs                 : Association to many SFCs
                              on to_SFCs.to_order = $self;
  
  
}
entity orderSF : IncidentsCodeList {
  criticality : Criticality not null default 3;
  crittable : Criticality not null default 3;
  icon : String;
  color : String;
  colorradial : String;
}

entity TestService : managed, identified, common.CodeList{
  name                            : String(60)                        @title : 'Test Name';
  oders                           : Association to many Orders on oders.testservice = $self;
  isDraft                         : TechnicalBooleanFlag not null default false;
  identifierFieldControl          : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
}
entity Material : managed, identified {
  name                            : String(60)                        @title : 'Type';
  version                         : String(60)                        @title : 'Version';
  description                     : String(250)                       @title : 'Description';
  currentVersion                  : Boolean                           @title : 'Current Version';
  status                          : Association to one MaterialStatus @title : 'Status';
  materialType                    : String(250)                       @title : 'Material Type';
  procurementType                 : String(250)                       @title : 'Procurement Type';
  materialMethod                  : String(120)                       @title : 'Method';
  material_oders                  : Association to many Orders on material_oders.material = $self;
  boms                            : Association to one BOM            @title : 'BOM';
  routings                        : Association to one Routing        @title : 'Routing';
  returnable                      : String default 'no'             @title : 'Returnable';
  isDraft                         : TechnicalBooleanFlag not null default false;
  identifierFieldControl          : TechnicalFieldControlFlag not null default 7; // 7 = #Mandatory;
}
entity BOM : managed, identified, common.CodeList{
  name                            : String(60)                        @title : 'Type';
  version                         : String(60)                        @title : 'Version';
  description                     : String(250)                       @title : 'Description';
  currentVersion                  : Boolean                           @title : 'Current Version';
  erp                             : Boolean                           @title : 'ERP BOM';
  status                          : Association to one MaterialStatus @title : 'Status';
  base_quantity                   : Integer                           @title : 'Base Quantity';
  uom                             : String(3)                         @title : 'Unit' ;
  bom_orders                  : Association to many Orders 
                            on bom_orders.bom = $self;
  bom_material                : Association to many Material 
                            on bom_material.boms = $self;
}
entity Routing : managed, identified, common.CodeList{
  name                            : String(60)                        @title : 'Type';
  version                         : String(60)                        @title : 'Version';
  description                     : String(250)                       @title : 'Description';
  currentVersion                  : Boolean                           @title : 'Current Version';
  erp                             : Boolean                           @title : 'ERP BOM';
  status                          : Association to one MaterialStatus @title : 'Status';
  type                            : String(60)                        @title : 'Type';
  uom                             : String(3)                         @title : 'Unit' ;
  
  routing_orders                  : Association to many Orders 
                            on routing_orders.routing = $self;
  routing_material                  : Association to many Material 
                            on routing_material.routings = $self;
}
entity RoutingTimeline : managed {
  key id             : UUID;
      text           : String;
      type           : String;
      workcenter      : String;
      workcentertype : String;
      startTime      : DateTime;
      endTime        : DateTime;
      @assert.integrity : false
      routing  : Association to Orders;
}
entity Scheduling : managed, identified {
  scheduling_orders                  : Association to one Orders
}
entity OrderStatus : WebServerCodeList {
  key code : String;
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 3;
  name : String @title : 'Status';
  criticalitytablename : String;
  criticalityname: String;
  criticalityicon: String;
}
entity MaterialStatus : WebServerCodeList {
  key code : String;
  criticality : Criticality not null default 3;
  criticalitytable : String(100);
  name : String @title : 'Status';
}
entity Customer : managed{
  Key code : String;
      name          : String    @title : 'Company';
      representative          : String    @title : 'Representative';
      street          : String    @title : 'Street';
      zip          : String    @title : 'Zip Code';
      city          : String    @title : 'City';
      phone          : String    @title : 'Phone';
      e_mail          : String    @title : 'Email';
      country          : String    @title : 'Country';

}
entity PackageStatus : common.CodeList {
  key code : String;
  criticality : Criticality not null default 3;
  criticalitytable : Criticality not null default 3;
  name : String @title : 'Status';
}


entity SortWebservers as SELECT from WebServers {
        ID,
        identifier,
        name,
        plant.name as plant,
        assignedProduct.product as product,
        type.name as type,
        assignedProduct.version.version as version
    };
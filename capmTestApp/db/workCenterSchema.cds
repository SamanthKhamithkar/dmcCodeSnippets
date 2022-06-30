namespace sap.capire.wc;

type WorkCenterCategory : String enum {
  NONE_LEVEL0; CELL_LEVEL1; CELL_GROUP_LEVEL2; LINE_LEVEL3; LINE_GROUP_LEVEL4; BUILDING_LEVEL5;
}

entity WorkCenters {
  key workCenter          : String(36);
  plant                   : String;
  description             : String;
  status                  : String(412);
  userWorkCenters         : Association to many UserWorkCenter on userWorkCenters.workCenter = $self;
  canBeReleasedTo         : Boolean;
  workcenterCategory      : WorkCenterCategory;
  minNumberPeople         : Decimal(38, 0);
  maxNumberPeople         : Decimal(38, 0);
  createdDateTime         : DateTime;
  modifiedDateTime        : DateTime;
  erpInternalId           : Integer;
  isErp                   : Boolean;
  erpWorkCenter           : String(8);
  productionSupplyAreaId  : String(36);
}

entity UserWorkCenter {
  key uwcID         : Integer;
  userWC            : Association to UserData;
  workCenter        : Association to WorkCenters;
}

entity UserData {
  key userId        : String(120) not null;
  plant             : String(6) not null;
  createdDateTime   : DateTime;
  modifiedDateTime  : DateTime;
  email             : type of userId;
  givenName         : type of userId;
  familyName        : type of userId;
  current           : Boolean;
  users             : Association to many UserWorkCenter on users.userWC = $self;
}

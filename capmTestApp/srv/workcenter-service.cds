using { sap.capire.wc as my } from '../db/workCenterSchema';
service WorkCenterService {
    entity WorkCenters @readonly as projection on my.WorkCenters;
    entity UserWorkCenter @readonly as projection on my.UserWorkCenter;
    entity UserData @readonly as projection on my.UserData;
}
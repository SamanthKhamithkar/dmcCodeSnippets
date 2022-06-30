using orderpodservice as service from '../../srv/orderpodservice';

annotate service.SFCPhasesList with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : phase,
        },
        {
            $Type : 'UI.DataField',
            Value : phaseDescr,
        },
        {
            $Type : 'UI.DataField',
            Value : to_status_code,
        },
        {
            $Type : 'UI.DataField',
            Value : startTime,
        },
        {
            $Type : 'UI.DataField',
            Value : endTime,
        },
    ]
);

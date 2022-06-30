const cds = require("@sap/cds");

/**
 * Enumeration values for FieldControlType
 * @see https://github.com/SAP/odata-vocabularies/blob/master/vocabularies/Common.md#FieldControlType
 */
const FieldControl = {
    Mandatory: 7,
    Optional: 3,
    ReadOnly: 1,
    Inapplicable: 0,
  };
  
module.exports = cds.service.impl(async function (srv) {
    const {
        Orders,
        OrderOperations,
        Plants,
        Materials,
        Batches,
        Serials,
        OrderPhases,
        SFCToOperationPhasesList,
        MaterialConsumptions
    } = srv.entities 

    
    srv.after(["READ", "EDIT"], "Serials", setTechnicalFlagsSerials);
    //read/edit event hook after read  of entity 'Incidents'
    srv.after("NEW", "Orders", setBasics);
    
    srv.before("SAVE", "Orders", createOrder);
    srv.after("SAVE", "Orders", createOrder2);
    srv.after("EDIT", "Orders", test123);
    srv.after("PATCH", "Orders", setBasics);
    srv.after(["READ"], "Orders", setTechnicalFlags);
    srv.after("NEW", "Orders", setBasicsAfter);
    
    srv.after(["READ", "EDIT"], "Serials", test);
  
    //Filling of properties, when a new RootEntity is created
    srv.before('NEW',Orders, async (req) => {
        var Order = await SELECT.from(Orders),
            orderNumber = Order[Order.length-1].identifier;
        orderNumber = ++orderNumber
        console.log(orderNumber)
        console.log("Order Inhalt", Order)
        req.data.identifier = ++orderNumber
    })

    srv.before('UPDATE', MaterialConsumptions, async (req) => {

        var consum = await SELECT.from(MaterialConsumptions).where({ID:req.params})
        console.log("Params", req.data)
        console.log("PATCH GEHT!", consum)

        console.log("Datenbank", consum[0].quantity)
        console.log("Update", req.data.quantityPosted)
        if (consum[0].quantity > req.data.quantityPosted) {
            console.log("LOW")
            req.error(400, "Quantity too low", "quantityPosted");
        } else if (consum[0].quantity < req.data.quantityPosted) {
            console.log("High")
            req.error(400, "Quantity too high", "quantityPosted");
        } else if (consum[0].quantity == req.data.quantityPosted){
            console.log("Perfect")
        } else {
            req.error(400, "Kein PLAN", "quantityPosted");
        }
    })

    async function test(req) {
        console.log("Jupp Serials existieren")
        
    }

    async function setBasicsBefore(orders,req) {

        orders.data.isNew = true;
        orders.data.to_plant_code = orders.user.attr.plant

    }

    async function test123(orders,req) {
        console.log("After Save")
        orders.isNew = true;
        orders.isDraft = true;
    }
    async function setBasicsAfter(req) {
    
    }
    function createOrder2(order,req) {
        
    }
    function createOrder(req) {
        //const id = req.params[0].SideEffectsQualifier
        //console.log("BEFORE CREATE", id)
        if (!req.data.to_plant_code) {
            
            
            req.error(400, "SELECTPLANT", "in/to_plant_code");
            
        }
        console.log("SAVE")
        req.data.isDraft = true
        req.data.createMandatoryFieldControl = FieldControl.Inapplicable
        req.data.createFieldControl = FieldControl.Inapplicable
        // console.log("DATA", req.data)
        
    }
    async function getOrderID(req) {
        const tx = cds.transaction(req)
        console.log("Order ID running")
        const Orders = await tx.read('scp.dmc.Orders') // determine next order ID
        orderID = Orders[Orders.length-1].identifier; // get last order ID
        orderID = orderID++
        orderID = orderID++
        console.log("Order ID is",orderID)
        return orderID;
    }
    async function getPlantInfo(req,code) {
        const tx = cds.transaction(req)
        const Plant = await tx.read('scp.cloud.Plant').where({code:code}) // determine next order ID
        

        return Plant[0].isDiscreet;
    }


    function setBasics(orders,req) {
        console.log("setBasics")
        orders.isNew = true;
        orders.FieldControl = FieldControl.Inapplicable
        orders.createMandatoryFieldControl = FieldControl.Mandatory
        orders.createFieldControl = FieldControl.Optional
        orders.Hold_ac = false
        orders.Prio_ac = false
        orders.Release_ac = false
        orders.isDraft = true
        //orders.plantFieldControl = FieldControl.Mandatory
        // if(orders.to_plant_code == null) {
        //     orders.plantFieldControl = FieldControl.Mandatory
        // }
        
        if(orders.to_plant_code != null) {
            var isDiscreet = true//await getPlantInfo(req,orders.to_plant_code)

            if (isDiscreet == false) {
                
                orders.materialProcessFieldControl = FieldControl.Mandatory
                orders.materialProductionFieldControl = FieldControl.Inapplicable
                // const tx = cds.transaction(req)
                // const n = await tx.run ([ 
                //     UPDATE ('scp.dmc.Orders') .set({
                //         materialProcessFieldControl: FieldControl.Mandatory, 
                //         materialProductionFieldControl: FieldControl.Inapplicable,
                //         createMandatoryFieldControl: FieldControl.Mandatory,
                //         createFieldControl: FieldControl.Optional,
                //     }).where({ID:orders.ID, IsActiveEntity: false})
                // ]);
            } else {
                orders.materialProcessFieldControl = FieldControl.Inapplicable
                orders.materialProductionFieldControl = FieldControl.Mandatory
            }
            
            //orders.to_uom_code = uom //orders.to_material.to_uom_code
        }
        //req.data.FieldControl = FieldControl.ReadOnly
        // console.log("Test",orders)
        // if(orders !== null) {
        //     orders.data.isDraft = !orders.data.IsActiveEntity;
        // }
        // console.log("Vorher:", req.data)
        // console.log("Vorher:", req.user)
        // //console.log("Vorher:", req.data)
        // req.data.to_plant_code = "001"
        // req.data.to_status_code = "O_001"
        // req.data.to_plant_code = req.user.attr.plant
        // req.data.identifier = "O00000-0001"
        // req.data.to_material_ID = "2fed3b0c-622e-11eb-ae93-0242ac130002"
        // console.log("Danach:", req.data)
        // req.reject({
        //     code: 'Object',
        //     message: 'Buuum',
        //     target: '/#TRANSIENT#'
        //   })
    }

    srv.on('changePrio', async (req) => {
        const prio = req.data.to_prio_code
        //const statusService = req.data.my_code
        const user = req.user.id
        const id = req.params[0].ID
        
        // console.log("DATA:", req.data)
        // console.log("QUERY:", req.query)
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        
            
        
        await timeout(500);
        const tx = cds.transaction(req)

            // const order = await tx.read ([ 
            //     SELECT (Orders).where({ID:id})
            // ]);
            const order = await tx.read(Orders).where({ID:id})
            if (order[0].to_prio_code === prio) {
                req.notify({
                    code: 'Object',
                    message: 'NO_CHANGE',
                    target: '/#TRANSIENT#'
                  })
            }
            else {
                req.notify({
                    code: 'Object',
                    message: 'ORDER_PRIO_CHANGE',
                    target: '/#TRANSIENT#'
                  })
                  const n = await tx.run ([ 
                    UPDATE (Orders) .set({to_prio_code: prio,modifiedBy: user}).where({ID:id})
                ]);
            }
            
        
        
        /*req.info({
            code: 'Object',
            message: 'Deployment Status was updated successfully, please refresh the page in order to see the changes',
            target: '/#TRANSIENT#'
          })*/

    })

    srv.on('scan', async (req) => {

        var phaseID = req.params[2]

        //Check if Material
        var material = await SELECT.from(Materials).where({identifier:req.data.value})
        if (material.length >0) {
            var consumID = await SELECT.from(MaterialConsumptions).where({to_material_ID:material[0].ID,to_SFCToOperationPhasesList_ID: phaseID})
            if (consumID.length >0) {
                var s = await UPDATE(MaterialConsumptions).set({modifiedBy: "Mirko Schäfer",quantityPosted: consumID[0].quantity, postedValue: consumID[0].quantity, criticality: 3}).where({to_material_ID:material[0].ID,to_SFCToOperationPhasesList_ID: phaseID})
                req.notify(200, 'Material ' + req.data.value  +' successfully scanned', '/#TRANSIENT#' ,[])
            } else {
                req.error(200, 'This phase does not contain the Material ' + req.data.value , '/#TRANSIENT#' ,[])
            }

        } 
        //Check if Batch
        else {
            var batch = await SELECT.from(Batches).where({identifier:req.data.value})
            if (batch.length >0) {
                var consumID = await SELECT.from(MaterialConsumptions).where({to_material_ID:batch[0].to_material_ID,to_SFCToOperationPhasesList_ID: phaseID})

                if (consumID.length >0) {
                    if (batch[0].quantity < consumID[0].quantity) {
                        var updateQuantity = 0
                        var remainingQuantity = consumID[0].quantity - batch[0].quantity
                        var s = await UPDATE(MaterialConsumptions).set({modifiedBy: "Mirko Schäfer",quantityPosted: batch[0].quantity, quantity: batch[0].quantity, postedValue: batch[0].quantity, to_batch_ID:batch[0].ID,criticality: 3}).where({to_material_ID:batch[0].to_material_ID,to_SFCToOperationPhasesList_ID: phaseID})
                        s = await UPDATE(Batches).set({quantity: updateQuantity}).where({identifier:req.data.value})
                        s = await INSERT.into(MaterialConsumptions).entries({to_uom_code: 'KG',createdBy: "Mirko Schäfer",modifiedBy: "Mirko Schäfer",quantityPosted: 0, quantity: remainingQuantity, postedValue: 0,criticality: 0, to_material_ID:batch[0].to_material_ID,to_SFCToOperationPhasesList_ID: phaseID})
                        req.notify(200, 'Batch ' + req.data.value  +' successfully scanned', '/#TRANSIENT#' ,[])
                        req.warn(200, 'Batch ' + req.data.value  +' quantity insufficient', '/#TRANSIENT#' ,[])
                    } else {
                        var s = await UPDATE(MaterialConsumptions).set({modifiedBy: "Mirko Schäfer",quantityPosted: consumID[0].quantity, postedValue: consumID[0].quantity, to_batch_ID:batch[0].ID,criticality: 3}).where({to_material_ID:batch[0].to_material_ID,to_SFCToOperationPhasesList_ID: phaseID})
                        var updateQuantity = batch[0].quantity - consumID[0].quantity
                        s = await UPDATE(Batches).set({quantity: updateQuantity}).where({identifier:req.data.value})
                        req.notify(200, 'Batch ' + req.data.value  +' successfully scanned', '/#TRANSIENT#' ,[])
                    }


                } else {
                    req.error(200, 'This phase does not contain the Batch ' + req.data.value , '/#TRANSIENT#' ,[])
                }


            } else {
                req.info(200, 'Your scan did not return any result', '/#TRANSIENT#' ,[])
            }
        }
    })

    srv.on('change_dates', async (req) => {
        // const hold_code = req.data.hold_code
        // const reason_code = req.data.reason_code
        // const note = req.data.note
        req.warn(200, '', '/#TRANSIENT#' ,[])
        // req.notify(200, 'HOLD', '/#TRANSIENT#' ,[hold_code,reason_code,note])
    })
    srv.on('createBatch', async (req) => {
        // const hold_code = req.data.hold_code
        // const reason_code = req.data.reason_code
        // const note = req.data.note
        req.warn(200, 'HOLDS', '/#TRANSIENT#' ,[])
        // req.notify(200, 'HOLD', '/#TRANSIENT#' ,[hold_code,reason_code,note])
    })
    srv.on('start', async (req) => {
        // const hold_code = req.data.hold_code
        // const reason_code = req.data.reason_code
        // const note = req.data.note
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await timeout(500);
        const tx = cds.transaction(req)
        const id = req.params[2]
        console.log("PARAMS",req.params[2])
        var now = new Date();
        req.notify(200, 'Phase started successfully', '/#TRANSIENT#' ,[])
        var getQuantity = await SELECT.from('scp.dmc.SFCToOperationPhasesList').where({ID:id})

        const n = await tx.run ([ 
            UPDATE ('scp.dmc.SFCToOperationPhasesList') .set({Start_ac: false,Complete_ac: true, Edit_ac: false,to_status_code: 'SF_003', startTime: now, quantityPending: getQuantity[0].quantity}).where({ID:id})
        ]);


        // req.notify(200, 'HOLD', '/#TRANSIENT#' ,[hold_code,reason_code,note])
    })

    srv.on('complete', async (req) => {
        // const hold_code = req.data.hold_code
        // const reason_code = req.data.reason_code
        // const note = req.data.note
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await timeout(500);
        const tx = cds.transaction(req)
        const id = req.params[2]
        console.log("PARAMS",req.params[2])
        var now = new Date();
        req.notify(200, 'Phase completed successfully', '/#TRANSIENT#' ,[])
        var getQuantity = await SELECT.from('scp.dmc.SFCToOperationPhasesList').where({ID:id})
        const n = await tx.run ([ 
            UPDATE ('scp.dmc.SFCToOperationPhasesList') .set({Start_ac: false,Complete_ac: false, Edit_ac: false,to_status_code: 'SF_004', endTime: now, quantityProduced: getQuantity[0].quantity, quantityPending: 0,criticality: 3}).where({ID:id})

        ]);


        // req.notify(200, 'HOLD', '/#TRANSIENT#' ,[hold_code,reason_code,note])
    })
    srv.on('addNoneBomComponent', async (req) => {
        // const hold_code = req.data.hold_code
        // const reason_code = req.data.reason_code
        // const note = req.data.note
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await timeout(500);
        // const tx = cds.transaction(req)
        // const id = req.params[2]
        console.log("PARAMS",req.params)
        // var now = new Date();
        req.notify(200, 'Tüdelü', '/#TRANSIENT#' ,[])
        // const n = await tx.run ([ 
        //     UPDATE ('scp.dmc.SFCToOperationPhasesList') .set({Start_ac: false,Complete_ac: false, Edit_ac: false,to_status_code: 'SF_004', endTime: now}).where({ID:id})
        // ]);


        // req.notify(200, 'HOLD', '/#TRANSIENT#' ,[hold_code,reason_code,note])
    })

    srv.on('hold', async (req) => {
        const hold_code = req.data.hold_code
        const reason_code = req.data.reason_code
        const note = req.data.note
        req.warn(200, 'HOLDS', '/#TRANSIENT#' ,[])
        // req.notify(200, 'HOLD', '/#TRANSIENT#' ,[hold_code,reason_code,note])
    })
    srv.on('release', async (req) => {
        const tx = cds.transaction(req)
        const user = req.user.id
        const id = req.params[0].ID
        const orderAmount = await tx.read(Orders).where({ID:id})
        // const SFC = await tx.read(Serials).where({ID:'0870010a-b4f6-434b-a7fa-e445faa6a44d'})
        console.log("Schauen wir mal", orderAmount[0])
        async function _emitNotification(newSFCs) {
            req.notify(200, 'SFC', '/#TRANSIENT#' ,[newSFCs.identifier])
        }
        async function _converToOld(newSFCs) {
            // console.log("Was ist drin?",newSFCs)
            const n = await tx.run ([ 
                UPDATE (Serials) .set({isNew:false}).where({ID:newSFCs.ID})
            ]);
        }
        
        async function createSFC(id,operation,amount,material,plant_code,plant_id,material_id,uom,order_id,startcount,type,material_lot) {
            
            
            const tx = cds.transaction(req)
            startcount++
            if (type === 'PP01') {
                for (let i = 0; i < amount; i++) {
                    var ider = plant_id + '-' + material +'-'+order_id+'-'+startcount;
                    const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
                        identifier:ider,to_order_ID: id,to_orderOperationsAndPhases_ID:operation,to_plant_code: plant_code,quantity:1,to_status_code:'SF_001',uom:uom,to_material_ID:material_id
                    }));
                    startcount++;
                } 
            } else if (type === 'PP-PI-POR') {
                if (amount <= material_lot) {
                    console.log("TEST ", amount)
                    var ider = plant_id + '-' + material +'-'+order_id+'-'+startcount;
                    const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
                        identifier:ider,to_order_ID: id,to_orderOperationsAndPhases_ID:operation,to_plant_code: plant_code,quantity:amount,to_status_code:'SF_001',uom:uom,to_material_ID:material_id
                    }));
                } else {
                    var amountOfSFCs = amount / material_lot
                    var counter = Math.trunc(amountOfSFCs)
                    console.log("Before", counter)
                    console.log("unit", uom)
                    if (amountOfSFCs > counter) {
                        counter++
                    }
                    var amount_temp = material_lot
                    
                    console.log("After", counter)

                    for (let i = 0; i < counter; i++) {
                        if (amount>material_lot) {
                            amount_temp = material_lot
                        } else {
                            amount_temp = amount
                        }
                        var ider = plant_id + '-' + material +'-'+order_id+'-'+startcount;
                        const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
                            identifier:ider,to_order_ID: id,to_orderOperationsAndPhases_ID:operation,to_plant_code: plant_code,quantity:amount_temp,to_status_code:'SF_001',uom:uom,to_material_ID:material_id
                        }));
                        startcount++;
                        amount = amount - material_lot
                    } 
                }
            }
            
              
        }

        const amount = req.data.quantityReleasedNew
        const amountAvailable = req.data.quantityReleasable
        const uom = req.data.to_uom_code
        const quantity = req.data.quantity
        //const statusService = req.data.my_code
        
        
        // console.log("DATA:", req.data)
        // console.log("QUERY:", req.query)
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        
            
        
        await timeout(500);

        // if (amount > amountAvailable) {
        if (amount > orderAmount[0].quantityReleasable) {
            // req.reject({
            //             code: 'Object',
            //             message: 'AMOUNT',
            //             target: '/#TRANSIENT#',
            //             args: '-150'
            //           })
            req.reject(400, 'AMOUNT', '/#TRANSIENT#' ,[amount, orderAmount[0].uom ,orderAmount[0].quantityReleasable])
        }
        else {
            //Get Order Details
            const order = await tx.read(Orders).where({ID:id})
            const quantityReleased = order[0].quantityReleased
            const quantity = order[0].quantity
            const quantityProduced = order[0].quantityProduced
            const order_id = order[0].identifier
            const plant_code = order[0].to_plant_code
            const plant_id = order[0].to_plant_code
            const type = order[0].to_ordertype_code
            const material_id = order[0].to_material_ID
            const material = await tx.read(Materials).where({ID:material_id})
            const material_name = material[0].identifier
            const material_lot = material[0].lotSize
            

            //Calc new Amount
            const newAmount = quantityReleased + amount
            const amountAvailableNew = amountAvailable - amount
            const amountopenNew = quantity - quantityProduced
            var status = ''
            if(quantity === newAmount){
                status = 'O_003'
                req.notify(200, 'RELEASE', '/#TRANSIENT#' ,[amount])
                //releaseAC = false
            }else if (quantity > newAmount){
                status = 'O_002'
                req.notify(200, 'PARRELEASE', '/#TRANSIENT#' ,[amount])
            }else {
                status = order[0].to_status_code
            }
            
            const n = await tx.run ([ 
                UPDATE (Orders) .set({quantityReleased: newAmount,quantityReleasable: amountAvailableNew,quantityOpen: amountopenNew,to_status_code: status,modifiedBy: user}).where({ID:id})
            ]);
            //Get first assigned Operation
            console.log("Type?",type)
            if (type === 'PP01') {
                const operations = await tx.read(OrderOperations).where({to_order_ID:id/*,to_operations_code:'0010'*/})
                // console.log("Gibbet es das?",operations)
                var operation = operations[0].ID
            } else if (type === 'PP-PI-POR') {
                const phases = await tx.read(OrderPhases).where({to_order_ID:id/*,to_phases_code:'0010'*/})
                // console.log("Gibbet es das?",phases)
                var operation = phases[0].ID
            }
            

            //Get existing SFCs
            const SFC = await tx.read(Serials).where({to_order_ID:id})
            const startcount = SFC.length 

            //Create SFCs
            await createSFC(id,operation,amount,material_name,plant_code,plant_id,material_id,uom,order_id,startcount,type,material_lot)
            
            //Create notification for user
            const newSFCs = await tx.read(Serials).where({to_order_ID:id,isNew:true});
            
            if (Array.isArray(newSFCs)) {
                newSFCs.forEach(_emitNotification);
                //Change isNew to false
                newSFCs.forEach(_converToOld);
            } else {
                _emitNotification(newSFCs);
                //Change isNew to false
                _converToOld(newSFCs);
            }

        }
        //orderChangerFunction(id, req)
    })

    srv.on('reset', async (req) => {
        const tx = cds.transaction(req)
        const user = req.user.id
        const id = req.params[0].ID
        const Order = await tx.read(Orders).where({ID:id})
        console.log("Was??", Order[0].ID)
        async function _complete(SFC) {
            const n = await tx.run ([ 
                DELETE (Serials) .where({ID:SFC.ID})
            ]);
        }
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await timeout(500);
        const SFC = await tx.read(Serials).where({to_order_ID:id})
        if (Array.isArray(SFC)) {
            SFC.forEach(_complete);
        } else {
            _complete(SFC);

        }
        const n = await tx.run ([ 
            UPDATE (Orders) .set({quantityReleased: '0',quantityReleasable:Order[0].quantity ,quantityOpen: Order[0].quantity,to_status_code: 'O_001',modifiedBy: user}).where({ID:id})
        ]);
        
    })

    /**
     * Set technical flags, used
     for controlling UI behaviour, on the 'Incidents'
     entity
     *
     * @param orders {
         Incidents | Incidents[]
     }(Array of ) Incidents
     */
    // function setProgress (Orders, req) {
    //     console.log("ID", req)
    //     function _setFlags(orders) {
            
    //         // console.log("Combo Name", orders.to_currentOperation_ID)
    //         //     orders.phaseOperationName = orders.to_currentOperation.to_operations.combo
        
    //     }
    //     if (Array.isArray(Orders)) {
    //         Orders.forEach(_setFlags);
    //     } else {
    //         _setFlags(Orders);
    //     }
        
    // }
    async function setTechnicalFlags(Orders, req) {

        async function _setFlags(orders) {
            if(orders !== null) {
                orders.isDraft = !orders.IsActiveEntity;
                // field control on the 'identifier' property
                // console.log("QUERY:", orders)
                // const tx = cds.transaction(req)

                // const order = await tx.read("scp.dmc.Orders").where({ID:orders.ID})
                
                

                // if (order[0].to_currentOperation_ID != null) {
                //     console.log("######################Operation ID", order[0].to_currentOperation_ID)
                //     const phase = await tx.read("scp.dmc.OrderOperations").where({ID:order[0].to_currentOperation_ID})
                // }
                // else if (order[0].to_currentPhase_ID != null) {
                //     console.log("######################Phase ID", order[0].to_currentPhase_ID)
                //     const phase = await tx.read("scp.dmc.OrderPhases").where({ID:order[0].to_currentPhase_ID})
                //     console.log("######################Phase ID", phase[0].ID)
                //     const phaseOrigin = await tx.read("scp.dmc.Phases").where({code:phase[0].to_phases_code})
                //     console.log("######################Phase Name", phaseOrigin[0].combo)
                //     console.log("######################Name Before", orders.phaseOperationName)
                //     orders.phaseOperationName = phaseOrigin[0].combo
                //     console.log("######################Name After", orders.phaseOperationName)
                // }
                console.log("Wird gelesen HALLO")
                // if (orders.IsActiveEntity) {
                //     orders.identifierFieldControl = FieldControl.Optional;
                // } else if (orders.HasActiveEntity) {
                //     orders.identifierFieldControl = FieldControl.ReadOnly;
                // } else 
                orders.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                orders.isDraft = false

                orders.isNew = false
                orders.IsActiveEntity = true
                orders.materialProcessFieldControl = FieldControl.ReadOnly
                orders.materialProductionFieldControl = FieldControl.ReadOnly
                orders.createMandatoryFieldControl = FieldControl.ReadOnly
                orders.FieldControl = FieldControl.ReadOnly
                if (orders.to_status_code === null) {
                    

                    if(orders.to_plant_code != null) {
                        var isDiscreet = await getPlantInfo(req,orders.to_plant_code)
                        console.log("Ist wohl neu, plant wurde aber ausgewählt")
                        // const tx = cds.transaction(req)
                        
                        if (isDiscreet == false) {
                            orders.materialProcessFieldControl = FieldControl.Mandatory
                            orders.materialProductionFieldControl = FieldControl.Inapplicable
                            orders.createMandatoryFieldControl = FieldControl.Mandatory
                            orders.createFieldControl = FieldControl.Optional
                            
                    
                        } else {
                            orders.materialProcessFieldControl = FieldControl.Inapplicable
                            orders.materialProductionFieldControl = FieldControl.Mandatory
                            orders.createMandatoryFieldControl = FieldControl.Mandatory
                    orders.createFieldControl = FieldControl.Optional
                        }
                        
                        //orders.to_uom_code = uom //orders.to_material.to_uom_code
                    } else {
                        orders.materialProcessFieldControl = FieldControl.Inapplicable
                        orders.materialProductionFieldControl = FieldControl.Inapplicable
                        orders.createMandatoryFieldControl = FieldControl.Inapplicable
                        orders.createFieldControl = FieldControl.Inapplicable
                    }
                    orders.identifierFieldControl = FieldControl.Mandatory;
                    
                    orders.isNew = true;
                    orders.isDraft = true;
                    orders.IsActiveEntity = false;
                    //orders.to_uom_code = 'EA' //orders.to_material.to_uom_code
                    orders.FieldControl = FieldControl.Inapplicable
                    //orders.plantFieldControl = FieldControl.Mandatory
                    // if (orders.to_plant_code == null) {
                    //     orders.plantFieldControl = FieldControl.Mandatory
                    // } else {
                    //     orders.plantFieldControl = FieldControl.ReadOnly
                    // }
                    
                    orders.materialFieldControl = FieldControl.ReadOnly
                    orders.Hold_ac = false
                    orders.Prio_ac = false
                    orders.Release_ac = false
                } else {
                    orders.identifierFieldControl = FieldControl.Mandatory;
                }
                // console.log("Ist was geplant: ", orders.plannedStart);
                // console.log("Ist was terminiert: ", orders.scheduledStart);
                // console.log("Ist was gestartet: ", orders.start);
                if(orders.start != null && orders.scheduledStart !=null) {
                    orders.hidePlanned = true
                    orders.hideScheduled = true
                    orders.hideActive = false

                } else if (orders.start == null && orders.scheduledStart !=null) {
                    orders.hidePlanned = true
                    orders.hideScheduled = false
                    orders.hideActive = true

                } else {
                    orders.hidePlanned = false
                    orders.hideScheduled = true
                    orders.hideActive = true

                }
                if (orders.to_ordertype_code === 'PP01' || orders.to_ordertype_code === 'CP01') { 
                    orders.isNotDicrete = false
                    orders.isNotProcess = true
                    
                    
                }
                else if (orders.to_ordertype_code === 'PP-PI-POR' || orders.to_ordertype_code === 'CO01') { 
                    orders.isNotDicrete = true
                    orders.isNotProcess = false
                }

                if (orders.to_status_code === 'O_001') {
                    orders.Release_ac = true
                    orders.Change_ac = true
                }
                else if (orders.to_status_code === 'O_002') {
                    orders.Release_ac = true
                    orders.Change_ac = true
                    orders.Reset_ac = true
                }
                else if (orders.to_status_code === 'O_003') {
                    orders.Release_ac = false
                    orders.Reset_ac = true
                }
                else if (orders.to_status_code === 'O_007') {
                    orders.Release_ac = false
                }
                else if (orders.to_status_code === 'O_008') {
                    orders.Prio_ac = false
                    orders.Hold_ac = false
                } else {
                    orders.Hold_ac = false
                    orders.Prio_ac = false
                    orders.Release_ac = false
                }
                // console.log("QUERY:", orders)
                // if (orders.issueHoldsCrititcality) {
                    //orders.issueHoldsCrititcality = orders.hasIssues.issueHoldsCrititcality
                    // orders.issueTimeCrititcality = orders.hasIssues.issueTimeCrititcality
                    // orders.issueComponentCrititcality = orders.hasIssues.issueComponentCrititcality
                    // orders.issueQualityCrititcality = orders.hasIssues.issueQualityCrititcality
                // }
                
                // orders.quantityReleasable = orders.quantity - orders.quantityReleased
                // orders.quantityOpen = orders.quantityReleased - orders.quantityProduced
            }
            else {

            }
            
            // console.log("QUERY:", orders.quantityReleasable)

        }

        if (Array.isArray(Orders)) {
            Orders.forEach(_setFlags);
        } else {
            _setFlags(Orders);
        }
    }

    /**
     * Set technical flags, used
     for controlling UI behaviour, on the 'Incidents'
     entity
     *
     * @param Serials {
         Incidents | Incidents[]
     }(Array of ) Incidents
     */
    // function setProgress (Orders, req) {
    //     console.log("ID", req)
    //     function _setFlags(orders) {
            
    //         // console.log("Combo Name", orders.to_currentOperation_ID)
    //         //     orders.phaseOperationName = orders.to_currentOperation.to_operations.combo
        
    //     }
    //     if (Array.isArray(Orders)) {
    //         Orders.forEach(_setFlags);
    //     } else {
    //         _setFlags(Orders);
    //     }
        
    // }
    async function setTechnicalFlagsSerials(Serials, req) {

        async function _setFlags(Serial) {
            if(Serial !== null) {

                if (Serial.to_ordertype_code === 'PP01' || Serial.to_ordertype_code === 'CP01') { 
                    Serial.isNotDicrete = false
                    Serial.isNotProcess = true
                    
                    
                }
                else if (Serial.to_ordertype_code === 'PP-PI-POR' || Serial.to_ordertype_code === 'CO01') { 
                    Serial.isNotDicrete = true
                    Serial.isNotProcess = false
                }

            }
            else {

            }
            
            // console.log("QUERY:", orders.quantityReleasable)

        }

        if (Array.isArray(Serials)) {
            Serials.forEach(_setFlags);
        } else {
            _setFlags(Serials);
        }
    }


    /**
     * Set priority criticality used for display in LR table
     *
     * @param Incidents {
         Incidents | Incidents[]
     }(Array of ) Incidents
     */
    function setPriorityCriticality(Incidents) {

        function _setCriticality(incident) {
            if(incident !== null) {
                if (incident.priority) {
                    incident.priority.criticality = parseInt(incident.priority.code);
                }
            }
        }

        if (Array.isArray(Incidents)) {
            Incidents.forEach(_setCriticality);
        } else {
            _setCriticality(Incidents);
        }
    }

    /**
     * Validate a 'incident'
     entry
     *
     * @param req   Request
     */
    function validateincident(req) {
        // check mandatory properties
        if (!req.data.identifier) {
            req.error(400, "Enter an Incident Identifier", "in/identifier");
        }
    }
    srv.on('createRandom', async (req) => {
        
        // Get User
        const user = req.user.id
        // Get Plant
        const plant = req.data.plant
        // Get Material
        const material = req.data.material
        // Get Status
        const status = req.data.status
        // Get Amount
        const amount = req.data.amount

        if (amount > 500) {
            req.reject({
                code: 'Object',
                message: 'Sorry any amount greater then 500 is not allowed',
                target: '/#TRANSIENT#'
              })
        }
        
        // console.log("Params Plant", req.data.plant)
        // console.log("Params Material", req.data.material)
        await prepareOrders(user,plant,amount,material,status,req);

    })    
    async function prepareOrders(user,plant,amount,material,statusOrder,req) {   
        const tx = cds.transaction(req) 
        
        //Check material
        if (plant == null) {
            plant = '001'
        }
        if (material == null) {
            // Randomize material
            var Materials = await tx.read('scp.dmc.Materials').where({to_procurementType_code:"Manufactured"}) // Read available material
            var availableMaterials = Materials.length - 1
            console.log("Wieviel Materials gibt es", Materials.length)
        } else {
            var Materials = await tx.read('scp.dmc.Materials').where({ID:material}) // Read available material
            var availableMaterials = 0;
        }
        

        const Orders = await tx.read('scp.dmc.Orders') // determine next order ID
        orderID = Orders[Orders.length-1].identifier // get last order ID
        orderID = ++orderID
        orderID++ // set first order ID
        

        for (let i = 0; i < amount; i++) { 
            //Generate Order Data
            var OrderInfo = {}

            //GUID
            OrderInfo.ID = generateGuid(); // generate GUUID

            //Set ID
            //var orderID
            OrderInfo.identifier = orderID;
           
            // Material 
            var RandomMaterial = randomIntFromInterval(0, availableMaterials); // Random number between 0 and 3, needs to be increased if more material is available

            //console.log("Material is", Materials[RandomMaterial].identifier)
            OrderInfo.to_material_ID = Materials[RandomMaterial].ID;
            OrderInfo.to_bom_ID = Materials[RandomMaterial].to_boms_ID; // set bom from material
            OrderInfo.to_routing_ID = Materials[RandomMaterial].to_routings_ID; // set rounting from material
            OrderInfo.to_uom_code = Materials[RandomMaterial].to_uom_code // set uom from material
            
            


            // Set order type
            if (Materials[RandomMaterial].processing == "Parallel") {
                OrderInfo.to_ordertype_code = "PP-PI-POR";
                // Randomize quantity
                var quantity = randomIntFromInterval(100, 500); // generate order quantity between 100 and 500


            } else {
                OrderInfo.to_ordertype_code = "PP01";
                // Randomize quantity
                var quantity = randomIntFromInterval(10, 60); // generate order quantity between 10 and 60
            }
            OrderInfo.quantity = quantity;
            OrderInfo.quantityReleased = quantity;	

            //Read Components to check component availablility -> if components are out of stock change order status to released
            const BOMComponents = await tx.read('scp.dmc.BOMComponents').where({to_bom_ID:Materials[RandomMaterial].to_boms_ID}) // Read available material
            var hasMissing = false;
            

            for (let i = 0; i < BOMComponents.length; i++) { 
                
                const MaterialStock = await tx.read('scp.dmc.Materials').where({ID:BOMComponents[i].to_material_ID})
                //console.log("Unrestricted stock is",MaterialStock[0].unrestrictedUseStock, "Restricted stock is", MaterialStock[0].restricedUseStock)
                var quantityNeeded = quantity * BOMComponents[i].quantity
                if (quantityNeeded > MaterialStock[0].unrestrictedUseStock) {
                    hasMissing = true
                }  
            }
            

            // Randomzie status (Release/Confirmed)
            var status = randomIntFromInterval(0, 200); // generate number for status between 0 and 200 -> thus more likely to get a confirmed order
            OrderInfo.scheduledStart;	
            OrderInfo.scheduledEnd;	
            OrderInfo.start;	
            OrderInfo.end;	
            if (statusOrder == "O_003") {
                status = 199
            } else if (statusOrder == "O_006") {
                status = 1
            }
            if (status > 100) {
                
                OrderInfo.to_status_code = "O_003";	
                OrderInfo.quantityProduced = 0;	
                OrderInfo.quantityOpen = quantity;
                //Set time in the future
                var now = new Date();
                var plannedStart = new Date();
                var plannedEnd = new Date();
                plannedStart.setTime(now.getTime() + (1440 * 60 * 1000)); //plan for 24h in the future
                plannedEnd.setTime(plannedStart.getTime() + (30 * (quantity / Materials[RandomMaterial].lotSize) * 60 * 1000)); //30 mins per quantity devided by lot size
                OrderInfo.plannedStart = plannedStart;	
                OrderInfo.plannedEnd = plannedEnd;	
                //Split date for timestamp -> Does not work.. need to find new method
                var plannedRelease = plannedStart + '',
                    myDate = plannedRelease.split("T"),
                    NUDELZ = new Date(plannedStart).getTime(),
                    myTime = myDate[1].split("Z");

                

                

            } else {
                OrderInfo.to_status_code = "O_006";
                OrderInfo.quantityProduced = quantity;
                OrderInfo.quantityOpen = 0;	
                var now = new Date();
                var plannedStart = new Date();
                var plannedEnd = new Date();
                var start = new Date();
                var end = new Date();
                plannedStart.setTime(now.getTime() - (144000 * 60 * 1000));
                plannedEnd.setTime(plannedStart.getTime() + (30 * (quantity / Materials[RandomMaterial].lotSize) * 60 * 1000)); //30 mins per quantity devided by lot size	
                OrderInfo.plannedStart = plannedStart;	
                OrderInfo.plannedEnd = plannedEnd;	
                OrderInfo.scheduledStart = plannedStart;	
                OrderInfo.scheduledEnd = plannedEnd;	
                OrderInfo.start = start.setTime(plannedStart.getTime() + (20 * 60 * 1000)) //A little delay of the actual start
                OrderInfo.end = end.setTime(plannedEnd.getTime() + (20 * 60 * 1000)) //A little delay of the actual end -> might needs to be adjusted if "Issues" appear
            }
            
            OrderInfo.quantityScrap = 0;	
            OrderInfo.quantityReleasable = 0;	

            // Randomzie prio
            var prio = randomIntFromInterval(1, 3)
            if (prio == 3) {
                prio = "3_low"
            } else if (prio == 2) {
                prio = "2_medium"
            } else {
                prio = "1_high"
            }

            // Randomize StartDate 
            
            // Randomize Customer
            var Customer = randomIntFromInterval(1, 3)
            OrderInfo.to_prio_code = prio;	
            OrderInfo.to_customer_code = '0000000' + Customer;	
            OrderInfo.to_customer_order_code;	
            OrderInfo.to_productionType_code;	
            OrderInfo.isERP = true;	
            
            
            
            OrderInfo.scheduledRelease = plannedRelease;	
            OrderInfo.to_plant_code = plant;	
            OrderInfo.to_currentOperation_ID;		
            OrderInfo.to_plant1_code;	
            OrderInfo.createdByNav_code = user;	
            OrderInfo.modifiedByNav_code = user;	
            OrderInfo.hasDefects;	
            OrderInfo.to_ordertype_code

            orderID++
            await createComponents(tx,OrderInfo);
            var currentOpPhase = await createOperationsPhases(tx,OrderInfo);
            if (OrderInfo.to_status_code == "O_006") {
                OrderInfo.to_currentOperation_ID = currentOpPhase[1]
            } else {
                OrderInfo.to_currentOperation_ID = currentOpPhase[0]
            }
            await createSFCs(tx,OrderInfo,Materials[RandomMaterial]);
            await createSFCToRouting(tx,OrderInfo)
            await createSFCToComponents(tx,OrderInfo,Materials[RandomMaterial])
            
            OrderInfo.quantity = quantity;	
            OrderInfo.quantityReleased = quantity;	
            await createOrders(tx,OrderInfo);

            if (hasMissing == true) {

            }

            if (OrderInfo.to_status_code == "O_006") {
                await createQuantityConfirmations(tx,OrderInfo)
                
                if(OrderInfo.to_ordertype_code == "PP-PI-POR") {
                    await createConfirmations(tx,OrderInfo)
                }
                if(OrderInfo.to_ordertype_code == "PP01") {
                    await createDataCollection(tx,OrderInfo)
                    await createSFCToQuantityConfirmations(tx,OrderInfo)
                }
            }
        }

        //const Order = await tx.read(Orders).where({ID:id})

        // async function _complete(SFC) {
        //     const n = await tx.run ([ 
        //         DELETE (Serials) .where({ID:SFC.ID})
        //     ]);
        // }
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await timeout(500);
        
        req.notify({
            code: 'Object',
            message: 'Bingo! '+ user,
            target: '/#TRANSIENT#'
          })
        // const SFC = await tx.read(Serials).where({to_order_ID:id})
        // if (Array.isArray(SFC)) {
        //     SFC.forEach(_complete);
        // } else {
        //     _complete(SFC);

        // }
        // const n = await tx.run ([ 
        //     UPDATE (Orders) .set({quantityReleased: '0',quantityReleasable:Order[0].quantity ,quantityOpen: Order[0].quantity,to_status_code: 'O_001',modifiedBy: user}).where({ID:id})
        // ]);
        
    }

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
      
      
    function generateGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
    
    async function createOrders(tx,OrderInfo) {

        const n = await tx.run (INSERT.into ('scp.dmc.Orders').entries ({
            ID:	OrderInfo.ID,
            identifier:	OrderInfo.identifier,
            to_material_ID: OrderInfo.to_material_ID,	
            to_bom_ID: OrderInfo.to_bom_ID,
            to_routing_ID: OrderInfo.to_routing_ID,
            quantity: OrderInfo.quantity,	
            to_uom_code: OrderInfo.to_uom_code,	
            quantityReleased: OrderInfo.quantityReleased,	
            quantityProduced: OrderInfo.quantityProduced,	
            quantityScrap: OrderInfo.quantityScrap,	
            quantityReleasable: OrderInfo.quantityReleasable,	
            quantityOpen: OrderInfo.quantityOpen,	
            to_status_code: OrderInfo.to_status_code,	
            to_prio_code: OrderInfo.to_prio_code,	
            to_customer_code: OrderInfo.to_customer_code,	
            to_customer_order_code: OrderInfo.to_customer_order_code,	
            to_productionType_code: OrderInfo.to_productionType_code,	
            isERP: OrderInfo.isERP,	
            start: OrderInfo.start,	
            end: OrderInfo.end,	
            plannedStart: OrderInfo.plannedStart,	
            plannedEnd: OrderInfo.plannedEnd,	
            scheduledStart: OrderInfo.scheduledStart,	
            scheduledEnd: OrderInfo.scheduledEnd,	
            scheduledRelease: OrderInfo.scheduledRelease,	
            Delete_mc: false,	
            Edit_mc: false,	
            to_plant_code: OrderInfo.to_plant_code,	
            to_currentOperation_ID: OrderInfo.to_currentOperation_ID,		
            to_plant1_code: OrderInfo.to_plant1_code,	
            createdByNav_code: OrderInfo.createdByNav_code,	
            modifiedByNav_code: OrderInfo.modifiedByNav_code,	
            hasDefects: OrderInfo.hasDefects,	
            to_ordertype_code: OrderInfo.to_ordertype_code
        }));

    }
    async function createComponents(tx,OrderInfo) {
        // Get Bom
        //OrderInfo.to_bom_ID = "5a660afc-4854-4e02-9a1a-24f93ed5cbf5"
        const BOMComponents = await tx.read('scp.dmc.BOMComponents').where({to_bom_ID:OrderInfo.to_bom_ID}) // Read components

        async function _createComponents(BOMComponent){

            var quantity = OrderInfo.quantity * BOMComponent.quantity,
                quantityOpen,
                quantityConsumed,
                quantityCommitted1,
                quantityCommitted2,
                quantityUncovered;
            quantity =    Math.round(quantity * 100) / 100
            if (OrderInfo.to_status_code == 'O_006') {
                quantityOpen = 0;
                quantityConsumed = quantity;
                quantityCommitted1 = 0;
                quantityCommitted2 = 0
                quantityUncovered = 0;
            } else {
                quantityOpen = quantity;
                quantityConsumed = 0;
                quantityCommitted1 = quantity;
                quantityCommitted2 = 0
                quantityUncovered = 0;
            }
            const n = await tx.run (
                INSERT.into ('scp.dmc.OrderComponents').entries ({
                    to_material_ID:BOMComponent.to_material_ID,
                    to_bom_ID:BOMComponent.to_bom_ID,
                    to_order_ID:OrderInfo.ID,
                    quantity:quantity,
                    quantityOpen:quantityOpen,
                    quantityConsumed:quantityConsumed,
                    quantityCommitted1: quantityCommitted1,
                    quantityCommitted2: quantityCommitted2,
                    quantityUncovered: quantityUncovered,
                    criticality:0,
                    hasMissing:false,
                })
            );
        }

        if (Array.isArray(BOMComponents)) {
            BOMComponents.forEach(_createComponents);
        } else {
            _createComponents(BOMComponents);
        }

        

    }
    async function createOperationsPhases(tx,OrderInfo) {
        // Get Operations/Phases
        const Operations = await tx.read('scp.dmc.Operations').where({to_routing_ID:OrderInfo.to_routing_ID}) // Read steps
        var firstOP,
            lastOP;
        for (let i = 0; i < Operations.length; i++) { 
            //GUID
            var ID = generateGuid(); // generate GUUID
            if (i == 0) {
                firstOP = ID 
            } else {
                lastOP = ID 
            }
            var quantity = OrderInfo.quantity,
                quantityProduced,
                criticality;
            if (OrderInfo.to_status_code == 'O_006') {
                quantityProduced = quantity;
                criticality = 3;
            } else {
                quantityProduced = 0;
                criticality = 0;
            }
            var opsID = Operations[i].ID
            const n = await tx.run (
                INSERT.into ('scp.dmc.OrderOperationsAndPhases').entries ({
                    ID: ID,
                    startTime: OrderInfo.plannedStart,
                    endTime: OrderInfo.plannedEnd,
                    to_order_ID:OrderInfo.ID,
                    to_operations_ID: opsID,
                    quantity:quantity,
                    quantityProduced:quantityProduced,
                    criticality:criticality,
                    to_status_code: OrderInfo.to_status_code
                })
            );

        }
        var firstLast = [firstOP,lastOP]
        return firstLast;
        // if (Array.isArray(Operations)) {
        //     Operations.forEach(_createOPS);
        // } else {
        //     _createOPS(Operations);
        // }

        

    }
    
    async function createSFCs(tx,OrderInfo,Material,startcount /*id,operation,amount,material,plant_code,OrderInfo.to_plant_code,material_id,uom,order_id,startcount,type,material_lot*/) {
        if (OrderInfo.to_status_code == "O_001") {
            var to_status_code = 'SF_001'
        } else if (OrderInfo.to_status_code == "O_003") {
            var to_status_code = 'SF_002'
        } else if (OrderInfo.to_status_code == "O_006") {
            var to_status_code = 'SF_004'
        }
            
        //const tx = cds.transaction(req)
        //startcount++
        var startcount = 1;
        if (OrderInfo.to_ordertype_code === 'PP01') {
            for (let i = 0; i < OrderInfo.quantity; i++) {
                var identifier = OrderInfo.to_plant_code + '-' + Material.identifier +'-'+OrderInfo.identifier+'-'+startcount;
                const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
                    identifier:identifier,to_order_ID: OrderInfo.ID,to_orderOperationsAndPhases_ID:OrderInfo.to_currentOperation_ID,to_plant_code: OrderInfo.to_plant_code,quantity:1,to_status_code:to_status_code,uom:OrderInfo.to_uom_code,to_material_ID:Material.ID
                }));
                startcount++;
            } 
        } else if (OrderInfo.to_ordertype_code === 'PP-PI-POR') {
            if (OrderInfo.quantity <= Material.lotSize) {
                console.log("TEST ", OrderInfo.quantity)
                var identifier = OrderInfo.to_plant_code + '-' + Material.identifier +'-'+OrderInfo.identifier+'-'+startcount;
                const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
                    identifier:identifier,to_order_ID: OrderInfo.ID,to_orderOperationsAndPhases_ID:OrderInfo.to_currentOperation_ID,to_plant_code: OrderInfo.to_plant_code,quantity:OrderInfo.quantity,to_status_code:to_status_code,uom:OrderInfo.to_uom_code,to_material_ID:Material.ID
                    //identifier:identifier,to_order_ID: OrderInfo.ID,to_orderOperationsAndPhases_ID:operation,to_plant_code: OrderInfo.to_plant_code,quantity:quantity,to_status_code:'SF_001',uom:uom,to_material_ID:material_id
                }));
            } else {
                var amountOfSFCs = OrderInfo.quantity / Material.lotSize
                var counter = Math.trunc(amountOfSFCs)
                if (amountOfSFCs > counter) {
                    counter++
                }
                var amount_temp = Material.lotSize
                

                for (let i = 0; i < counter; i++) {
                    if (OrderInfo.quantity>Material.lotSize) {
                        amount_temp = Material.lotSize
                    } else {
                        amount_temp = OrderInfo.quantity
                    }
                    var identifier = OrderInfo.to_plant_code + '-' + Material.identifier +'-'+OrderInfo.identifier+'-'+startcount;
                    const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
                        
                        identifier:identifier,to_order_ID: OrderInfo.ID,to_orderOperationsAndPhases_ID:OrderInfo.to_currentOperation_ID,to_plant_code: OrderInfo.to_plant_code,quantity:amount_temp,to_status_code:to_status_code,uom:OrderInfo.to_uom_code,to_material_ID:Material.ID
                        //identifier:identifier,OrderInfoID: OrderInfo.ID,to_orderOperationsAndPhases_ID:operation,to_plant_code: OrderInfo.to_plant_code,quantity:amount_temp,to_status_code:'SF_001',uom:uom,to_material_ID:material_id
                    }));
                    startcount++;
                    OrderInfo.quantity = OrderInfo.quantity - Material.lotSize
                } 
            }
            // for (let i = 0; i < amount; i++) {
            //     var ider = OrderInfo.to_plant_code + '-' + material +'-'+order_id+'-'+startcount;
            //     const n = await tx.run (INSERT.into ('scp.dmc.Serials').entries ({
            //         identifier:ider,to_order_ID: id,to_orderPhases_ID:operation,to_plant_code: plant_code,quantity:1,to_status_code:'SF_001',uom:uom,to_material_ID:material_id
            //     }));
            //     startcount++;
            // } 
        }
        
          
    }
    async function createSFCToRouting(tx,OrderInfo) {
        const Steps = await tx.read('scp.dmc.OrderOperationsAndPhases').where({to_order_ID:OrderInfo.ID}) // Read steps
        var type;
        if (OrderInfo.to_ordertype_code == 'PP01') {
            type = "operation"
        } else {
            type = "phase"
        }
        var isCurrent = true;
        for (let i = 0; i < Steps.length; i++) {
            var status = "";
                if (i == 0) {
                    status = "SF_002";
                }
            const SFCs = await tx.read('scp.dmc.Serials').where({to_order_ID:OrderInfo.ID}) // Read SFCs
            if (OrderInfo.to_status_code == "O_006") {
                var isCurrent = false;
                if (i == Steps.length-1) {
                    console.log("LAST STEP")
                    var isCurrent = true;
                }
            }
            
            for (let y = 0; y < SFCs.length; y++) {
                
                var quantityProduced = 0,
                    criticality = 0,
                    startTime,
                    endTime;
                
                if (OrderInfo.to_status_code == "O_006") {
                    quantityProduced = SFCs[y].quantity
                    status = "SF_004";
                    criticality = 3;
                    startTime = Steps[i].startTime;
                    endTime = Steps[i].endTime;
                }
                
                const n = await tx.run (
                    
                    INSERT.into ('scp.dmc.SFCToOperationPhasesList').entries ({
                        to_step_ID: Steps[i].ID,
                        to_SFC_ID: SFCs[y].ID,
                        quantity: SFCs[y].quantity,
                        quantityProduced: quantityProduced,
                        quantityPending: 0,
                        quantityQueue: 0,
                        quantityInWork: 0,
                        to_status_code: status,
                        criticality: criticality,
                        startTime: startTime,
                        endTime: endTime,
                        type: type,
                        isCurrent: isCurrent
                    })
                );
                
                
            }
            isCurrent = false;
        }
        

    }
    async function createSFCToComponents(tx,OrderInfo,Material) {
        const Components = await tx.read('scp.dmc.OrderComponents').where({to_order_ID:OrderInfo.ID}) // Read steps
       //console.log("KOMPONENTEN!!!!",Components)
        
        for (let i = 0; i < Components.length; i++) {
            const SFCs = await tx.read('scp.dmc.Serials').where({to_order_ID:OrderInfo.ID}) // Read SFCs
            var Material = await tx.read('scp.dmc.Materials').where({ID:OrderInfo.to_material_ID}) // Read SFCs
            var MaterialComponent = await tx.read('scp.dmc.Materials').where({ID:Components[i].to_material_ID}) 
            // console.log("Material LOT", Material[0].lotSize, Material[0].identifier)
            var BOMComponents = await tx.read('scp.dmc.BOMComponents').where({to_bom_ID:OrderInfo.to_bom_ID}) // Read components

            var quantityTotal = OrderInfo.quantityReleased * BOMComponents[i].quantity,
                quantityPerUnit = BOMComponents[i].quantity * Material[0].lotSize;
            // console.log("!--------------------------------!")
            // console.log("Material", MaterialComponent[0].identifier)
            // console.log("BOM Quantity per 1", BOMComponents[i].quantity)
            
            // console.log("Menge Total", quantityTotal)
            // console.log("Menge pro Unit", quantityPerUnit)
            // console.log("!--------------------------------!")

            for (let y = 0; y < SFCs.length; y++) {
                if (quantityTotal >= quantityPerUnit) {

                    quantityTotal = quantityTotal - quantityPerUnit;
                } else {
                    quantityPerUnit = quantityTotal;
                    // console.log("--------------------------------")
                    // console.log("Menge pro Unit", quantityPerUnit)
                    quantityPerUnit = Math.round(quantityPerUnit * 100) / 100
                    // console.log("Menge pro Unit gerundet", quantityPerUnit)
                    // console.log("--------------------------------")
                }
                var quantityConsumed = 0,
                    quantityOpen = quantityPerUnit,
                    quantityCommitted1 = quantityPerUnit
                
                if (OrderInfo.to_status_code == "O_006") {
                    quantityConsumed = quantityPerUnit;
                    quantityOpen = 0;
                    quantityCommitted1 = 0;
                }
                const n = await tx.run (
                    INSERT.into ('scp.dmc.SFCComponents').entries ({
                        to_components_ID: Components[i].ID,
                        to_SFC_ID: SFCs[y].ID,
                        quantity: quantityPerUnit,
                        quantityConsumed: quantityConsumed,
                        quantityOpen: quantityOpen,
                        quantityCommitted1: quantityCommitted1,
                        quantityCommitted2: 0,
                        quantityUncovered: 0,
                        componentScrap: 0,
                        criticality: 0,
                    })
                );
                
                
            }
        }
        

    }
    async function createQuantityConfirmations(tx,OrderInfo) {
        const OperationsPhases = await tx.read('scp.dmc.OrderOperationsAndPhases').where({to_order_ID:OrderInfo.ID}) // Read Operations and Phases
        const OrderQuantityConfirmations = await tx.read('scp.dmc.OrderQuantityConfirmations') // determine next order ID
        confirmationNO = OrderQuantityConfirmations[OrderQuantityConfirmations.length-1].confirmationNO // get last order ID
        confirmationNO++ // set first order ID
        for (let i = 0; i < OperationsPhases.length; i++) {
        const SFCs = await tx.read('scp.dmc.Serials').where({to_order_ID:OrderInfo.ID}) // Read SFCs
            for (let y = 0; y < SFCs.length; y++) {
                if(y == SFCs.length-1) {
                    const n = await tx.run (
                        INSERT.into ('scp.dmc.OrderQuantityConfirmations').entries ({
                            confirmationNO: confirmationNO,
                            confirmationCounter: y+1,
                            reversed: false,
                            reversal: false,
                            reversedCounter: 0,
                            finalConfirmation: true,
                            quantity: SFCs[y].quantity,
                            produced: SFCs[y].quantity,
                            scrap: 0,
                            rework: 0,
                            to_uom_code: SFCs[y].uom,
                            to_order_ID: OrderInfo.ID,
                            to_SFC_ID: SFCs[y].ID,
                            to_orderOperationsAndPhases_ID: OperationsPhases[i].ID,
                            createdByNav_code: "c123456"
                        })
                    );
                } else {
                    const n = await tx.run (
                        INSERT.into ('scp.dmc.OrderQuantityConfirmations').entries ({
                            confirmationNO: confirmationNO,
                            confirmationCounter: y+1,
                            reversed: false,
                            reversal: false,
                            reversedCounter: 0,
                            finalConfirmation: false,
                            quantity: SFCs[y].quantity,
                            produced: SFCs[y].quantity,
                            scrap: 0,
                            rework: 0,
                            to_uom_code: SFCs[y].uom,
                            to_order_ID: OrderInfo.ID,
                            to_SFC_ID: SFCs[y].ID,
                            to_orderOperationsAndPhases_ID: OperationsPhases[i].ID,
                            createdByNav_code: "c123456"
                        })
                    );
                }
                
                
            }
            confirmationNO++ 
        }  
    }
    async function createSFCToQuantityConfirmations(tx,OrderInfo) {
        const Confirmations = await tx.read('scp.dmc.OrderQuantityConfirmations').where({to_order_ID:OrderInfo.ID}) // Read steps
       
        
        for (let i = 0; i < Confirmations.length; i++) {
            const SFCs = await tx.read('scp.dmc.Serials').where({to_order_ID:OrderInfo.ID}) // Read SFCs
            for (let y = 0; y < SFCs.length; y++) {
                const n = await tx.run (
                    INSERT.into ('scp.dmc.SFCToOrderConfirmations').entries ({
                        to_confirmation_ID: Confirmations[i].ID,
                        to_SFC_ID: SFCs[y].ID,
                        quantity: SFCs[y].quantity,
                        produced: SFCs[y].quantity,
                        scrap: 0,
                        rework: 0,
                    })
                );
            }
        }
        

    }
    async function createConfirmations(tx,OrderInfo) {
        const OperationsPhases = await tx.read('scp.dmc.OrderOperationsAndPhases').where({to_order_ID:OrderInfo.ID}) // Read Operations and Phases
        const OrderConfirmations = await tx.read('scp.dmc.OrderConfirmations') // determine next order ID
        console.log("OrderConfirmations", OrderConfirmations.length)
        if(OrderConfirmations.length > 0) {
            var confirmationNO = OrderConfirmations[OrderConfirmations.length-1].confirmationNO // get last order ID
            confirmationNO++ // set first order ID
        } else {
            var confirmationNO = 100000 
        }
        
        const SFCs = await tx.read('scp.dmc.Serials').where({to_order_ID:OrderInfo.ID}) // Read SFCs
        
        for (let i = 0; i < OperationsPhases.length; i++) {
            var amount = SFCs.length * 0.5,
            machineHours = amount * 0.7,
            energy = amount * 2,
            steam = amount * 3;
            if (i == 0) {
                steam = 0
            } else if (i == 1) {
                steam = 0
                machineHours = machineHours * 2
                machineHours = Math.round(machineHours * 100) / 100
            }  else if (i == 3) {
                steam = 0
                machineHours = machineHours * 2
                machineHours = Math.round(machineHours * 100) / 100
                amount = 0
            }
            const n = await tx.run (
                INSERT.into ('scp.dmc.OrderConfirmations').entries ({
                    confirmationNO: confirmationNO,
                    confirmationCounter: 1,
                    reversed: false,
                    reversal: false,
                    reversedCounter: 0,
                    finalConfirmation: true,
                    hours: amount,
                    to_uom_hours_code: 'HRS',
                    machineHours: machineHours,
                    to_uom_machineHours_code: 'HRS',
                    energy: energy,
                    to_uom_energy_code: 'KWH',
                    steam: steam,
                    to_uom_steam_code: 'M3',
                    to_order_ID: OrderInfo.ID,
                    to_orderOperationsAndPhases_ID: OperationsPhases[i].ID,
                    createdByNav_code: "c123456"
                })
            );    
            confirmationNO++ 
        }  
    }
    async function createDataCollection(tx,OrderInfo) {
        const OperationsPhases = await tx.read('scp.dmc.OrderOperationsAndPhases').where({to_order_ID:OrderInfo.ID}) // Read Operations and Phases
        const OrderInspections = await tx.read('scp.dmc.OrderInspections') // determine next order ID
        console.log("OrderInspections", OrderInspections.length)
        if(OrderInspections.length > 0) {
            console.log("Get Lot NO")
            var lotNO = OrderInspections[OrderInspections.length-1].lotNO // get last order ID
            lotNO++ // set first order ID
            console.log("Get Lot NO", lotNO)
        } else {
            var lotNO = 100000 
        }
        
        const SFCs = await tx.read('scp.dmc.Serials').where({to_order_ID:OrderInfo.ID}) // Read SFCs
        //var amount = SFCs.length * 0.5;
        for (let i = 0; i < SFCs.length; i++) {
            const n = await tx.run (
                INSERT.into ('scp.dmc.OrderInspections').entries ({
                    lotNO: lotNO,
                    lotType: 'In-process insp. for manufacturing order (03)',
                    characteristics: 7,
                    characteristicsProgress: 7,
                    operations: 1,
                    usageDecisionCode: 0815,
                    quantity: SFCs[i].quantity,
                    actualQuantity: SFCs[i].quantity,
                    descr: '',
                    uom: SFCs[i].uom,
                    to_order_ID: OrderInfo.ID,
                })
            );    
            lotNO++ 
        }  
    }
})
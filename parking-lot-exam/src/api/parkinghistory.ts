import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParam";
import _ from 'lodash';
import parkinghistory from "../modules/parkinghistory";
import { deleteEnDB, selectDB } from "../lib/database/query";
import parkingLot from "../modules/parkinglot";
import parkingEntrance from "../modules/parkingentrance";
import { addDays, addHours, differenceInMinutes, format, parse, parseISO } from "date-fns";

export const parkingHistoryRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/history/:id');

    const returnpathParam = getPathParams(req.url as string, '/history/return/:id');
    const unparkpathParam = getPathParams(req.url as string, '/history/unpark/:id');
    // const leavepathParam = getPathParams(req.url as string, '/history/temporary/:id');

    try {

        switch (req.method) {
            case 'POST':
                if (pathParam.id !== undefined) {
                    const getGate = new parkingEntrance(pathParam.id);

                    if (await getGate.get() !== "Not found") {
                        const getParkingLot = _.sortBy(await selectDB("ParkingLot"), "parkingLotNumber")
                        let parkingArea;
                        if (getGate.data.entranceName === "Gate A") {
                            parkingArea = _.filter(getParkingLot, {"parkingLotPosition": "L", "parkingAvailability": true})
                            if (parkingArea.length === 0) {
                                return "No more available parking lots";
                            }
                        }
                        if (getGate.data.entranceName === "Gate B") {
                            parkingArea = _.filter(getParkingLot, {"parkingLotPosition": "M", "parkingAvailability": true})
                            if (parkingArea.length === 0) {
                                return "No more available parking lots";
                            }
                        }
                        if (getGate.data.entranceName === "Gate C") {
                            parkingArea = _.filter(getParkingLot, {"parkingLotPosition": "R", "parkingAvailability": true})
                            if (parkingArea.length === 0) {
                                return "No more available parking lots";
                            }
                        }

                        let parkingData;

                        const postresult = await getJSONDataFromRequestStream(req) as { carSize: string}

                        let parking;
                        const parkingLotDistance: any[] = [];

                        if (postresult.carSize === "S") {
                            parking = _.filter(parkingArea, function(data){
                                return data.parkingLotSize === "SP" || data.parkingLotSize === "MP" || data.parkingLotSize === "LP"
                            });


                            _.map(parking, function (data) {
                                parkingLotDistance.push(data.parkingLotDistance)
                            })
                            const minimumDistance = _.min(parkingLotDistance)
                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                        }

                        if (postresult.carSize === "M") {
                            parking = _.filter(parkingArea, function(data){
                                return data.parkingLotSize === "MP" || data.parkingLotSize === "LP"
                            });

                            _.map(parking, function (data) {
                                parkingLotDistance.push(data.parkingLotDistance)
                            })
                            const minimumDistance = _.min(parkingLotDistance)
                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                        }

                        if (postresult.carSize === "L") {
                            parking = _.filter(parkingArea, ["parkingLotSize", "LP"]);

                            _.map(parking, function (data) {
                                parkingLotDistance.push(data.parkingLotDistance)
                            })
                            const minimumDistance = _.min(parkingLotDistance)
                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                        }
                        const post = { parkingID: parkingData?.parkingID as string, parkingLotNumber: parkingData?.parkingLotNumber as number, carSize: postresult.carSize as string, parkDateStart: new Date() as Date }
                        const postmodel = new parkinghistory(post);

                        if (await postmodel.getparkingHistory() === "Not found") {
                            await postmodel.insert();

                            const updatemodel = new parkingLot(parkingData?.parkingID as string)
                            await updatemodel.get();

                            const updateData = {parkingAvailability:false as boolean}
                            updatemodel.data = {...updatemodel.data, ...updateData}
                            await updatemodel.update();

                            return "Successfully parked!"
                        }
                    } else {
                        return "Gate Entrance does not exist!"
                    }
                } else {
                    return "Please select a Gate to enter through..."
                }
            case 'PUT':
                if(req.url?.match('/history/unpark/')){
                    if(unparkpathParam.id!==undefined){
                        const putresult = await getJSONDataFromRequestStream(req) as {parkDateEnd: Date, parkingStatus: string}
                        const getModel = new parkinghistory(unparkpathParam.id);
                        if (await getModel.get() !== "Not found") {
                            if(await getModel.data.parkingStatus==="active"){
                                
                                const parkDateStart = parseISO(JSON.stringify(new Date(getModel.data.parkDateStart)).replace(/['"`]+/g, '')).toLocaleString();
                                const parkDateEnd = parseISO(JSON.stringify(new Date(putresult.parkDateEnd)).replace(/['"`]+/g, '')).toLocaleString();
                
                                const totalHours = differenceInMinutes(new Date(parkDateEnd), new Date(parkDateStart)) / 60;
                                let totalPay:Number = 0;
                                let extraHours:any;
                                let extraDays:Number;
        
                                const parkingData = new parkingLot(getModel.data.parkingID);
                                await parkingData.get();
        
                                if(totalHours>3){
                                    const parkingAvailability = { parkingAvailability: true as boolean };
                                    parkingData.data = { ...parkingData.data, ...parkingAvailability };
                                    await parkingData.update();
    
                                    if(totalHours>24){
                                        const divideDays = (Number(totalHours.toFixed(0)) / 24).toString().split(".");
                                        extraDays = parseInt(divideDays[0]);
                                        extraHours = (Number(totalHours.toFixed(0))%24).toString().split(".");
        
                                        if (parkingData.data.parkingLotSize === "SP") {
                                            totalPay = Number(extraHours[0]) * 20 + (Number(extraDays) * 5000)
                                            const putData = {currentFee: totalPay as number, parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                            getModel.data = { ...getModel.data, ...putData };
                                            await getModel.update();
                                        }
                                        if (parkingData.data.parkingLotSize === "MP") {
                                            totalPay = Number(extraHours[0]) * 60 + (Number(extraDays) * 5000)
                                            const putData = {currentFee: totalPay as number, parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                            getModel.data = { ...getModel.data, ...putData };
                                            await getModel.update();
                                        }
                                        if (parkingData.data.parkingLotSize === "LP") {
                                            totalPay = Number(extraHours[0]) * 100 + (Number(extraDays) * 5000)
                                            const putData = {currentFee: totalPay as number, parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                            getModel.data = { ...getModel.data, ...putData };
                                            await getModel.update();
                                        }
                                    }else{
                                        if (parkingData.data.parkingLotSize === "SP") {
                                            totalPay = Number(totalHours.toFixed(0)) * 20;
                                            const putData = {currentFee: totalPay as number, parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                            getModel.data = { ...getModel.data, ...putData };
                                            await getModel.update();
                                        }
                                        if (parkingData.data.parkingLotSize === "MP") {
                                            totalPay = Number(totalHours.toFixed(0)) * 60;
                                            const putData = {currentFee: totalPay as number, parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                            getModel.data = { ...getModel.data, ...putData };
                                            await getModel.update();
                                        }
                                        if (parkingData.data.parkingLotSize === "LP") {
                                            totalPay = Number(totalHours.toFixed(0)) * 100;
                                            const putData = {currentFee: totalPay as number, parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                            getModel.data = { ...getModel.data, ...putData };
                                            await getModel.update();
                                        }
                                    }
                                }
                                const putData = {parkDateEnd: format(new Date(parkDateEnd), "MM/dd/yyyy hh:mm:ss a") as unknown as Date, parkingStatus: putresult.parkingStatus}
                                getModel.data = { ...getModel.data, ...putData };
                                await getModel.update();
    
                                const parkingAvailability = {parkingAvailability: true as boolean};
                                parkingData.data = {...parkingData.data, ...parkingAvailability};
                                await parkingData.update();
                            }else{
                                return "This car is currently unparked. If you wish park again, please use the Return Parking API request."
                            }
                            return {Message: "Successfuly unparked", Current_Fee: getModel.data.currentFee};
                        } else {
                            return "History ID not found";
                        }
                    }else{
                        return "History ID is not supplied"
                    }
                }
                if(req.url?.match('/history/return/')){
                    if(returnpathParam.id!==undefined){
                        const putresult = await getJSONDataFromRequestStream(req) as {Gate: string, parkingStatus: string}
                        const getModel = new parkinghistory(returnpathParam.id);
                        if(await getModel.get() !== "Not found"){
                            if(getModel.data.parkingStatus === "inactive"){

                                //const parkDateStart = parseISO(JSON.stringify(new Date(getModel.data.parkDateStart)).replace(/['"`]+/g, '')).toLocaleString();
                                const parkDateEnd = parseISO(JSON.stringify(new Date(getModel.data.parkDateEnd as Date)).replace(/['"`]+/g, '')).toLocaleString();

                                const totalHours = differenceInMinutes(new Date(), new Date(parkDateEnd)) / 60;

                                const entranceData = new parkingEntrance(putresult.Gate as string);

                                if (totalHours > 1) {

                                    if (await entranceData.get() !== "Not found") {

                                        const getParkingLot = _.sortBy(await selectDB("ParkingLot"), "parkingLotNumber");

                                        let parkingArea;
                                        if (entranceData.data.entranceName === "Gate A") {
                                            parkingArea = _.filter(getParkingLot, { "parkingLotPosition": "L", "parkingAvailability": true })
                                            if (parkingArea.length === 0) {
                                                return "No more available parking lots";
                                            }
                                        }
                                        if (entranceData.data.entranceName === "Gate B") {
                                            parkingArea = _.filter(getParkingLot, { "parkingLotPosition": "M", "parkingAvailability": true })
                                            if (parkingArea.length === 0) {
                                                return "No more available parking lots";
                                            }
                                        }
                                        if (entranceData.data.entranceName === "Gate C") {
                                            parkingArea = _.filter(getParkingLot, { "parkingLotPosition": "R", "parkingAvailability": true })
                                            if (parkingArea.length === 0) {
                                                return "No more available parking lots";
                                            }
                                        }

                                        let parkingData;

                                        const carSize = getModel.data.carSize;

                                        let parking;
                                        const parkingLotDistance: any[] = [];

                                        if (carSize === "S") {
                                            parking = _.filter(parkingArea, function (data) {
                                                return data.parkingLotSize === "SP" || data.parkingLotSize === "MP" || data.parkingLotSize === "LP"
                                            });


                                            _.map(parking, function (data) {
                                                parkingLotDistance.push(data.parkingLotDistance)
                                            })
                                            const minimumDistance = _.min(parkingLotDistance)
                                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                                        }

                                        if (carSize === "M") {
                                            parking = _.filter(parkingArea, function (data) {
                                                return data.parkingLotSize === "MP" || data.parkingLotSize === "LP"
                                            });

                                            _.map(parking, function (data) {
                                                parkingLotDistance.push(data.parkingLotDistance)
                                            })
                                            const minimumDistance = _.min(parkingLotDistance)
                                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                                        }

                                        if (carSize === "L") {
                                            parking = _.filter(parkingArea, ["parkingLotSize", "LP"]);

                                            _.map(parking, function (data) {
                                                parkingLotDistance.push(data.parkingLotDistance)
                                            })
                                            const minimumDistance = _.min(parkingLotDistance)
                                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                                        }

                                        const updateparkingModel = new parkingLot(parkingData?.parkingID as string);
                                        await updateparkingModel.get();

                                        const parkingAvailability = { parkingAvailability: false as boolean };
                                        updateparkingModel.data = { ...updateparkingModel.data, ...parkingAvailability };
                                        await updateparkingModel.update();

                                        const post = { parkingID: parkingData?.parkingID as string, parkingLotNumber: parkingData?.parkingLotNumber as number, parkDateEnd: {} as Date, parkingStatus: putresult.parkingStatus as string }
                                        getModel.data = {...getModel.data, ...post}
                                        await getModel.update();
                                        return "Successfully reparked!"
                                    } else {
                                        return "Gate Entrance does not exist"
                                    }
                                }else{
                                    if (await entranceData.get() !== "Not found") {

                                        const getParkingLot = _.sortBy(await selectDB("ParkingLot"), "parkingLotNumber");

                                        let parkingArea;
                                        if (entranceData.data.entranceName === "Gate A") {
                                            parkingArea = _.filter(getParkingLot, { "parkingLotPosition": "L", "parkingAvailability": true })
                                            if (parkingArea.length === 0) {
                                                return "No more available parking lots";
                                            }
                                        }
                                        if (entranceData.data.entranceName === "Gate B") {
                                            parkingArea = _.filter(getParkingLot, { "parkingLotPosition": "M", "parkingAvailability": true })
                                            if (parkingArea.length === 0) {
                                                return "No more available parking lots";
                                            }
                                        }
                                        if (entranceData.data.entranceName === "Gate C") {
                                            parkingArea = _.filter(getParkingLot, { "parkingLotPosition": "R", "parkingAvailability": true })
                                            if (parkingArea.length === 0) {
                                                return "No more available parking lots";
                                            }
                                        }

                                        let parkingData;

                                        const carSize = getModel.data.carSize;

                                        let parking;
                                        const parkingLotDistance: any[] = [];

                                        if (carSize === "S") {
                                            parking = _.filter(parkingArea, function (data) {
                                                return data.parkingLotSize === "SP" || data.parkingLotSize === "MP" || data.parkingLotSize === "LP"
                                            });


                                            _.map(parking, function (data) {
                                                parkingLotDistance.push(data.parkingLotDistance)
                                            })
                                            const minimumDistance = _.min(parkingLotDistance)
                                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                                        }

                                        if (carSize === "M") {
                                            parking = _.filter(parkingArea, function (data) {
                                                return data.parkingLotSize === "MP" || data.parkingLotSize === "LP"
                                            });

                                            _.map(parking, function (data) {
                                                parkingLotDistance.push(data.parkingLotDistance)
                                            })
                                            const minimumDistance = _.min(parkingLotDistance)
                                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                                        }

                                        if (carSize === "L") {
                                            parking = _.filter(parkingArea, ["parkingLotSize", "LP"]);

                                            _.map(parking, function (data) {
                                                parkingLotDistance.push(data.parkingLotDistance)
                                            })
                                            const minimumDistance = _.min(parkingLotDistance)
                                            parkingData = _.find(parking, ["parkingLotDistance", minimumDistance])
                                        }

                                        const updateparkingModel = new parkingLot(parkingData?.parkingID as string);
                                        await updateparkingModel.get();

                                        const parkingAvailability = { parkingAvailability: false as boolean };
                                        updateparkingModel.data = { ...updateparkingModel.data, ...parkingAvailability };
                                        await updateparkingModel.update();

                                        const post = { parkingID: parkingData?.parkingID as string, parkingLotNumber: parkingData?.parkingLotNumber as number, currentFee: 40 as number, parkDateEnd: "" as unknown as Date, parkingStatus: putresult.parkingStatus as string }
                                        getModel.data = {...getModel.data, ...post}
                                        await getModel.update();
                                        return  "Successfully reparked!"
                                    } else {
                                        return "Gate Entrance does not exist"
                                    }
                                }
                            }else{
                                return "Error: This car is currently parked!"
                            }
                        }else{
                            return "History ID not found";
                        }
                    }else{
                        return "History ID is not supplied"
                    }
                }
            case 'DELETE':
                if (pathParam.id !== undefined) {
                    const deletemodel = new parkinghistory(pathParam.id);
                    if (await deletemodel.get() === "Not found") {
                        return "Parking ID not found"
                    } else {
                        const getParking = new parkingLot(deletemodel.data.parkingID);
                        await getParking.get();
                        const updateData = { parkingAvailability: true as boolean }
                        getParking.data = { ...getParking.data, ...updateData }
                        await getParking.update();
                        await deletemodel.delete();

                        return 'Successfully deleted';
                    }
                }
            default:
                const listing = await selectDB('ParkingHistory');
                // let parkingList:any;

                // _.forEach(listing, async (data, index) => {
                //     if (listing[index].parkingStatus === "active") {

                //         const totalHours = differenceInMinutes(new Date(), new Date(listing[index].parkDateStart)) / 60;
                //         let totalPay: Number = 0;
                //         let extraHours: any;
                //         let extraDays: Number;

                //         const parkingData = new parkingLot(listing[index].parkingID.toString());
                //         await parkingData.get();

                //         // console.log(differenceInMinutes(new Date(), new Date(listing[index].parkDateStart))%60)
                //         if (totalHours > 3) {
                //             if (totalHours > 24) {
                //                 const divideDays = (Number(totalHours.toFixed(0)) / 24).toString().split(".");
                //                 extraDays = parseInt(divideDays[0]);
                //                 extraHours = (Number(totalHours.toFixed(0)) % 24).toString().split(".");
                                
                //                 if (parkingData.data.parkingLotSize === "SP") {
                //                     totalPay = Number(extraHours[0]) * 20 + (Number(extraDays) * 5000)
                //                 }
                //                 if (parkingData.data.parkingLotSize === "MP") {
                //                     totalPay = Number(extraHours[0]) * 60 + (Number(extraDays) * 5000)
                //                 }
                //                 if (parkingData.data.parkingLotSize === "LP") {
                //                     totalPay = Number(extraHours[0]) * 100 + (Number(extraDays) * 5000)
                //                     // console.log(extraHours.toString().substring(0,2))
                //                 }
                //             } else {
                //                 if (parkingData.data.parkingLotSize === "SP") {
                //                     totalPay = Number(totalHours.toFixed(0)) * 20
                //                 }
                //                 if (parkingData.data.parkingLotSize === "MP") {
                //                     totalPay = Number(totalHours.toFixed(0)) * 60
                //                 }
                //                 if (parkingData.data.parkingLotSize === "LP") {
                //                     totalPay = Number(totalHours.toFixed(0)) * 100
                //                 }
                //                 // console.log(totalHours.toFixed(0))
                //             }
                //             const refreshFee = { currentFee: totalPay as number }

                //             const parkingModel = new parkinghistory(listing[index].historyID as string);
                //             await parkingModel.get();

                //             parkingModel.data = { ...parkingModel.data, ...refreshFee }

                //             await parkingModel.update();

                //             listing[index] = { ...listing[index], ...refreshFee };
                //         }
                //     }
                //     parkingList = listing;
                //     //console.log(parkingList)
                // })
                // console.log(await parkingList)
                return listing;
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}
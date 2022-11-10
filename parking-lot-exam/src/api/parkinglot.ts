import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParam";
import _ from 'lodash';
import parkingLot from "../modules/parkinglot";
import { deleteEnDB, selectDB } from "../lib/database/query";

export const parkingRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/parking/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream(req) as { parkingLotNumber:number, parkingLotPosition:string, parkingLotSize: string, parkingLotDistance:number}
                console.log(postresult)
                const postmodel = new parkingLot(postresult);
                if(await postmodel.getParkingNumber() !== "Not found"){
                    return 'A parking lot with the same parking lot number already exists!'
                }
                else{
                        await postmodel.insert();
                        return 'Successfully saved parking lot';
                }
            case 'PUT':
                if(pathParam.id !== undefined){
                    const putresult = await getJSONDataFromRequestStream(req) as { parkingAvailability:boolean}
                    const putmodel = new parkingLot(pathParam.id);
                    if(await putmodel.get() !== "Not found"){
                        putmodel.data = { ...putmodel.data, ...putresult };
                        await putmodel.update();
                        return 'Successfully updated';
                    }else{
                        return "parking lot ID not found"
                    }
                }else{
                    return "parking lot ID needs to be supplied";
                }
            case 'DELETE':
                if (pathParam.id !== undefined) {
                    const deletemodel = new parkingLot(pathParam.id);
                    if (await deletemodel.get() === "Not found") {
                        return "parking lot ID not found"
                    } else {
                            await deletemodel.delete();
                            return 'Successfully deleted';
                    }
                }
            default:
                const listing = await selectDB('ParkingLot');
                return _.sortBy(listing, "parkingLotNumber");
                //break;
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}
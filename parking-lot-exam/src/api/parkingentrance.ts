import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams, getQueryParams } from "../generateParam";
import _ from 'lodash';
import { deleteEnDB, selectDB } from "../lib/database/query";
import parkingEntrance from "../modules/parkingentrance";

export const parkingEntranceRequest = async (req: IncomingMessage) => {
    let queryParam = getQueryParams(req);

    const pathParam = getPathParams(req.url as string, '/entrance/:id');

    try {

        switch (req.method) {
            case 'POST':
                const postresult = await getJSONDataFromRequestStream(req) as { entranceName:string}
                const postmodel = new parkingEntrance(postresult);
                if(await postmodel.get() !== "Not found"){
                    return "Entrance Name is not found"
                }
                else{
                        await postmodel.insert();
                        return 'Successfully saved';
                }
            // case 'PUT':
            //     if(pathParam.id !== undefined){
            //         const putresult = await getJSONDataFromRequestStream(req) as { parkingAvailability:boolean}
            //         const putmodel = new parkingEntrance(pathParam.id);
            //         if(await putmodel.get() !== "Not found"){
            //             putmodel.data = { ...putmodel.data, ...putresult };
            //             await putmodel.update();
            //             return 'Successfully updated';
            //         }else{
            //             return "parking lot ID not found"
            //         }
            //         return 'Successfully updated';
            //     }else{
            //         return "parking lot ID needs to be supplied";
            //     }
            // case 'DELETE':
            //     if (pathParam.id !== undefined) {
            //         const deletemodel = new parkingEntrance(pathParam.id);
            //         if (await deletemodel.get() === "Not found") {
            //             return "parking lot ID not found"
            //         } else {
            //                 await deletemodel.delete();
            //                 return 'Successfully deleted';
            //         }
            //     }
            default:
                const listing = await selectDB('ParkingEntrance');
                return _.sortBy(listing, "entranceName");
                //break;
        }
    }
    catch (err: any) {
        throw new Error(err);
    }
    return 'yes'
}
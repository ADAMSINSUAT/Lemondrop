import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map, remove, slice} from "lodash";

interface dataInput{
    entranceID?: string,
    entranceName: string
}
export default class parkingEntrance{
    data:dataInput = {
        entranceName: ""
    }
    entranceID: string = "";

    private readonly __TABLE__ = 'ParkingEntrance';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.data.entranceName = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const entrance = this.data.entranceName.replace("%20", " ")
            const result = await selectDB(this.__TABLE__, `entranceName = '${entrance}'`)
            if (result.length === 0) {
                return "Not found"
            }
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    // public async getParkingNumber(){
    //     try {
    //         const result = await selectDB(this.__TABLE__, `parkingLotNumber = '${this.data.parkingLotNumber}'`)
    //         if (result.length === 0) {
    //             return "Not found"
    //         }
    //         else {
    //           this.data = {...this.data, ...result[0]}
    //         }
    //       } catch (err){
    //         console.error(err)
    //         throw new Error("Unable to update");
    //       }
    // }
    public async insert() {
        this.entranceID = uuidv4();
        const stringFormat = "{'entranceID': ?, 'entranceName': ?}"
        const params = [
            this.entranceID,
            this.data.entranceName
        ]
        try {
            await insertDB(this.__TABLE__, stringFormat, params)
          } catch (err){
            console.error(err)
            throw new Error("Unable to save");
          }
    }
    // public async update() {
    //     const updateFormat = JSON.parse(JSON.stringify(this.data));
    //     delete updateFormat.entranceID;
    //     delete updateFormat.parkingLotNumber;
    //     delete updateFormat.parkingLotSize;
    //     delete updateFormat.parkingLotDistance;
    //     delete updateFormat.parkingLotPosition;
    //     const fields = keys(updateFormat)
    //     const newValues = values(updateFormat)
    //     const updateStatement = map(fields, (field) => `${field} = ? `)
    //     const where = `entranceID='${this.entranceID}' AND parkingLotNumber=${this.data.parkingLotNumber}`
    //     try {
    //         await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    //     } catch (err) {
    //         console.error(err)
    //         throw new Error("Unable to update");
    //     }
    // }
    // public async delete() {
    //     const deleteFormat = JSON.parse(JSON.stringify(this.data));
    //     delete deleteFormat.parkingLotDistance;
    //     delete deleteFormat.parkingLotPosition;
    //     delete deleteFormat.parkingLotSize;
    //     delete deleteFormat.parkingAvailability;
    //     const fields = keys(deleteFormat);
    //     const newValues = values(deleteFormat);
    //     const deleteStatement = map(fields, (field) => `${field} = ?`);
    //     const where = `accID='${this.data.entranceID}' AND parkingLotNumber='${this.data.parkingLotNumber}'`
    //     try {
    //       await deleteDB(this.__TABLE__, where);
    //     } catch (err) {
    //       console.error(err);
    //       throw new Error("Failed to delete")
    //     }
    //   }
}
import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map} from "lodash";

interface dataInput{
    parkingID?: string,
    parkingLotNumber: number,
    parkingLotPosition: string,
    parkingLotSize: string,
    parkingLotDistance: number,
    parkingAvailability?: boolean,
}
export default class parkingLot{
    data:dataInput = {
        parkingLotNumber: 0,
        parkingLotPosition: '',
        parkingLotSize: '',
        parkingLotDistance: 0,
        parkingAvailability: true
    }
    parkingID: string = "";

    private readonly __TABLE__ = 'ParkingLot';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.parkingID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `parkingID = '${this.parkingID}'`)
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
    public async getParkingNumber(){
        try {
            const result = await selectDB(this.__TABLE__, `parkingLotNumber = '${this.data.parkingLotNumber}'`)
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
    public async insert() {
        this.parkingID = uuidv4();
        const stringFormat = "{'parkingID': ?, 'parkingLotNumber': ?, 'parkingLotPosition': ?, 'parkingLotSize': ?, 'parkingLotDistance': ?, 'parkingAvailability': ?}"
        const params = [
            this.parkingID,
            this.data.parkingLotNumber,
            this.data.parkingLotPosition,
            this.data.parkingLotSize,
            this.data.parkingLotDistance,
            this.data.parkingAvailability
        ]
        try {
            await insertDB(this.__TABLE__, stringFormat, params)
          } catch (err){
            console.error(err)
            throw new Error("Unable to save");
          }
    }
    public async update() {
        const updateFormat = JSON.parse(JSON.stringify(this.data));
        delete updateFormat.parkingID;
        delete updateFormat.parkingLotNumber;
        delete updateFormat.parkingLotSize;
        delete updateFormat.parkingLotDistance;
        delete updateFormat.parkingLotPosition;
        const fields = keys(updateFormat)
        const newValues = values(updateFormat)
        const updateStatement = map(fields, (field) => `${field} = ? `)
        const where = `parkingID='${this.parkingID}' AND parkingLotNumber=${this.data.parkingLotNumber}`
        try {
            await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to update");
        }
    }
    public async delete() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.parkingLotDistance;
        delete deleteFormat.parkingLotPosition;
        delete deleteFormat.parkingLotSize;
        delete deleteFormat.parkingAvailability;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `accID='${this.data.parkingID}' AND parkingLotNumber='${this.data.parkingLotNumber}'`
        try {
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
      }
}
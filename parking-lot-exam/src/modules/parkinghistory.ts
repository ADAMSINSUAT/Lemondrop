import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map} from "lodash";
import { format, parse, parseISO } from 'date-fns';

interface dataInput{
    historyID?: string,
    parkingID: string,
    parkingLotNumber: number,
    carPlateNumber?: string,
    carSize: string,
    currentFee?: number,
    parkDateStart: Date,
    parkDateEnd?: Date,
    parkingStatus?:string,
}
export default class parkinghistory{
    data:dataInput = {
        parkingID: "",
        parkingLotNumber: 0,
        carSize: "",
        parkDateStart: new Date(),
        parkDateEnd: new Date(),
    }
    historyID: string = "";

    private readonly __TABLE__ = 'ParkingHistory';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.historyID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `historyID = '${this.historyID}'`)
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
    public async getparkingHistory(){
        try {
            const result = await selectDB(this.__TABLE__, `parkingID = '${this.data.parkingID}'`)
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
        this.historyID = uuidv4();
        this.data.carPlateNumber = uuidv4();
        this.data.currentFee = 40;
        this.data.parkingStatus = "active";
        const date = format(new Date(this.data.parkDateStart), "MM/dd/yyyy hh:mm:ss a")
        const stringFormat = "{'historyID': ?, 'parkingID': ?, 'parkingLotNumber': ?, 'carPlateNumber': ?, 'carSize': ?, 'currentFee': ?, 'parkDateStart': ?, 'parkDateEnd': ?, 'parkingStatus': ?}"
        const params = [
            this.historyID,
            this.data.parkingID,
            this.data.parkingLotNumber,
            this.data.carPlateNumber,
            this.data.carSize,
            this.data.currentFee,
            date,
            this.data.parkDateEnd,
            this.data.parkingStatus
        ]
        try {
            // console.log(this.historyID)
            // console.log(this.data.parkingID)
            // console.log(this.data.parkingLotNumber)
            // console.log(this.data.carPlateNumber)
            // console.log(this.data.carSize)
            // console.log(this.data.currentFee)
            //console.log(parse(format(this.data.parkDateStart, "MM/dd/yyyy hh:mm:ss a"), "MM/dd/yyyy hh:mm:ss a", new Date()));
            // console.log(this.data.parkDateEnd)
            // console.log(this.data.parkingStatus)
            // return "Ok";
            await insertDB(this.__TABLE__, stringFormat, params)
          } catch (err){
            console.error(err)
            throw new Error("Unable to save");
          }
    }
    public async update() {
        const updateFormat = JSON.parse(JSON.stringify(this.data));
        delete updateFormat.historyID;
        delete updateFormat.carPlateNumber;
        delete updateFormat.carSize;
        delete updateFormat.parkDateStart;
        const fields = keys(updateFormat)
        const newValues = values(updateFormat)
        const updateStatement = map(fields, (field) => `${field} = ? `)
        const where = `historyID='${this.data.historyID}'`;
        try {
          await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to update");
        }
    }
    public async delete() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.parkingID;
        delete deleteFormat.parkingLotNumber;
        delete deleteFormat.carPlateNumber;
        delete deleteFormat.carSize;
        delete deleteFormat.currentFee;
        delete deleteFormat.parkDateStart;
        delete deleteFormat.parkDateEnd;
        delete deleteFormat.parkingStatus;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `historyID='${this.data.historyID}'`
        try {
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
      }
}
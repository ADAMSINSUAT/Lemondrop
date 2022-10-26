import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map, remove, filter} from "lodash";
import employee from "../modules/employee";
import _ from "lodash";

interface dataInput{
    ovtID?: string,
    empID: string,
    date_and_time_started: Date,
    date_and_time_ended: Date,
    approved?: string,
}
export default class overtime{
    data:dataInput={
        empID: "",
        date_and_time_started: new Date(),
        date_and_time_ended: new Date(),
        approved: "Pending",
    }
    ovtID: string = "";

    private readonly __TABLE__ = 'Overtime';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.ovtID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `ovtID = '${this.ovtID}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async getOvertime(){
        try {
            const result = await selectDB(this.__TABLE__, `ovtID = '${this.ovtID}'`)
            if (result.length === 0){
                return "Not found";
            }
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async checkOvertime(){
        try {
            const result = await selectDB(this.__TABLE__, `empID = '${this.data.empID}' AND date_and_time_started = '${this.data.date_and_time_started}'`)
            if (result.length === 0){
                return "Not found"
            }
            else {
              this.data = {...this.data, ...result[0]}
              return "Found";
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async insert() {
        this.ovtID = uuidv4();
        const stringFormat = "{'ovtID': ?, 'date_and_time_started': ?, 'date_and_time_ended': ?, 'approved': ?, 'empID': ?}"
        const params = [
            this.ovtID,
            this.data.date_and_time_started,
            this.data.date_and_time_ended,
            this.data.approved,
            this.data.empID
        ]
        try {
            await insertDB(this.__TABLE__, stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
    public async update() {
        const updateFormat = JSON.parse(JSON.stringify(this.data));
        delete updateFormat.ovtID;
        delete updateFormat.empID;
        delete updateFormat.date_and_time_started;
        delete updateFormat.date_and_time_ended;
        delete updateFormat.reason;
        const fields = keys(updateFormat)
        const newValues = values(updateFormat)
        const updateStatement = map(fields, (field) => `${field} = ? `)
        const where = `ovtID='${this.data.ovtID}'`
        const ovtID = this.data.ovtID;
        try {
          const empModel = new employee(`${this.data.empID}`);
            if (updateFormat.approved === "Confirmed") {
                await empModel.get();
                const overtimeArray = {
                    ovtID: this.ovtID,
                    date_and_time_started: this.data.date_and_time_started,
                    date_and_time_ended: this.data.date_and_time_ended,
                }
                empModel.data.overtimes?.push(overtimeArray);
                await empModel.updateOvertimes();
            }else{
              await empModel.get();
              const overtimeArray = _.filter(empModel?.data.overtimes, function(overtime){
                return overtime.ovtID !== ovtID;
              })
              empModel.data.overtimes = overtimeArray;
              await empModel.updateOvertimes();
            }
          await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
        } catch (err) {
          console.error(err)
          throw new Error("Unable to update");
        }
      }
      public async delete() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.empID;
        delete deleteFormat.date_and_time_started;
        delete deleteFormat.date_and_time_ended;
        delete deleteFormat.reason;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `ovtID='${this.data.ovtID}'`
        try {
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
      }
      public async delEmpOvertime() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.ovtID;
        delete deleteFormat.empID;
        delete deleteFormat.date_and_time_started;
        delete deleteFormat.date_and_time_ended;
        const fields = keys(deleteFormat)
        const newValues = values(deleteFormat)
        const deleteStatement = map(fields, (field) => `${field} = ? `)
        const where = `ovtID='${this.data.ovtID}'`
        try {
            if (deleteFormat.approved === "Confirmed") {
                const empModel = new employee(`${this.data.empID}`);
                await empModel.get();
                const newOTArr = filter(empModel.data.overtimes, (id)=>{
                    return this.data.ovtID !== id.ovtID
                })
                empModel.data.overtimes = newOTArr;
                await empModel.updateOvertimes();
            }
            await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err)
          throw new Error("Unable to update");
        }
      }
    // date: Date;
    // time_started: Date;
    // time_ended: Date;
    // approved: boolean;

    // constructor(date: Date, time_started: Date, time_ended: Date, approved: boolean){
    //     this.date = date;
    //     this.time_started = time_started;
    //     this.time_ended = time_ended;
    //     this.approved = approved;
    // }
}
import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map, remove, filter} from "lodash";
import employee from "../modules/employee";

interface dataInput{
    absID?: string,
    empID: string,
    date_started: Date,
    date_ended: Date,
    reason: string
}
export default class absence{
    data:dataInput = {
        empID: "",
        date_started: new Date(),
        date_ended: new Date(),
        reason: "",
    }
    absID: string = "";

    private readonly __TABLE__ = 'Absences'

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.absID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `absID = '${this.absID}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async getAbsence(){
        try {
            const result = await selectDB(this.__TABLE__, `absID = '${this.absID}'`)
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
    public async checkAbsence(){
        try {
            const result = await selectDB(this.__TABLE__, `empID = '${this.data.empID}' AND date_started = '${this.data.date_started}'`)
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
        this.absID = uuidv4();
        const stringFormat = "{'absID': ?, 'date_started': ?, 'date_ended': ?, 'reason': ?, 'empID': ?}"
        const params = [
            this.absID,
            this.data.date_started,
            this.data.date_ended,
            this.data.reason,
            this.data.empID
        ]
        try {
            const empModel = new employee(`${this.data.empID}`);
            await empModel.get();
            const absenceArray = {
                absID: this.absID,
                date_started: this.data.date_started,
                date_ended: this.data.date_ended,
                reason: this.data.reason
            }
            empModel.data.absences?.push(absenceArray);
            await empModel.updateAbsences();
            await insertDB(this.__TABLE__, stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
    // public async update() {
    //     const updateFormat = JSON.parse(JSON.stringify(this.data));
    //     delete updateFormat.absID;
    //     delete updateFormat.empID;
    //     delete updateFormat.date_started;
    //     delete updateFormat.date_ended;
    //     delete updateFormat.reason;
    //     const fields = keys(updateFormat)
    //     const newValues = values(updateFormat)
    //     const updateStatement = map(fields, (field) => `${field} = ? `)
    //     const where = `absID='${this.data.absID}'`
    //     try {
    //         const empModel = new employee(`${this.data.empID}`);
    //         await empModel.get();
    //         const absenceArray = {
    //             absID: this.absID,
    //             date_started: this.data.date_started,
    //             date_ended: this.data.date_ended,
    //             reason: this.data.reason
    //         }
    //         empModel.data.absences?.push(absenceArray);
    //         await empModel.updateAbsences();
    //       await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    //     } catch (err) {
    //       console.error(err)
    //       throw new Error("Unable to update");
    //     }
    //   }
      public async delete() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.empID;
        delete deleteFormat.date_started;
        delete deleteFormat.date_ended;
        delete deleteFormat.reason;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `absID='${this.data.absID}'`
        try {
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
      }
      public async delEmpAbsence() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.absID;
        delete deleteFormat.empID;
        delete deleteFormat.date_started;
        delete deleteFormat.date_ended;
        delete deleteFormat.reason;
        const fields = keys(deleteFormat)
        const newValues = values(deleteFormat)
        const deleteStatement = map(fields, (field) => `${field} = ? `)
        const where = `absID='${this.data.absID}'`
        try {
            const empModel = new employee(`${this.data.empID}`);
            await empModel.get();
            const newabsArr = filter(empModel.data.absences, (id) => {
                return this.data.absID !== id.absID
            })
            empModel.data.absences = newabsArr;
            await empModel.updateAbsences();
            await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err)
          throw new Error("Unable to update");
        }
      }
    // date_started: Date;
    // date_ended: Date;

    // constructor(date_started: Date, date_ended: Date){
    //     this.date_started = date_started;
    //     this.date_ended = date_ended;
    // }
}
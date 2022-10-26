import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map, remove, findIndex, filter} from "lodash";
import _ from 'lodash';
import employee from "../modules/employee";

interface dataInput{
    lvID?: string,
    empID: string,
    date_started: Date,
    date_ended: Date,
    reason: string,
    approved?: string,
}
export default class leave{
    data:dataInput = {
        empID: "",
        date_started: new Date(),
        date_ended: new Date(),
        reason: "",
        approved: "Pending"
    }
    lvID: string = '';

    private readonly __TABLE__ = 'Leaves';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.lvID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `lvID = '${this.lvID}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async getLeave(){
        try {
            const result = await selectDB(this.__TABLE__, `lvID = '${this.lvID}'`)
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
    public async checkLeave(){
        try {
            const result = await selectDB(this.__TABLE__, `date_started = '${this.data.date_started}' AND empID='${this.data.empID}'`)
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
        this.lvID = uuidv4();
        const stringFormat = "{'lvID': ?, 'date_started': ?, 'date_ended': ?, 'reason': ?, 'approved': ?, 'empID': ?}"
        const params = [
            this.lvID,
            this.data.date_started,
            this.data.date_ended,
            this.data.reason,
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
    delete updateFormat.lvID;
    delete updateFormat.empID;
    delete updateFormat.date_started;
    delete updateFormat.date_ended;
    delete updateFormat.reason;
    const fields = keys(updateFormat)
    const newValues = values(updateFormat)
    const updateStatement = map(fields, (field) => `${field} = ? `)
    const where = `lvID='${this.data.lvID}'`
    const lvID = this.data.lvID
    try {
      const empModel = new employee(`${this.data.empID}`);
      if (updateFormat.approved === "Confirmed") {
        await empModel.getEmployee()
        const leaveArray = {
          lvID: this.lvID,
          date_started: this.data.date_started,
          date_ended: this.data.date_ended,
          reason: this.data.reason,
        }
        empModel.data.leaves?.push(leaveArray);
        await empModel.updateLeaves();
      }else{
        await empModel.getEmployee()
        const leaveArray = _.filter(empModel?.data.leaves, function(leave){
          return leave.lvID !== lvID
        })
        empModel.data.leaves = leaveArray;
        await empModel.updateLeaves();
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
        delete deleteFormat.date_started;
        delete deleteFormat.date_ended;
        delete deleteFormat.reason;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `lvID='${this.data.lvID}'`
        try {
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
      }
      public async delEmpLeave() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.lvID;
        delete deleteFormat.empID;
        delete deleteFormat.date_started;
        delete deleteFormat.date_ended;
        delete deleteFormat.reason;
        const fields = keys(deleteFormat)
        const newValues = values(deleteFormat)
        const deleteStatement = map(fields, (field) => `${field} = ? `)
        const where = `lvID='${this.data.lvID}'`
        try {
            if (deleteFormat.approved === "Confirmed") {
                const empModel = new employee(`${this.data.empID}`);
                await empModel.get();
                const newleaveArr = _.filter(empModel.data.leaves, (id)=>{
                    return this.data.lvID !== id.lvID
                })
                empModel.data.leaves = newleaveArr;
                await empModel.updateLeaves();
            }
            await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err)
          throw new Error("Unable to update");
        }
      }
    // date_started: Date;
    // date_ended: Date;
    // reason: string;
    // approved: boolean;

    // constructor(date_started: Date, date_ended: Date, reason: string, approved:boolean){
    //     this.date_started = date_started;
    //     this.date_ended = date_ended;
    //     this.reason = reason;
    //     this.approved = approved;
    // }
}
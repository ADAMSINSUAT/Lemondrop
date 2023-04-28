import { v4 as uuidv4 } from 'uuid';
import Leave from './leave';
import Absence from './absence';
import Overtime from './overtime';
import Account from './account';
import Store from './store';
import _ from 'lodash';
import leave from "../modules/leave";
import { deleteDB, insertDB, selectDB, updateDB, getLeaves, getEmployees } from '../lib/database/query';
import { keys, values, map } from "lodash";
import { differenceInDays, parse, parseISO, format, isSameMonth, differenceInMinutes, subDays, addDays } from 'date-fns';

interface dataInput {
  leaves?: any[],
  overtimes?: any[],
  absences?: any[],
  hourlySalary: number,
  empType: string,
  empID?: string,
  accID: string,
  compID: string,
}
export default class employee {
  data: dataInput = {
    leaves: [],
    overtimes: [],
    absences: [],
    hourlySalary: 0,
    empType: "",
    accID: "",
    compID: "",
  }
  empID: string = "";
  private readonly __TABLE__ = 'Employee';

  constructor(params: string | dataInput) {
    if (typeof params === "string") {
      this.empID = params;
    } else {
      this.data = { ...this.data, ...params };
    }
  }

  public async get() {
    try {
      const result = await selectDB(this.__TABLE__, `empID = '${this.empID}'`)
      if (result.length === 0) throw new Error("Not found");
      else {
        this.data = { ...this.data, ...result[0] }
      }
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async getEmployee() {
    try {
      const result = await selectDB(this.__TABLE__, `empID = '${this.empID}'`)
      if (result.length === 0) {
        return "Not found";
      }
      else {
        this.data = { ...this.data, ...result[0] }
      }
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async checkEmp() {
    try {
      console.log(this.data.accID)
      const result = await selectDB(this.__TABLE__, `accID = '${this.data.accID}'`)
      if (result.length === 0) {
        return 'Not found'
      }
      else {
        //this.data = { ...this.data, ...result[0] }
        return 'Already exist'
      }
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }

  public async insert() {
    this.empID = uuidv4();
    const stringFormat = "{'empID': ?, 'hourlySalary': ?, 'empType': ?, 'accID': ?, 'compID': ?, 'leaves': ?, 'overtimes': ?, 'absences': ?}"
    const params = [
      this.empID,
      this.data.hourlySalary,
      this.data.empType,
      this.data.accID,
      this.data.compID,
      this.data.leaves,
      this.data.overtimes,
      this.data.absences
    ]
    try {
      await insertDB(this.__TABLE__, stringFormat, params)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to save");
    }
  }
  public async updateLeaves() {
    const updateFormat = JSON.parse(JSON.stringify(this.data));
    delete updateFormat.empID;
    delete updateFormat.accID;
    delete updateFormat.compID;
    delete updateFormat.hourlySalary;
    delete updateFormat.empType;
    delete updateFormat.overtimes;
    delete updateFormat.absences;
    delete updateFormat.lvID;
    const fields = keys(updateFormat)
    const newValues = values(updateFormat)
    const updateStatement = map(fields, (field) => `${field} = ? `)
    const where = `empID='${this.data.empID}' AND accID='${this.data.accID}'`
    try {
      await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async updateOvertimes() {
    const updateFormat = JSON.parse(JSON.stringify(this.data));
    delete updateFormat.empID;
    delete updateFormat.accID;
    delete updateFormat.compID;
    delete updateFormat.hourlySalary;
    delete updateFormat.empType;
    delete updateFormat.leaves;
    delete updateFormat.absences;
    delete updateFormat.ovtID;
    const fields = keys(updateFormat)
    const newValues = values(updateFormat)
    const updateStatement = map(fields, (field) => `${field} = ? `)
    const where = `empID='${this.data.empID}' AND accID='${this.data.accID}'`
    try {
      await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async updateAbsences() {
    const updateFormat = JSON.parse(JSON.stringify(this.data));
    delete updateFormat.empID;
    delete updateFormat.accID;
    delete updateFormat.compID;
    delete updateFormat.hourlySalary;
    delete updateFormat.empType;
    delete updateFormat.overtimes;
    delete updateFormat.leaves;
    delete updateFormat.lvID;
    const fields = keys(updateFormat)
    const newValues = values(updateFormat)
    const updateStatement = map(fields, (field) => `${field} = ? `)
    const where = `empID='${this.data.empID}' AND accID='${this.data.accID}'`
    try {
      await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async update() {
    const updateFormat = JSON.parse(JSON.stringify(this.data));
    delete updateFormat.empID;
    delete updateFormat.accID;
    delete updateFormat.compID;
    delete updateFormat.leaves;
    delete updateFormat.overtimes;
    delete updateFormat.absences;
    const fields = keys(updateFormat)
    const newValues = values(updateFormat)
    const updateStatement = map(fields, (field) => `${field} = ? `)
    const where = `empID='${this.data.empID}' AND accID='${this.data.accID}'`
    try {
      await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async delete() {
    const deleteFormat = JSON.parse(JSON.stringify(this.data));
    delete deleteFormat.compID;
    delete deleteFormat.hourlySalary;
    delete deleteFormat.empType;
    const fields = keys(deleteFormat);
    const newValues = values(deleteFormat);
    const deleteStatement = map(fields, (field) => `${field} = ?`);
    const where = `empID='${this.data.empID}' AND accID='${this.data.accID}'`
    try {
      await deleteDB(this.__TABLE__, where);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete")
    }
  }

  public async computeRemLeaves(month: string, allowLeaves: number): Promise<number> {
    let leaves: number = 0;
    _.forEach(this.data.leaves, (data, index) => {
      if (isSameMonth(addDays(new Date(month), 1), addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_started).replace(/['"`]+/g, '')), 1) && addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_ended).replace(/['"`]+/g, '')), 1))) {
        leaves += Number(differenceInDays(addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_ended).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_started).replace(/['"`]+/g, '')), 1)));
      }
    });
    return leaves > allowLeaves ?
      0 : allowLeaves - leaves
  }
  public async computeTotAbsences(month: string, allowLeaves: number): Promise<number>{
    let absences: number = 0;
    _.forEach(this.data.absences, (data, index) => {
      if (isSameMonth(addDays(new Date(month), 1), addDays(new Date(JSON.stringify(this.data.absences?.[index].date_started).replace(/['"`]+/g, '')), 1) && addDays(new Date(JSON.stringify(this.data.absences?.[index].date_ended).replace(/['"`]+/g, '')), 1))) {
        absences += Number(differenceInDays(addDays(new Date(JSON.stringify(this.data.absences?.[index].date_ended).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(this.data.absences?.[index].date_started).replace(/['"`]+/g, '')), 1)))

      }
    })
    let leaves: number = 0;
    _.forEach(this.data.leaves, (data, index) => {
      if (isSameMonth(addDays(new Date(month), 1), addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_started).replace(/['"`]+/g, '')), 1) && addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_ended).replace(/['"`]+/g, '')), 1))) {
        leaves += Number(differenceInDays(addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_ended).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(this.data.leaves?.[index].date_started).replace(/['"`]+/g, '')), 1)));
      }
    });
    const computeLeaves = leaves - allowLeaves;
    return absences + (computeLeaves > 0 ? computeLeaves : 0);
  }
  public async computeTotOvertime(month: string, allowOT: number): Promise<number> {
    let overtime: number = 0;
    _.forEach(this.data.overtimes, (date, index) => {
      if (isSameMonth(addDays(new Date(JSON.stringify(this.data.overtimes?.[index].date_and_time_started).replace(/['"`]+/g, '')), 1) && addDays(new Date(JSON.stringify(this.data.overtimes?.[index].date_and_time_ended).replace(/['"`]+/g, '')), 1), addDays(new Date(month), 1))) {
        overtime += differenceInMinutes(addDays(new Date(JSON.stringify(this.data.overtimes?.[index].date_and_time_ended).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(this.data.overtimes?.[index].date_and_time_started).replace(/['"`]+/g, '')), 1)) / 60;
      }
    })
    const overtimeFixed = Number(overtime.toFixed(2))
    return overtimeFixed > allowOT ? allowOT : overtimeFixed
  }
  public async computeDailyWage(): Promise<number> {
    let dailywage: number = 0;

    if (this.data.empType === 'Fulltime') {
      dailywage = Number(this.data.hourlySalary) * 8;
    } else {
      dailywage = Number(this.data.hourlySalary) * 4;
    }

    return dailywage;
  }
  public async computeMonthlySalary(month: string, allowLeaves: number, allowOT: number): Promise<number> {
    const monthlysalary: number = (await this.computeDailyWage() * 20) + (await this.computeTotOvertime(month, allowOT) * (0.20 * await this.data.hourlySalary)) + (await this.computeRemLeaves(month, allowLeaves) * await this.computeDailyWage()) - (await this.computeTotAbsences(month, allowLeaves) * await this.computeDailyWage());
    const salaryFixed = Number(monthlysalary.toFixed(0));
    return salaryFixed;
  }
}
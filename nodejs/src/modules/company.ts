import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map} from "lodash";

interface dataInput{
    compID?: string;
    compName?: string;
    allowOT: number;
    allowLeaves: number;
}
export default class company{
    data:dataInput = {
      allowOT: 0,
      allowLeaves: 0
    }
    compID: string = '';
    // compName: string;
    // allowOT: number;
    // allowLeaves: number;
    private readonly __TABLE__ = 'Company'

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.compID = params;
        }
        else{
            this.data = { ...this.data, ...params };
        }
    }
    // constructor(compName: string, allowLeaves: number, allowOT: number, compID: string|undefined = undefined){
    //     this.compName = compName;
    //     this.allowLeaves = allowLeaves;
    //     this.allowOT = allowOT;
    //     this.compID = (compID === undefined)? uuidv4(): compID;
        
    // }

  public async get() {
    try {
      const result = await selectDB(this.__TABLE__, `compID = '${this.compID}'`)
      if (result.length === 0) throw new Error("Not found");
      else {
        this.data = { ...this.data, ...result[0] }
      }
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async getCompany() {
    try {
      const result = await selectDB(this.__TABLE__, `compID = '${this.compID}'`)
      if (result.length === 0){
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
  public async getName(name: string) {
    try {
      const result = await selectDB(this.__TABLE__, `compName = '${name}'`)
      if (result.length === 0) {
        return 'Not found'
        //throw new Error("Not found");
      }
      else {
        this.data = { ...this.data, ...result[0] }
      }
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async insert() {
    this.compID = uuidv4();
    const stringFormat = "{'compID': ?, 'compName': ?, 'allowOT': ?, 'allowLeaves': ?}"
    const params = [
      this.compID,
      this.data.compName,
      this.data.allowOT,
      this.data.allowLeaves
    ]
    // this.compID = uuidv4();
    // const stringFormat = "{'compID': ?, 'compName': ?, 'allowOT': ?, 'allowLeaves': ?}";
    // const params = [
    //   {S: this.compID},
    //   {S: this.compName},
    //   {N: `${this.allowOT}`},
    //   {N: `${this.allowLeaves}`}
    // ]
    // console.log(params)
    try {
      await insertDB(this.__TABLE__, stringFormat, params)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to save");
    }
  }
  public async update() {
    const updateFormat = JSON.parse(JSON.stringify(this.data));
    delete updateFormat.compID;
    delete updateFormat.compName;
    const fields = keys(updateFormat)
    const newValues = values(updateFormat)
    const updateStatement = map(fields, (field) => `${field} = ? `)
    const where = `compID='${this.data.compID}' AND compName='${this.data.compName}'`
    // console.log(this.__TABLE__)
    // console.log(updateStatement)
    // console.log(where)
    try {
      await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to update");
    }
  }
  public async delete() {
    const deleteFormat = JSON.parse(JSON.stringify(this.data));
    //delete deleteFormat.compName;
    delete deleteFormat.allowOT;
    delete deleteFormat.allowLeaves;
    const fields = keys(deleteFormat);
    const newValues = values(deleteFormat);
    const deleteStatement = map(fields, (field) => `${field} = ?`);
    const where = `compID='${this.data.compID}' AND compName='${this.data.compName}'`
    try {
      await deleteDB(this.__TABLE__, where);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete")
    }
  }


  // public getComputeRemainingLeaves(leaves:number){
  //     return this.allowLeaves - leaves;
  // }

  // public getComputeOvertime(overtimes:number){
  //     return this.allowOT-overtimes;
  // }
}
import { v4 as uuidv4 } from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import { keys, values, map } from "lodash";


interface dataInput {
  adminID?: string,
  accID: string,
}
export default class admin {
  data: dataInput = {
    accID: ""
  }

  private readonly __TABLE__ = 'Admin';

  constructor(params: string | dataInput) {
    if (typeof params === "string") {
      this.data.accID = params;
    } else {
      this.data = { ...this.data, ...params };
    }
  }

  public async get() {
    try {
      const result = await selectDB(this.__TABLE__)
      if (result.length === 0) {
        return 'No Admin';
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
    this.data.adminID = uuidv4();
    const stringFormat = "{'accID': ?, 'adminID': ?}"
    const params = [
      this.data.accID,
      this.data.adminID,
    ]
    try {
      await insertDB(this.__TABLE__, stringFormat, params)
    } catch (err) {
      console.error(err)
      throw new Error("Unable to save");
    }
  }

  public async delete() {
    const deleteFormat = JSON.parse(JSON.stringify(this.data));
    delete deleteFormat.adminID;
    delete deleteFormat.accID;
    const fields = keys(deleteFormat);
    const newValues = values(deleteFormat);
    const deleteStatement = map(fields, (field) => `${field} = ?`);
    const where = `adminID='${this.data.adminID}' AND accID='${this.data.accID}'`
    try {
      await deleteDB(this.__TABLE__, where);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete")
    }
  }
  // adminID: string;
  // accID: string;

  // constructor(adminID: string|undefined=undefined, accID: string|undefined=undefined){
  //     this.adminID = (adminID === undefined || adminID === '')? uuidv4(): adminID;
  //     this.accID = (accID === undefined || accID === '')? uuidv4(): accID;
  // }
}
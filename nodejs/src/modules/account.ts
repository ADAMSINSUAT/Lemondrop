import {v4 as uuidv4} from 'uuid';
import { deleteDB, insertDB, selectDB, updateDB } from '../lib/database/query';
import {keys, values, map} from "lodash";
import admin from "../modules/admin";

interface dataInput{
    accID?: string,
    fname: string,
    lname: string,
    email: string,
    password: string,
    role: string,
}
export default class account{
    data:dataInput = {
        fname: "",
        lname: "",
        email: "",
        password: "",
        role: "",
    }
    accID: string = "";

    private readonly __TABLE__ = 'Account';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.accID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `accID = '${this.accID}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async getAccount(){
      try {
          const result = await selectDB(this.__TABLE__, `accID = '${this.accID}'`)
          if (result.length === 0){
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
    public async getName(fname:string, lname:string){
        try {
            const result = await selectDB(this.__TABLE__, `fname = '${fname}' AND lname = '${lname}'`)
            if (result.length === 0) {
              return 'Not Found'
              //throw new Error("Not found");
            }
            else {
              this.data = {...this.data, ...result[0]}
              return 'Found'
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async getEmail(email:string){
      try {
          const result = await selectDB(this.__TABLE__, `email = '${email}'`)
          if (result.length === 0) {
            return 'Not Found'
            //throw new Error("Not found");
          }
          else {
            this.data = {...this.data, ...result[0]}
            return 'Found'
          }
        } catch (err){
          console.error(err)
          throw new Error("Unable to update");
        }
  }
    public async insert() {
        this.accID = uuidv4();
        const stringFormat = "{'accID': ?, 'fname': ?, 'lname': ?, 'email': ?, 'password': ?, 'role': ?}"
        const params = [
            this.accID,
            this.data.fname,
            this.data.lname,
            this.data.email,
            this.data.password,
            this.data.role,
        ]
        try {
          if (this.data.role === "Admin") {
            const adModel = new admin(this.accID);
            if (await adModel.get() === 'No Admin') {
              adModel.insert();
              await insertDB(this.__TABLE__, stringFormat, params);
            }
            else {
              return 'Admin already exists!'
            }
          } else {
            await insertDB(this.__TABLE__, stringFormat, params)
          }
          } catch (err){
            console.error(err)
            throw new Error("Unable to save");
          }
    }
    public async update() {
        const updateFormat = JSON.parse(JSON.stringify(this.data));
        delete updateFormat.accID;
        delete updateFormat.fname;
        delete updateFormat.lname;
        delete updateFormat.role;
        const fields = keys(updateFormat)
        const newValues = values(updateFormat)
        const updateStatement = map(fields, (field) => `${field} = ? `)
        const where = `accID='${this.data.accID}' AND fname='${this.data.fname}'`
        try {
            await updateDB(this.__TABLE__, updateStatement.join(), newValues, where)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to update");
        }
    }
    public async delete() {
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.lname;
        delete deleteFormat.email;
        delete deleteFormat.password;
        delete deleteFormat.role;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `accID='${this.data.accID}' AND fname='${this.data.fname}'`
        try {
          if (this.data.role === "Admin") {
            const adModel = new admin(deleteFormat.accID);
            if (await adModel.get() !== 'No Admin') {
              adModel.delete();
            }
          }
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
      }
}
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';
import { deleteDB, insertDB, selectDB, updateDB, getLeaves, getEmployees } from '../lib/database/query';
import {keys, values, map} from "lodash";
import { differenceInDays, parse, parseISO, format, isSameMonth, differenceInMinutes, subDays, addDays } from 'date-fns';
import { getPathParams } from '../generateParams';

interface dataInput{
    accID: string,
    compID: string,
    employID?: string
}
export default class employer{
    data:dataInput = {
        accID:  "",
        compID: "",
    }

    employID: string = "";
    private readonly __TABLE__ = 'Employer';

    constructor(params:string|dataInput){
        if(typeof params === "string"){
            this.employID = params;
        }else{
            this.data = {...this.data, ...params};
        }
    }

    public async get(){
        try {
            const result = await selectDB(this.__TABLE__, `empID = '${this.employID}'`)
            if (result.length === 0) throw new Error("Not found");
            else {
              this.data = {...this.data, ...result[0]}
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async getEmployer(){
        try {
            const result = await selectDB(this.__TABLE__, `employID = '${this.employID}'`)
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
    public async checkEmp(){
        try {
            const result = await selectDB(this.__TABLE__, `accID = '${this.data.accID}'`)
            if (result.length === 0){
              return 'Not found'
            }
            else {
              this.data = {...this.data, ...result[0]}
              return 'Already exist'
            }
          } catch (err){
            console.error(err)
            throw new Error("Unable to update");
          }
    }
    public async insert() {
        this.employID = uuidv4();
        const stringFormat = "{'employID': ?, 'accID': ?, 'compID': ?}"
        const params = [
            this.employID,
            this.data.accID,
            this.data.compID,
        ]
        try {
            await insertDB(this.__TABLE__, stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
    public async delete(){
        const deleteFormat = JSON.parse(JSON.stringify(this.data));
        delete deleteFormat.employID;
        delete deleteFormat.accID;
        delete deleteFormat.compID;
        const fields = keys(deleteFormat);
        const newValues = values(deleteFormat);
        const deleteStatement = map(fields, (field) => `${field} = ?`);
        const where = `employID='${this.data.employID}' AND accID='${this.data.accID}'`
        try {
          await deleteDB(this.__TABLE__, where);
        } catch (err) {
          console.error(err);
          throw new Error("Failed to delete")
        }
    }
    // employerID: string;
    // accID: string;
    // compID: string;
    // assocCompany: string;

    // constructor(assocCompany:string, employerID: string|undefined=undefined, accID: string|undefined=undefined, compID: string|undefined=undefined){
    //     this.assocCompany = assocCompany;
    //     this.employerID = (employerID === undefined || employerID === '')? uuidv4(): employerID;
    //     this.accID = (accID === undefined || accID === '')? uuidv4(): accID;
    //     this.compID = (compID === undefined || compID === '')? uuidv4(): compID;
    // }
}
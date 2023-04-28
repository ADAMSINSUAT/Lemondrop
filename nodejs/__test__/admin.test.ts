import _, { truncate } from "lodash";
import {v4 as uuidv4} from 'uuid';
import { selectDB } from "../src/lib/database/query";
import { ExportConflictException } from "@aws-sdk/client-dynamodb";
import admin from "../src/modules/admin";
import account from "../src/modules/account";

//fname: string, lname: string, email: string, password: string, role: string
const listing = [
    ["721803jpu-=12-9301c0j9i", "1208739hcejdqpoc21jc0123"],
    ["92183jioasdjcwiuec12k090", "102387c2uosaijdcakdjqcw0p"]
]

let deleteID:any;

// const deleteID = [
//     "9032cc74-e5d8-4896-a269-1125dd6655d7",
//     "9032cc74-e5d8-4896-a269-1125dd6655d7",
//     "9032cc74-e5d8-4896-a269-1125dd6655d7"
// ]

test('new admin model', ()=>{
    const models = new admin({adminID: listing[0][0] as string, accID: listing[0][1] as string});

        expect(models.data.adminID).toBe(listing[0][0]);
        expect(models.data.accID).toBe(listing[0][1]);
        expect(typeof models.data.adminID).toBe("string");
        expect(typeof models.data.accID).toBe("string");
})

test('get admin', async()=>{
    if(deleteID !== undefined){
        const models = new admin(deleteID as string);
        expect(await models.get() === "No Admin").toBeTruthy();
        expect(typeof models.data).toBe("object")
    }
})

test('insert admin', async()=>{
    const models = new admin({adminID: listing[0][0] as string, accID: listing[0][1] as string});

    expect(await models.get() === "No Admin").toBeTruthy()
    if (await models.get() === "No Admin") {
        await models.insert();
        deleteID = await models.data.accID
    }
})

//It is commented because it needs an existing admin id for it to work
test('delete admin', async()=>{
    if(deleteID !== undefined){
        const models = new admin(deleteID as string);
        expect(await models.get() !== "No Admin").toBeTruthy();
        await models.get();
        await models.delete();
    }
})
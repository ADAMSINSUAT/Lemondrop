import account  from "../src/modules/account";
import _, { truncate } from "lodash";
import {v4 as uuidv4} from 'uuid';
import { selectDB } from "../src/lib/database/query";
import { ExportConflictException } from "@aws-sdk/client-dynamodb";
import company from "../__data__/company";

//fname: string, lname: string, email: string, password: string, role: string
const listing = [
    ['Adam', 'Sinsuat', 'adamsinsuat@gmail.com', 'pokemontalon067', 'Employee'],
    ['Jose', 'Rizal', 'joserizal@gmail.com', 'joserizal123', 'Admin']
]

let deleteID:any;


test('new account model', ()=>{
    const models = new account({fname: 'Adam', lname: 'Sinsuat', email: 'adamsinsuat@gmail.com', password: 'pokemontalon067', role: 'Employee'})
    expect(models.data.fname).toBe('Adam')
    expect(models.data.lname).toBe('Sinsuat')
    expect(models.data.email).toBe('adamsinsuat@gmail.com')
    expect(models.data.password).toBe('pokemontalon067')
    expect(models.data.role).toBe('Employee')
    expect(typeof models.accID).toBe('string')
    expect(models.accID).toBeDefined();
})


test('insert account', async()=>{
    const models = new account({fname: listing[1][0] as string, lname: listing[1][1] as string, email: listing[1][2] as string, password: listing[1][3] as string, role: listing[1][4] as string})

    expect(await models.getName(models.data.fname as string, models.data.lname as string) !=="Found").toBeTruthy();
    if (await models.getName(models.data.fname as string, models.data.lname as string) !== "Found") {
        await models.insert();
        deleteID = await models.accID
    }
})

test('get account', async()=>{
    if(deleteID !== undefined){
        const models = new account(deleteID as string);

        expect(await models.getAccount() !== "Not found").toBeTruthy();
        console.log(await models.getAccount() !== "Not found")
        expect(typeof models.data).toBe("object")
    }
})

//It is commented because it needs an existing account id for it to work
test('delete account', async()=>{
    if (deleteID !== undefined) {
        const models = new account(deleteID as string)

        expect(await models.getAccount() !== "Not found").toBeTruthy()
        console.log(await models.getAccount() !== "Not found")
        if(await models.getAccount() !== "Not found"){
            await models.delete();
        }
    }
})
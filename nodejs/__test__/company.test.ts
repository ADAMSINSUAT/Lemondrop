import company  from "../src/modules/company";
import _, { truncate } from "lodash";
import {v4 as uuidv4} from 'uuid';
import { selectDB } from "../src/lib/database/query";


const newlisting = [
    ['Jelly-o', 20, 2],
    ['Peanutty', 25, 10]
]

const listing = [
    ['Workbean', 10, 2],
    ['Lemondrop', 5, 10]
]

const oldid = [
    "3c35d7cf-3896-4dd3-a9e6-734f1f496282",
    "430ca38d-a1b1-417f-b39b-3939906d3edc",
    "f80d1da2-407d-4f43-9794-6936e267fa5c",
    "1aac2516-f29d-48c3-9220-4171f3b259f2"
]

const id = [
    "3c35d7cf-3896-4dd3-a9e6-734f1f496282",
    "430ca38d-a1b1-417f-b39b-3939906d3edc"
]

let deleteID:any;

test('new company model', ()=>{
    const model = new company({compName: 'Workbean', allowOT: 20, allowLeaves: 2})
    expect(model.data.compName).toBe('Workbean')
    expect(typeof model.compID).toBe('string')
    expect(model.compID).toBeDefined()
    expect(model.data.allowOT).toBe(20)
    expect(model.data.allowLeaves).toBe(2)
})
test('get company list', async() =>{
    expect(await selectDB("Company"))
    console.log(await selectDB("Company"))
})
test('insert company', async() =>{
    const models = new company({compName: newlisting[0][0] as string, allowOT: newlisting[0][1] as number, allowLeaves: newlisting[0][2] as number});

    if (await models.getName(models.data.compName as string) === "Not found") {
        await models.insert();
        deleteID = await models.compID;
        console.log(await models.data)
    }

    expect(await models.getName(models.data.compName as string) === "Not found").toBeFalsy()
})

test('get ind company list', async()=>{
    if(deleteID !== undefined){
        const models = new company(deleteID as string);
        expect(await models.getCompany() !== 'Not found').toBeTruthy()

        if(await models.getCompany() !== 'Not found'){
            console.log(models.data)
        }
    }
})

test('update company', async() =>{
    if(deleteID!==undefined){
        const name = "Whacka"
        const compallowOT = listing[0][1]
        const compallowLeaves = listing[0][2]
    
        const updatemodel = {
            allowOT: compallowOT as number,
            allowLeaves: compallowLeaves as number
        }
    
        const models = new company(deleteID as string);
    
        expect(await models.getCompany() !== "Not found").toBeTruthy();
        if (await models.getCompany() !== "Not found") {
            models.data = { ...models.data, ...await updatemodel }
            expect(await models.update());
            console.log(await models.data)
        }
    }
})

//It is commented because the id no longer exists. Will need to insert a new company data for it to work again
test('delete company', async() =>{
    if(deleteID !== undefined){
        const models = new company(deleteID as string)

        expect(await models.getCompany() !== "Not found").toBeTruthy();

        if(await models.getCompany() !== "Not found"){
            await models.delete();
            console.log(await models.data)
        }
    }
})
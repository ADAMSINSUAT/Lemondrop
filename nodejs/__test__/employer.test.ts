import employer from "../src/modules/employer";
import _ from "lodash";

let deleteID:any;

test("new employer model", ()=>{
    const models = new employer({accID: "aljdshanfdlj1123" as string, compID: "asldja;sdasd" as string})
    expect(typeof models.data.accID).toBe("string")
    expect(models.data.accID).toBe("aljdshanfdlj1123");
    expect(typeof models.data.compID).toBe("string")
    expect(models.data.compID).toBe("asldja;sdasd");
    expect(models.employID).toBeDefined();
})

test("insert new employer", async()=>{
    const models = new employer({accID: "aljdshanfdlj1123" as string, compID: "asldja;sdasd" as string})

    expect(await models.checkEmp()==="Not found").toBeTruthy();

    if(await models.checkEmp() === "Not found"){
        await models.insert();
        deleteID = await models.employID
        console.log(await models.data)
    }
})

test("delete employer", async()=>{
    if(deleteID !== undefined){
        const models = new employer(deleteID as string);

        expect(await models.getEmployer() !== "Not found").toBeTruthy();

        if(await models.getEmployer() !== "Not found"){
            await models.delete();
            console.log(await models.data)
        }
    }
})
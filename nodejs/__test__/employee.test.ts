import _ from "lodash"
import leave from "../src/modules/leave";
import absence from "../src/modules/absence";
import overtime from "../src/modules/overtime";
import employee from "../src/modules/employee";
import company from "../src/modules/company";
import {isBefore, addDays} from "date-fns";

const empID = [
    "109283jpidpojsak",
    "123-8921eiwpaodk",
    "123jspadkpaasdva",
    "109ueisajdksa;dm"
]
const accID = [
    "10923psadka;dkma",
    "osaidnajdla;ksdm",
    "1283usiadjaklmas",
    "2183uosakdjsa;kc"
]
const compID = [
    "12093ioasdjvasas",
    "oasuid1023juw139",
    "o123y210kiosksaf",
    "sajd;1c293-ioaus"
]
// const listing = [
//     new employee({hourlySalary: 50, empType: "Fulltime", accID: accID[0], compID: compID[0]}),
//     new employee({hourlySalary: 100, empType: "Parttime", accID: accID[1], compID: compID[1]}),
//     new employee({hourlySalary: 150, empType: "Parttime", accID: accID[2], compID: compID[2]}),
//     new employee({hourlySalary: 200, empType: "Fulltime", accID: accID[3], compID: compID[3]}),
// ]
const listing = new employee({hourlySalary: 50, empType: "Fulltime", accID: accID[0], compID: "430ca38d-a1b1-417f-b39b-3939906d3edc"})

let deleteID:any;

let lvID:any;

let absID:any;

let ovtID:any;

const uplisting = {hourlySalary: 60, empType: "Parttime"}

test('new employe', ()=>{
    const models = new employee({hourlySalary: 50, empType: 'Fulltime', accID: '10923psadkadkma', compID: '10923psadkadkma'})
    expect(models.data.hourlySalary).toBe(50)
    expect(typeof models.data.hourlySalary).toBe("number")
    expect(models.data.empType).toBe("Fulltime")
    expect(typeof models.data.empType).toBe("string")
    expect(models.data.accID).toBe("10923psadkadkma")
    expect(typeof models.data.accID).toBe("string")
    expect(models.data.compID).toBe("10923psadkadkma")
    expect(typeof models.data.compID).toBe("string")
})
test('insert employee', async()=>{
    console.log(listing.data)
    expect(typeof listing).toBe("object")
    expect(typeof listing.data.hourlySalary).toBe("number")
    expect(listing.data.hourlySalary).toBeGreaterThanOrEqual(40)
    expect(typeof listing.data.empType).toBe("string");
    expect(typeof listing.data.accID).toBe("string");
    expect(typeof listing.data.compID).toBe("string")

    if(await listing.checkEmp() !== "Already exist"){
        await listing.insert()
        deleteID = await listing.empID
    }
})
// test('update employee', async()=>{
//     if (deleteID !== undefined) {
//         const models = new employee(deleteID as string)
//         //expect(await models.getEmployee() !== "Not found").toBeTruthy();
//         const upArray = {
//             hourlySalary: uplisting.hourlySalary,
//             empType: uplisting.empType
//         }

//         if(await models.getEmployee() !== "Not found"){
//             models.data = {...models.data, ...await upArray}
//             await models.update();
//             console.log(models.data)
//         }
//     }
// })
test('request employee leaves', async()=>{
    if(deleteID!==undefined){
        const leaves ={
            empID: deleteID as string,
            date_started: "`10/26/2022`" as unknown as Date, 
            date_ended: "`10/27/2022`" as unknown as Date, 
            reason: "Sick"  as string
        }
        const leavemodel = new leave(leaves)

        const models = new employee(leaves.empID)
        expect(isBefore(addDays(new Date(JSON.stringify(leavemodel.data.date_started).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(leavemodel.data.date_ended).replace(/['"`]+/g, '')), 1))).toBeTruthy()

        expect(leavemodel.data.approved).toBeDefined()

        expect(await models.getEmployee() !== "Not found").toBeTruthy()

        if (await models.getEmployee() !== "Not found") {
            if(await leavemodel.checkLeave() === "Not found"){
                console.log("leave request available")
                await leavemodel.insert();
                lvID = await leavemodel.lvID;
                console.log(leavemodel.data)
            }
        }
    }
})
test('approve leave request', async()=>{
    if(lvID!==undefined){
        const array = {
            lvID: lvID as string,
            approved: "Confirmed"
        }
        const models = new leave(array.lvID as string)
        //expect(await models.getLeave()!=="Not found").toBeFalsy()
        if(await models.getLeave()!=="Not found"){
            models.data = {...models.data, ...await array}
            await models.update();
            console.log(models.data)
        }
    }
})
// test('deny leave request', async()=>{
//     if(lvID!==undefined){
//         const array = {
//             lvID: lvID as string,
//             approved: "Denied"
//         }
//         const models = new leave(array.lvID as string)
//         //expect(await models.getLeave()!=="Not found").toBeFalsy()
//         if(await models.getLeave()!=="Not found"){
//             models.data = {...models.data, ...await array}
//             await models.update();
//             console.log(models.data)
//         }
//     }
// })
test('insert employee absences', async()=>{
    if(deleteID !== undefined){
        const absences = {
            empID: deleteID as string,
            date_started: "10/25/2022" as unknown as Date,
            date_ended: "10/26/2022" as unknown as Date,
            reason: "Family Emergency" as string
        }

        const absencemodel = new absence(absences);

        const models = new employee(absences.empID);

        expect(isBefore(addDays(new Date(JSON.stringify(absencemodel.data.date_started).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(absencemodel.data.date_ended).replace(/['"`]+/g, '')), 1))).toBeTruthy()

        expect(await models.getEmployee() !== "Not found").toBeTruthy()

        if (await models.getEmployee() !== "Not found") {
            if(await absencemodel.checkAbsence() === "Not found"){
                console.log("leave request available")
                await absencemodel.insert();
                absID = await absencemodel.absID;
                console.log(absencemodel.data)
            }
        }
    }
})
// test('cancel absence', async()=>{
//     if(absID!==undefined){
//         const models = new absence(absID as string)

//         if(await models.getAbsence()!=="Not found"){
//             await models.delEmpAbsence();
//             console.log(models.data)
//         }
//     }
// })
test('insert employee overtimes', async()=>{
    if(deleteID !== undefined){
        const overtimes = {
            empID: deleteID, 
            date_and_time_started: "10/26/2022 10:26:00 AM" as unknown as Date, 
            date_and_time_ended: "10/26/2022 12:00:00 PM" as unknown as Date
        }
    
        const overtimemodel = new overtime(overtimes)
    
        const models = new employee(overtimes.empID)
    
        expect(isBefore(addDays(new Date(JSON.stringify(overtimemodel.data.date_and_time_started).replace(/['"`]+/g, '')), 1), addDays(new Date(JSON.stringify(overtimemodel.data.date_and_time_ended).replace(/['"`]+/g, '')), 1))).toBeTruthy();
    
        expect(overtimemodel.ovtID).toBeDefined()
    
        expect(await models.getEmployee() !== "Not found").toBeTruthy()
    
        if(await models.getEmployee()!=="Not found"){
            if(await overtimemodel.checkOvertime() === "Not found"){
                await overtimemodel.insert();
                ovtID = await overtimemodel.ovtID;
                console.log(overtimemodel.data)
            }
        }
    }
})
test('approve overtime request', async()=>{
    if(ovtID!==undefined){
        const array = {
            ovtID: ovtID as string,
            approved: "Confirmed"
        }
        const models = new overtime(array.ovtID as string)
        //expect(await models.getLeave()!=="Not found").toBeFalsy()
        if(await models.getOvertime()!=="Not found"){
            models.data = {...models.data, ...await array}
            await models.update();
            console.log(models.data)
        }
    }
})
// test('deny overtime request', async()=>{
//     if(ovtID!==undefined){
//         const array = {
//             ovtID: ovtID as string,
//             approved: "Denied"
//         }
//         const models = new overtime(array.ovtID as string)
//         //expect(await models.getLeave()!=="Not found").toBeFalsy()
//         if(await models.getOvertime()!=="Not found"){
//             models.data = {...models.data, ...await array}
//             await models.update();
//             console.log(models.data)
//         }
//     }
// })
test('compute remaining leaves', async()=>{
    if(deleteID!==undefined){
        const getModel = new employee(deleteID)
        const getMonth = new Date().toString();
    
        expect(typeof getMonth).toBe("string")
        expect(await getModel.getEmployee()!=="Not found").toBeTruthy()
    
        if(await getModel.getEmployee()!=="Not found"){
            const compModel = new company(await getModel.data.compID);
    
            expect(await compModel.getCompany() !== "Not found").toBeTruthy();
    
            if(await compModel.getCompany() !== "Not found"){
                expect(await getModel.computeRemLeaves(getMonth, compModel.data.allowLeaves)).toBeGreaterThanOrEqual(1)
                expect(typeof await getModel.computeRemLeaves(getMonth, compModel.data.allowLeaves)).toBe("number")
                console.log("Remaining Leaves: "+ await getModel.computeRemLeaves(getMonth, compModel.data.allowLeaves))
            }
        }
    }
})
test('compute total absences', async()=>{
    if(deleteID!==undefined){
        const getModel = new employee(deleteID)
        const getMonth = new Date().toString();
    
        expect(typeof getMonth).toBe("string")
        expect(await getModel.getEmployee()!=="Not found").toBeTruthy()
    
        if(await getModel.getEmployee()!=="Not found"){
            const compModel = new company(await getModel.data.compID);
    
            expect(await compModel.getCompany() !== "Not found").toBeTruthy();
    
            if(await compModel.getCompany() !== "Not found"){
                expect(await getModel.computeTotAbsences(getMonth, compModel.data.allowLeaves)).toBeGreaterThanOrEqual(1)
                expect(typeof await getModel.computeTotAbsences(getMonth, compModel.data.allowLeaves)).toBe("number")
                console.log("Total Absences: "+ await getModel.computeTotAbsences(getMonth, compModel.data.allowLeaves))
            }
        }
    }
})
test('compute total overtime', async()=>{
    if(deleteID!==undefined){
        const getModel = new employee(deleteID)
        const getMonth = new Date().toString();
    
        expect(typeof getMonth).toBe("string")
        expect(await getModel.getEmployee()!=="Not found").toBeTruthy()
    
        if(await getModel.getEmployee()!=="Not found"){
            const compModel = new company(await getModel.data.compID);
    
            expect(await compModel.getCompany() !== "Not found").toBeTruthy();
    
            if(await compModel.getCompany() !== "Not found"){
                expect(await getModel.computeTotOvertime(getMonth, compModel.data.allowOT)).toBeGreaterThanOrEqual(1)
                expect(typeof await getModel.computeTotOvertime(getMonth, compModel.data.allowOT)).toBe("number")
                console.log("Total Overtime: "+ await getModel.computeTotOvertime(getMonth, compModel.data.allowOT))
            }
        }
    }
})
test('compute daily wage', async()=>{
    if(deleteID!==undefined){
        const getModel = new employee(deleteID)

        expect(await getModel.getEmployee() !== "Not found").toBeTruthy();

        if(await getModel.getEmployee() !== "Not found"){
            expect(await getModel.computeDailyWage()).toBeGreaterThan(200);
            expect(typeof await getModel.computeDailyWage()).toBe("number");
            console.log("Daily wage:" + await getModel.computeDailyWage());
        }
    }
})
test('compute monthly wage', async()=>{
    if(deleteID!==undefined){
        const getModel = new employee(deleteID)
        const getMonth = new Date().toString();
    
        expect(typeof getMonth).toBe("string")
        expect(await getModel.getEmployee()!=="Not found").toBeTruthy()
    
        if(await getModel.getEmployee()!=="Not found"){
            const compModel = new company(await getModel.data.compID);
    
            expect(await compModel.getCompany() !== "Not found").toBeTruthy();
    
            if(await compModel.getCompany() !== "Not found"){
                expect(await getModel.computeMonthlySalary(getMonth, compModel.data.allowLeaves, compModel.data.allowOT)).toBeGreaterThanOrEqual(1)
                expect(typeof await getModel.computeMonthlySalary(getMonth, compModel.data.allowLeaves, compModel.data.allowOT)).toBe("number")
                console.log("Monthly wage: "+ await getModel.computeMonthlySalary(getMonth, compModel.data.allowLeaves, compModel.data.allowOT))
            }
        }
    }
})
test('delete leaves', async()=>{
    if(deleteID!== undefined){
        const models = new employee(deleteID as string)

        expect(await models.getEmployee() !== "Not found").toBeTruthy();

        if (await models.getEmployee() !== "Not found") {
            _.each(models.data.leaves, async (data, index) => {
                const leaveModel = new leave(models.data.leaves?.[index].lvID)
                if (await leaveModel.getLeave() !== "Not found") {
                    await leaveModel.delEmpLeave();
                    //console.log(leaveModel.data);
                }
            })
        }
    }
})
test('delete absences', async()=>{
    if(deleteID!== undefined){
        const models = new employee(deleteID as string)

        expect(await models.getEmployee() !== "Not found").toBeTruthy();
        
        if (await models.getEmployee() !== "Not found") {
            _.each(models.data.absences, async (data, index) => {
                const absenceModel = new absence(models.data.absences?.[index].absID)
                if (await absenceModel.getAbsence() !== "Not found") {
                    await absenceModel.delEmpAbsence();
                    //console.log(absenceModel.data);
                }
            })
        }
    }
})
test('delete overtimes', async()=>{
    if(deleteID!== undefined){
        const models = new employee(deleteID as string)

        expect(await models.getEmployee() !== "Not found").toBeTruthy();
        
        if (await models.getEmployee() !== "Not found") {
            _.each(models.data.overtimes, async (data, index) => {
                const overtimeModel = new overtime(models.data.overtimes?.[index].ovtID)
                if (await overtimeModel.getOvertime() !== "Not found") {
                    await overtimeModel.delEmpOvertime();
                    console.log(overtimeModel.data);
                }
            })
        }
    }
})
test('delete employee', async()=>{
    if(deleteID!==undefined){
        const models = new employee(deleteID as string)

        expect(await models.getEmployee() !== "Not found").toBeTruthy()

        if (await models.getEmployee() !== "Not found") {   
            await models.delete();
            console.log(models.data)
        }
    }
})
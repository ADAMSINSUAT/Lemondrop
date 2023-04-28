import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream } from "../generateParams";
import * as jwt from "../jwt";
import { selectDB } from "../lib/database/query";
import _ from "lodash";

export const loginRequest = async (req: IncomingMessage) =>{
    switch(req.method){
        case 'POST':
            const result = await getJSONDataFromRequestStream(req) as {email: string, password: string}
            const whereAccount = `email='${result.email}' AND password='${result.password}'`;
            const accountData = await selectDB("Account", whereAccount)
            let role:any;
             _.map(accountData, (data) => {
                role = data.role
             })
            let payload:any;
            if(accountData.length>0){
                if(role === "Employer"){

                    const whereEmployer = `accID='${_.map(accountData, (data)=>data.accID)}'`;
                    const employerData = await selectDB("Employer", whereEmployer)

                    //const whereEmployee = `accID='${_.map(accountData, (data)=>data.accID)}'`;
                    const employeeData = await selectDB("Employee")

                    const whereCompany = `compID ='${_.map(employerData, (data)=>data.compID)}'`
                    const companyData = await selectDB("Company", whereCompany)

                    let employID:any;
                    
                    _.map(employerData, (data)=>{
                        employID = data.employID
                    })

                    const empAccData = await selectDB("Account", `role = 'Employee'`)

                    const mergedEmp = _(employeeData).keyBy('accID').merge(_.keyBy(empAccData, 'accID')).values().value();
                    const mergedEmployer = _(employerData).keyBy('accID').merge(_.keyBy(accountData, 'accID')).values().value()

                    const token = await jwt.encrypt(accountData)
                    payload = {
                        token: token,
                        details: {
                            employID: employID,
                            accountData: mergedEmployer,
                            companyData: companyData,
                            employeeData: mergedEmp ,
                        }
                    }
                }
                else if(role === "Employee"){
                    
                    const whereEmployee = `accID='${_.map(accountData, (data)=>data.accID)}'`;
                    const employeeData = await selectDB("Employee", whereEmployee)

                    const whereCompany = `compID ='${_.map(employeeData, (data)=>data.compID)}'`
                    const companyData = await selectDB("Company", whereCompany)

                    let empID:any;
                    
                    _.map(employeeData, (data)=>{
                        empID = data.empID
                    })

                    const token = await jwt.encrypt(accountData)
                    payload = {
                        token: token,
                        details: {
                            empID: _.map(employeeData, (data) => data.empID),
                            accountData: accountData,
                            companyData: companyData,
                            empData: employeeData
                        }
                    }
                }
                if(role === "Admin"){
                    const whereAdmin = `accID='${_.map(accountData, (data)=>data.accID)}'`;
                    const adminData = await selectDB("Admin", whereAdmin)

                    let adminID:any;
                    
                    _.map(adminData, (data)=>{
                        adminID = data.adminID
                    })

                    const employerData = await selectDB("Employer");
                    const empAccData = await selectDB("Account", `role = 'Employer'`)
                    
                    const merged =_(employerData).keyBy('accID').merge(_.keyBy(empAccData, 'accID')).values().value();

                    //console.log(merged);

                    const companyData = await selectDB("Company");

                    const token = await jwt.encrypt(accountData)
                    payload = {
                        token: token,
                        details: {
                            adminID: adminID,
                            accountData: accountData,
                            employerData: merged,
                            companyData: companyData
                        }
                    }
                }
                return await payload
            }else{
                return "Incorrect email or password";
            }
            default:
                break;
    }
    return 'yes'
}
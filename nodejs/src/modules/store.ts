import Account from "./account";
import Admin from "./admin";
import Company from "./company";
import Employee from "./employee";
import Employer from "./employer";
import _ from "lodash";
import account from "../../__data__/account";
import admin from "../../__data__/admin";
import company from "../../__data__/company";
import employee from "../../__data__/employee";
import employer from "../../__data__/employer";

export default class store{
    accounts: Array<Account>;
    admins: Array<Admin>;
    companies: Array<Company>;
    employees: Array<Employee>;
    employers: Array<Employer>;

    constructor(accounts: Array<Account>, admins: Array<Admin>, companies: Array<Company>, employees: Array<Employee>, employers: Array<Employer>){
        this.accounts = accounts;
        this.admins = admins;
        this.companies = companies;
        this.employees = employees;
        this.employers = employers;
    }
    // constructor(accounts: Account[] = account,
    //     admins: Admin[] = admin,
    //     companies: Company[] = company,
    //     employees: Employee[] = [],
    //     employers: Employer[] = employer) {
    //     this.accounts = accounts;
    //     this.admins = admins;
    //     this.companies = companies;
    //     this.employees = employees;
    //     this.employers = employers;
    // }
    // constructor(){}

    // addAccount(accounts:Account):void{
    //     this.accounts.push(accounts);
    // }

    // updateAccount(accID:string, accounts:Account):void{
    //     this.accounts[_.findIndex(this.accounts, ['accID', accID])] = accounts;
    // }

    // getAccounts(accounts:Account):Account[]{
    //     return this.accounts;
    // }

    // addAdmin(admins:Admin):void{
    //     this.admins.push(admins);
    // }

    // updatAdmin(accID:string, admins:Admin):void{
    //     this.admins[_.findIndex(this.admins, ['accID', accID])] = admins;
    // }

    // getAdmins(admins:Admin):Admin[]{
    //     return this.admins;
    // }

    // addCompany(companies:Company):void{
    //     this.companies.push(companies);
    // }

    // updateCompany(compID:string, companies:Company):void{
    //     this.companies[_.findIndex(this.companies, ['accID', compID])] = companies;
    // }

    // getCompanies(companies:Company):Company[]{
    //     return this.companies;
    // }

    // addEmployee(employees:Employee):void{
    //     this.employees.push(employees);
    // }

    // updateEmployee(empID:string, employees:Employee):void{
    //     this.employees[_.findIndex(this.employees, ['empID', empID])] = employees;
    // }

    // getEmployees(employees:Employee):Employee[]{
    //     return this.employees;
    // }
    
    // addEmployer(employers:Employer):void{
    //     this.employers.push(employers);
    // }

    // updateEmployer(accID:string, employers:Employer):void{
    //     this.employers[_.findIndex(this.employers, ['accID', accID])] = employers;
    // }

    // getEmployers(employers:Employer):Employer[]{
    //     return this.employers;
    // }
}
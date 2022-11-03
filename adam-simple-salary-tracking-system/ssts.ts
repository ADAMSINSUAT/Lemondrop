abstract class Employee {
    //Base Data for all employee types
    readonly rate: number = 20; //The rate of how much an employee earns per hour
    readonly working_days: number = 5; //The number of working days an employee can earn in
    readonly allowed_leaves: number = 2; //The number of allowed leaves an employee can have.
    //Leaves mean that an employee can still earn while away.

    abstract max_work_hours: number; //Hours of payed work. It depends on the employment status
    abstract max_overTime: number; //Hours of allowed overtime work. Also depends on employment status.
    abstract bonus: number; //Bonus of salary depending if they reach a certain quota of working hours per week
    abstract totalDeductions: number; //The total deduction of hours with the formula of absences minus leaves.
    abstract totalOverTime: number; //The total hours of overtime by subtracting it by 1 until it is only 2.
    //abstract employment_type: string; //The type of employment status and determines how much
    //they can earn per hour, among other things.


    constructor(private firstname: string, private lastname: string, overtime: number, absences: number, position: string, leaves: number) {
        this.firstname = firstname;
        this.lastname = lastname;
    }
    abstract computeSalary(): number; //Computes the salary of an employee
    abstract computeTotalHours(): number; //Computes the total hours of work

    get fullName(): string { //Gets the full name of the employee
        return `${this.firstname} ${this.lastname}`
    }
}

class PartTimeEmployee extends Employee {
    private static employee_count = 0; //The total number of employees

    constructor(firstname: string, lastname: string, readonly overtime: number, readonly absences: number, readonly position: string, readonly leaves: number) {
        super(firstname, lastname, overtime, absences, position, leaves);
        PartTimeEmployee.employee_count++; //Adds the count of employees each time an employee is added
    }

    max_overTime: number = 2; //Maximum hours of allowed overtime
    max_work_hours: number = 4; //Maximum non-overtime work hours
    bonus: number = 10; //The amount of bonus (dollars) a part-time employee can get if they exceed 25 hours
    totalOverTime: number = 0;
    totalDeductions: number = 0;

    computeSalary(): number {
        let totalBonus: number = 0;
        let hoursWorked: number = this.computeTotalHours();
        if (this.computeTotalHours() >= 25) {
            totalBonus = this.bonus;
            hoursWorked = 25;
        }
        const partialsalary = hoursWorked * this.rate;

        const totalSalary = partialsalary + totalBonus;

        return totalSalary;
    }

    computeTotalHours(): number {
        this.totalOverTime = this.overtime;
        let totalAbsensces: number = this.absences;

        if (this.leaves > this.allowed_leaves) {
            totalAbsensces += (this.leaves - this.allowed_leaves);
            this.totalDeductions = totalAbsensces;
        }
        else {
            this.totalDeductions = totalAbsensces;
        }

        if (this.overtime > (this.max_overTime * this.working_days)) {
            this.totalOverTime = this.max_overTime * this.working_days;
        }

        const daysWorked = this.working_days - this.totalDeductions;

        const workHours = this.max_work_hours * daysWorked;

        const totalWorkHours = workHours + this.totalOverTime;

        return totalWorkHours;
    }

    static getEmployeeCount(): number {
        return PartTimeEmployee.employee_count;
    }
}

class FullTimeEmployee extends Employee {
    private static employee_count = 0; //The total number of employees

    constructor(firstname: string, lastname: string, readonly overtime: number, readonly absences: number, readonly position: string, readonly leaves: number) {
        super(firstname, lastname, overtime, absences, position, leaves);
        FullTimeEmployee.employee_count++; //Adds the count of employees each time an employee is added
    }

    max_overTime: number = 4; //Maximum hours of allowed overtime
    max_work_hours: number = 8; //Maximum non-overtime work hours
    bonus: number = 50; //The amount of bonus (dollars) a part-time employee can get if they exceed 25 hours
    totalOverTime: number = 0;
    totalDeductions: number = 0;
    totalPenalty: number = 0;

    computeSalary(): number {
        let totalBonus: number = 0;
        let hoursWorked: number = this.computeTotalHours();
        let unusedLeaveBonus: number = 0;

        if (this.computeTotalHours() >= 50) {
            totalBonus = this.bonus;
            hoursWorked = 50;
        }
        // if (this.totalDeductions <= 0) {
        //     unusedLeaveBonus = this.allowed_leaves * 10;
        // }

        if(this.leaves < 2){
            unusedLeaveBonus = (this.allowed_leaves - this.leaves) * 10;
        }

        const partialsalary = hoursWorked * this.rate;

        const totalSalary = (partialsalary + totalBonus + unusedLeaveBonus) - this.totalPenalty;

        return totalSalary;
    }

    computeTotalHours(): number {
        this.totalOverTime = this.overtime; //The total amount of overtime
        let totalAbsensces: number = this.absences; //The total amount of absences
        let leaveTime: number = 0; //The total amount of hours an employee has a leave

        if (this.leaves > this.allowed_leaves) {
            totalAbsensces += (this.leaves - this.allowed_leaves);
            this.totalDeductions = totalAbsensces;
        }
        else {
            this.totalDeductions = totalAbsensces;
        }

        if ((this.totalDeductions * this.max_work_hours) > 24) {
            this.totalPenalty = 25;
        }

        if (this.overtime > (this.max_overTime * this.working_days)) {
            this.totalOverTime = this.max_overTime * this.working_days;
        }

        // if (this.leaves > 0) {
        //     leaveTime = this.allowed_leaves * this.working_days;
        // }


        const daysWorked = this.working_days- this.totalDeductions;

        const workHours = this.max_work_hours * daysWorked;

        const totalWorkHours = workHours + this.totalOverTime;

        return totalWorkHours;
    }

    static getEmployeeCount(): number {
        return FullTimeEmployee.employee_count;
    }
}
//Fname, Lname,    OT, Abs, Position,      Leaves
let partimer1 = new PartTimeEmployee('Adam', 'Sinsuat', 0, 0, 'Front-end Intern', 1);
let partimer2 = new PartTimeEmployee('Jose', 'Baisac', 10, 0, 'Front-end Intern', 1);

let partTimers: PartTimeEmployee[] = [
    partimer1,
    partimer2,
];

let fulltimer1 = new FullTimeEmployee('Marie', 'Marx', 20, 0, 'Front-end Intern', 2);
let fulltimer2 = new FullTimeEmployee('Donald', 'Duck', 0, 0, 'Front-end Intern', 0);

let fullTimers: FullTimeEmployee[] = [
    fulltimer1,
    fulltimer2,
];

console.log(`~~~Welcome to LemonSqueeze Studios~~~`);
console.log(``);
console.log(`~~~Part-time Employees`);
console.log(`Total number of employees: ${PartTimeEmployee.getEmployeeCount()}`);
partTimers.map(empData => {
    console.log(`${empData.fullName} earned $${empData.computeSalary()}`);
})
console.log(``);
console.log(`~~~Full-time Employees~~~`);
console.log(`Total number of employees: ${FullTimeEmployee.getEmployeeCount()}`);
fullTimers.map(empData => {
    console.log(`${empData.fullName} earned $${empData.computeSalary()}`);
})
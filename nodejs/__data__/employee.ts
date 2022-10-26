import Leave from "../src/modules/leave";
import Absence from "../src/modules/absence";
import Overtime from "../src/modules/overtime";

export default[
    {
        leaves: [
            new Leave(new Date(10/12/2022), new Date(10/13/2022), "Sick", false),
            new Leave(new Date(10/15/2022), new Date(10/16/2022), "Sick", false),
        ],
        overtimes: [
            new Overtime(new Date(), new Date("10/01/2022 06:00:00 PM"), new Date("10/02/2022 12:00:00 AM"), false),
            new Overtime(new Date(), new Date("10/05/2022 08:00:00 PM"), new Date("10/06/2022 04:00:00 AM"), false),
        ],
        absences: [
            new Absence(new Date(10/20/2022), new Date(10/21/2022)),
            new Absence(new Date(10/23/2022), new Date(10/24/2022)),
        ],
        empType: "Employee",
        hourlySalary: "50",
        empID: "12307217390ljkajfa",
        accID: "lkjasdljasd01293",
        compID: "123123asd",
    },
    {
        leaves: [
            new Leave(new Date(10/22/2022), new Date(10/23/2022), "Sick", false)
        ],
        overtimes: [
            new Overtime(new Date(), new Date("10/10/2022 11:00:00 PM"), new Date("10/11/2022 05:00:00 AM"), false),
        ],
        absences: [
            new Absence(new Date(10/28/2022), new Date(10/29/2022)),
        ],
        hourlySalary: 50,
        empType: "Employee",
        empID: "12307217390fgjnbsa",
        accID: "lkjasdljasd01294",
        compID: "123123ase",
    }
]
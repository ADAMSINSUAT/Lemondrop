import React, {Component} from "react";
import Table from "./EmployeeTable";

class App extends Component{
    render(){
        const characters = [{
            fname: 'Marie',
            lname: 'Mar',
            position: 'HR',
            salary: 'P20,000',
            email: 'mariemar@gmail.com'
        },
        {
            fname: 'Goda',
            lname: 'Goya',
            position: 'Marketing',
            salary: 'P24,000',
            email: 'godagoya@gmail.com'
        },
        {
            fname: 'Cal',
            lname: 'Machinegun',
            position: 'Sales',
            salary: 'P30,000',
            email: '50cal@gmail.com'
        },
        {
            fname: 'Jordan',
            lname: 'Michael',
            position: 'Frontend',
            salary: 'P35,000',
            email: 'nbasupastart@gmail.com'
        },
        ]
        return(
            <div className="p-2">
                <Table characterData= {characters}/>
            </div>
        )
    }
}

export default App;
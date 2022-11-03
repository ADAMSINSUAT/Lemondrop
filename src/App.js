import React, {Component} from "react";
import Table from "./Components/EmployeeTable";
import { characters } from "./models/employees";

export default class App extends Component{
    constructor(){
        super();
        this.state = {
           visible: false,
           employeeData: [...characters],
           editEmployeeID: null,
           addEmployeeData: {
            id: '',
            fname: '',
            lname: '',
            position: '',
            salary: '',
            email: '',
            date: '',
           }
        }
        this.showAddEmployee = this.showAddEmployee.bind(this);
        this.handleAddEmployee = this.handleAddEmployee.bind(this);
        this.handleInput= this.handleInput.bind(this);
        this.checkData = this.checkData.bind(this);
        this.AddEmployeeForm = this.AddEmployeeForm.bind(this);
    }
    checkData(){
        const datalength= this.state.employeeDate;
        console.log(datalength);
    }
    checkDate(){
        const nowDate = new Date();
        console.log(nowDate.toLocaleDateString());
    }
    handleEditID(event){
        event.preventDefault();
        this.setState({editEmployeeID: this.state.employeeData.id});
    }
    showAddEmployee(){
        this.setState(state=>{
            return{visible: !state.visible}
        })
    }
    handleInput(e) {
        const {name, value} = e.target;
        this.setState({
            addEmployeeData:{
                ...this.state.addEmployeeData,
                [name]: value
            }
        })
    }
    async handleAddEmployee(){
        const datenow = new Date();
        await this.setState({
            addEmployeeData:{
                ...this.state.addEmployeeData,
                date: datenow.toLocaleDateString(),
                //id: this.employeeData.id,
            }
        });

        const data = this.state.employeeData;

        const newData = this.state.addEmployeeData;

        data.push(newData);

        this.setState({employeeData: data});

        await this.setState({
            addEmployeeData: {
                fname: '',
                lname: '',
                position: '',
                salary: '',
                email: '',
                date: '',
            }
        })
    }

    AddEmployeeForm(){
        return(
            <div className="flex flex-col mx-96 mt-2 gap-2 border-2 rounded-sm border-blue-200 py-2 items-center">
                <div className="flex flex-row">
                    <div className="flex flex-col gap-3">
                        <label>Enter First Name: </label>
                        <label>Enter Last Name: </label>
                        <label>Enter Position: </label>
                        <label>Enter Salary: </label>
                        <label>Enter Email: </label>
                    </div>
                    <div className="flex flex-col gap-2 mt-0">
                        <input name='fname' required className="border-2 rounded-sm" value={this.state.addEmployeeData.fname} onChange={this.handleInput}></input>
                        <input name='lname' required className="border-2 rounded-sm" value={this.state.addEmployeeData.lname} onChange={this.handleInput}></input>
                        <input name='position' required className="border-2 rounded-sm" value={this.state.addEmployeeData.position} onChange={this.handleInput}></input>
                        <input name='salary' required className="border-2 rounded-sm" value={this.state.addEmployeeData.salary} onChange={this.handleInput}></input>
                        <input name='email' required className="border-2 rounded-sm" value={this.state.addEmployeeData.email} onChange={this.handleInput}></input>
                    </div>
                </div>
                <button className="w-1/2 border-2 rounded-md mt-10" onClick={(event) => this.handleAddEmployee(event.target.value)}>Add Employee</button>
            </div>
        )
    }
    render(){     
        return(
            <div className="p-2">
                <Table characterData= {this.state.employeeData} editEmployeeID={this.state.editEmployeeID}/>
                <button className="border-2 rounded-md mt-10" onClick={this.showAddEmployee}>Show Add Employee Form</button>
                <button className="border-2 rounded-md mt-10" onClick={this.checkData}>Check Data</button>
                <button className="border-2 rounded-md mt-10" onClick={this.checkDate}>Check Date</button>
                {this.state.visible && <this.AddEmployeeForm/>}
            </div>
        )
    }
}
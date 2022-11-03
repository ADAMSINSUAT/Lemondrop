import React, { Component } from "react";
const TableHeader = () => {
    return (
        <thead className="text-center bg-secondary-neon">
            <tr>
                <td className="border-2 border-blue-400 py-3">First Name</td>
                <td className="border-2 border-blue-400 py-3">Last Name</td>
                <td className="border-2 border-blue-400 py-3">Position</td>
                <td className="border-2 border-blue-400 py-3">Salary</td>
                <td className="border-2 border-blue-400 py-3">Email</td>
                <td className="border-2 border-blue-400 py-3">Action</td>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    const rows = props.characterData.map((row, index) => {
        return (
            <tr className="text-center" key={index}>
                <td className="border p-2">{row.fname}</td>
                <td className="border p-2">{row.lname}</td>
                <td className="border p-2">{row.position}</td>
                <td className="border p-2">{row.salary}</td>
                <td className="border p-2">{row.email}</td>
                <td className="border p-2">
                    <button className="ml-10 px-4 py-2 border-2 rounded-md border-green-400">Edit</button>
                    <button className="ml-10 px-4 py-2 border-2 rounded-md border-green-400">Delete</button>
                </td>
            </tr>
        )
    })
    return <tbody>{rows}</tbody>
}

class Table extends Component {
    render() {
        const { characterData } = this.props;

        return (
            <table className="border-blue-400 w-full">
                <TableHeader></TableHeader>
                <TableBody characterData={characterData}></TableBody>
            </table>
        )
    }
}
export default Table;
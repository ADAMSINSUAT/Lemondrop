import React from "react";

const ReadOnlyRow = ({row, index}) => {
    return (
        <tr className="text-center" key={row.id}>
            <td className="border p-2">{row.fname}</td>
            <td className="border p-2">{row.lname}</td>
            <td className="border p-2">{row.position}</td>
            <td className="border p-2">{row.salary}</td>
            <td className="border p-2">{row.email}</td>
            <td className="border p-2">{row.date}</td>
            <td className="border p-2">
                <button className="ml-10 px-4 py-2 border-2 rounded-md border-green-400">Edit</button>
                <button className="ml-10 px-4 py-2 border-2 rounded-md border-green-400">Delete</button>
            </td>
        </tr>
    )
}

export default ReadOnlyRow;
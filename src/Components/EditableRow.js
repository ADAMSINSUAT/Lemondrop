import React from "react";

const EditableRow = () =>{
    return(
        <tr className="items-center justify-center">
            <td><input type="text" required placeholder="Enter first name..." name='fname' className="border-2 rounded-sm p-2"></input></td>
            <td><input type="text" required placeholder="Enter last name..." name='fname' className="border-2 rounded-sm p-2"></input></td>
            <td><input type="text" required placeholder="Enter position..." name='fname' className="border-2 rounded-sm p-2"></input></td>
            <td><input type="text" required placeholder="Enter salary..." name='fname' className="border-2 rounded-sm p-2"></input></td>
            <td><input type="email" required placeholder="Enter email..." name='fname' className="border-2 rounded-sm p-2"></input></td>
            <td><input type="text" required placeholder="Enter date..." name='fname' className="border-2 rounded-sm p-2"></input></td>
        </tr>
    )
}

export default EditableRow;
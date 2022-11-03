import React, { Component, Fragment } from "react";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

const TableHeader = () => {
    return (
        <thead className="text-center bg-secondary-neon">
            <tr>
                <td className="border-2 border-blue-400 py-3">First Name</td>
                <td className="border-2 border-blue-400 py-3">Last Name</td>
                <td className="border-2 border-blue-400 py-3">Position</td>
                <td className="border-2 border-blue-400 py-3">Salary</td>
                <td className="border-2 border-blue-400 py-3">Email</td>
                <td className="border-2 border-blue-400 py-3">Date Added</td>
                <td className="border-2 border-blue-400 py-3">Action</td>
            </tr>
        </thead>
    )
}

const TableBody = (props) => {
    const rows = props.characterData.map((row, index) => {
        return (
            <Fragment>
                {props.editEmployeeID === row.id? <EditableRow />: <ReadOnlyRow row={row} index={index} />}
            </Fragment>
        )
    })
    return <tbody>{rows}</tbody>
}

class Table extends Component {
    render() {
        const { characterData, editEmployeeID } = this.props;

        return (
            <form>
                <table className="border-blue-400 w-full">
                    <TableHeader></TableHeader>
                    <TableBody characterData={characterData} editEmployeeID={editEmployeeID}></TableBody>
                </table>
            </form>
        )
    }
}
export default Table;
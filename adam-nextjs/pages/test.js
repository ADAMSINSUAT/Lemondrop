import { useSelector, useDispatch } from "react-redux";

export default function TestPage(){
    const employee = useSelector(state=>state.employee);
    return(
        <div>
            <div>Computer Leaves: {}</div>
        </div>
    )
}
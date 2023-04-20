import React from "react";
import { Link } from "react-router-dom";

export default function TableView(props){
    const tableHeads = props.tableHeads;
    const tableData = props.tableData;
    const displayFields = props.displayFields;
    const dataViewLink = props.dataViewLink;
    const idField = props.idField;
    return (
        <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            {
                tableHeads.map((element, index)=>{
                    return (
                        <th key={index} scope="col">{tableHeads[index]}</th>
                    );
                })
            }
          </tr>
        </thead>

        <tbody>

        {
            tableData.map((element, index) => {
                return (
                    <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        {
                            displayFields.map((element2, index2) => {
                                return (
                                    <td key={index2}>{tableData[index][displayFields[index2]]}</td>
                                );
                            })
                        }
                        <td><Link to={dataViewLink} state={{id: element[idField]}} type="button" className="btn btn-primary">View</Link></td>
                    </tr>
                );
            })
        }


        </tbody>
        
        </table>
    );
}
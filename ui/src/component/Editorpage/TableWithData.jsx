export default function TableWithData({ recordDataArray, schema,setShowPanelData }) {

  function handleEditRecord(e) {
    let id = e.currentTarget.getAttribute("data-id");
    setShowPanelData({
      action: 'edit',
      schema: schema,
      recordId: id,
      recordData: recordDataArray.filter((rowData) => rowData["_id"] === id)[0]
    });
    let button = document.getElementsByClassName("overlayout-table-data")[0];
    button.style.setProperty("right", "0px", "important");
    button.classList.remove('left-[100%]');
    button.classList.add("show");
  }

  // data not fetched
  let columnArray = schema.schema;
  // if (recordDataArray.length === 0) return;
  let columnNames = columnArray.map((obj) => {
    return obj.name;
  });

  return (
    <div className="table-container overflow-x-auto pt-1">
      <table className="table table-lg bg-accent-neutral">
        {/* head */}
        <thead>
          <tr>
            <th>Sr.no.</th>
            {columnNames.map((element, index) => <th key={index}>{element}</th>)}
          </tr>
        </thead>
        {recordDataArray.length === 0 ? null :
          (<tbody>
            {/* row's... */}
            {recordDataArray.map((rowData, rowIndex) => {
              return(<tr className="hover" key={rowIndex} onClick={handleEditRecord} data-id={rowData._id}>
                <th>{rowIndex}</th>
                {columnNames.map((columnName, columnIndex) => {
                  return(<td key={columnIndex}>{rowData[columnName]}</td>)
                })}
              </tr>)
            })}
          </tbody>)}
      </table>
    </div>
  )
}
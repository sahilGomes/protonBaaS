import Searchbar from "../Searchbar";
import settingsLogo from "../../assets/collectionSettigsLogo.svg";
import refreshLogo from "../../assets/refreshLogo.svg";
import { useEffect, useState } from "react";
import TSidepanel from "./TSidepanel";
import TableWithData from "./TableWithData";
import { useOutletContext } from "react-router-dom";

export default function Documentstable({ activeCollection, collectionData, setParentShowPanelData }) {
  const { setPopmessage } = useOutletContext();
  const [searchvalue, setSearchvalue] = useState("");
  const [recordDataarray, setRecordDataArray] = useState([]);
  const [showPanelData, setShowPanelData] = useState(null);
  const [loading, setLoading] = useState(true);

  let schema = collectionData.filter((objSchema) => {
    return activeCollection === objSchema.name
  })[0];

  async function fetchData(abortController) {
    const signal = abortController.signal;
    setLoading(true);
    try {
      const response = await fetch(`${location.protocol}//${location.hostname}:8080/api/collections/${schema._id}/records`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": JSON.parse(localStorage.getItem("admin_auth")).token
          },
          signal: signal
        },
      );
      const result = await response.json();
      // Check if the component is still mounted before updating state
      if (!signal.aborted) {
        setRecordDataArray(result.items);
        setLoading(false);
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      // Handle error
      setPopmessage(`Error fetching data at collection message:,${error.message}`)
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController);
    // abort fucntion/cleanup
    return () => {
      abortController.abort();
    };
  }, [activeCollection]);

  function handleNewDataButton(e) {
    setShowPanelData({ action: 'new', schema: schema, recordId: null, recordData: null });
    let button = document.getElementsByClassName("overlayout-table-data")[0];
    button.style.setProperty("right", "0px", "important");
    button.classList.remove('left-[100%]');
    button.classList.add("show");
  }

  function handleSettingButton(e) {
    setParentShowPanelData({ action: "edit", singleCollectionSchema: schema, activeCollection: activeCollection });
    let overlayout = document.getElementsByClassName("overlayout-collection")[0];
    overlayout.classList.add("show");
  }

  // refresh the data on refresh click
  function refreshDataHandler(e) {
    // call fetch and update recordData
    const abortController = new AbortController();
    fetchData(abortController);
    console.log("refresh")
  }

  // to get table columns name
  const tableColumnArray = []
  collectionData.forEach(element => {
    tableColumnArray.push(element["name"]);
  });

  return (
    <>
      <div className="table_navbar flex justify-between h-[40px] items-center">
        <div className="nav_left_container flex gap-2 text-xl">
          <div>Collection /</div>
          <div>{activeCollection}</div>
          <button className="settings hover:bg-accent-content rounded-full relative after:content-['settings']  after:z-10 after:absolute after:hidden hover:after:inline hover:after after:top-[100%] after:left-[0] text-sm" onClick={handleSettingButton}><img src={settingsLogo} alt="logo" className="h-[35px] w-6 px-[2px] mx-2" /></button>
          <button className="refresh hover:bg-accent-content rounded-full relative after:content-['refresh']  after:z-10 after:absolute after:hidden hover:after:inline hover:after after:top-[100%] after:left-[0] text-sm" onClick={refreshDataHandler}><img src={refreshLogo} alt="logo" className="h-[35px] w-6 px-[2px] mx-2" /></button>
        </div>
        <div className="bg-primary p-1 rounded-lg text-primary-content cursor-pointer select-none" onClick={handleNewDataButton}>➕ New data</div>
      </div>
      <Searchbar value={searchvalue} placeholder="Search terms . . . ." changeSearchvalue={setSearchvalue} inputWidth="100%" />
      {loading ? <p>Loading...</p> : <TableWithData recordDataArray={recordDataarray} schema={schema} setShowPanelData={setShowPanelData} />}
      <div className="overlayout-table-data absolute w-0 h-[100%] top-0 left-[100%] transition-all duration-100 bg-base-300 overflow-y-auto p-2 bord border-l border-accent flex flex-col">
        {showPanelData !== null && <TSidepanel showPanelData={showPanelData} setShowPanelData={setShowPanelData} />}
      </div>
    </>
  )
}
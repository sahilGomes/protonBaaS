import { useState } from "react";
import Searchbar from "../Searchbar";
import { Link } from "react-router-dom";

// left side compenent
export default function Collection({ dataArray, activeCollection, setActiveCollection }) {
  const [searchvalue, setSearchvalue] = useState("");
  if (searchvalue !== "") {
    const searchTerm = searchvalue.toLowerCase();
    // Use filter to get the matching names
    dataArray = dataArray.filter(name => name.toLowerCase().includes(searchTerm));
  }

  // function to hadle collection name link clicks i.e is to open side panel
  function handleClickOnCollection(event){
    const url = new URL(event.target.href);
    const params = new URLSearchParams(url.hash.slice(13));
    setActiveCollection(params.get("collectionId"));
  }

  // function to mapdata as link for collection name list
  function mapData(value, index) {
    return (
      <div className={`collectionholder ${value === activeCollection ? "active" : ""} w-[80%] mx-auto text-center hover:bg-base-300 rounded-md my-2 py-1`} key={index}>
        <Link to={`/collections?collectionId=${value}`} className="inline-block w-[100%] select-none" onClick={handleClickOnCollection}>{value}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[100%] relative h-[100%]">
      <Searchbar value={searchvalue} placeholder="🔍 Search collections" changeSearchvalue={setSearchvalue} inputWidth="80%" />
      <div className="flex flex-col overflow-y-auto max-h-[81%]">
        {dataArray.map(mapData)}
        {dataArray.length ? null : <div className="text-center w-[80%] mx-auto my-2">No collections available.</div>}
      </div>
      <button className="btn btn-active sticky bottom-0  w-[80%] mx-auto">➕ Add Collection</button>
    </div>
  )
}
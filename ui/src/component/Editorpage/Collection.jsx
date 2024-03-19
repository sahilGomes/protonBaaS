import { useState } from "react";
import Searchbar from "../Searchbar";
import { Link } from "react-router-dom";

// left side compenent
export default function Collection({ dataArray, activeCollection, setActiveCollection,setShowPanelData }) {
  const [searchvalue, setSearchvalue] = useState("");

  let collectionNameArray = dataArray.map((obj)=>obj.name);

  if (searchvalue !== "") {
    const searchTerm = searchvalue.toLowerCase();
    // Use filter to get the matching names
    collectionNameArray = collectionNameArray.filter(name => name.toLowerCase().includes(searchTerm));
  }

  // function to hadle collection name link clicks i.e is to open side panel
  function handleClickOnCollection(event){
    const url = new URL(event.target.href);
    const params = new URLSearchParams(url.hash.slice(13));
    setActiveCollection(params.get("collectionName"));
  }

  // function to mapdata as link for collection name list
  function mapData(value, index) {
    return (
      <div className={`collectionholder ${value === activeCollection ? "active" : ""} w-[80%] mx-auto text-center hover:bg-base-300 rounded-md my-2`} key={index}>
        <Link to={`/collections?collectionName=${value}`} className="inline-block w-[100%] select-none py-1" onClick={handleClickOnCollection}>{value}</Link>
      </div>
    );
  }

  // handle new collection show overlayout
  function handleNewCollection(e){
    setShowPanelData({action:"new",singleCollectionSchema:{}});
    let overlayout = document.getElementsByClassName("overlayout-collection")[0];
    overlayout.classList.add("show");
  }

  return (
    <div className="flex flex-col w-[100%] relative h-[100%]">
      <Searchbar value={searchvalue} placeholder="🔍 Search collections" changeSearchvalue={setSearchvalue} inputWidth="80%" />
      <div className="flex flex-col overflow-y-auto max-h-[81%]">
        {collectionNameArray.map(mapData)}
        {collectionNameArray.length ? null : <div className="text-center w-[80%] mx-auto my-2">No collections available.</div>}
      </div>
      <button className="btn btn-active sticky bottom-0  w-[80%] mx-auto" onClick={handleNewCollection}>➕ Add Collection</button>
    </div>
  )
}
import { useState } from "react";
import Searchbar from "../Searchbar";
import { NavLink } from "react-router-dom";

export default function Collection({ dataArray }) {
  const [searchvalue, setSearchvalue] = useState("");
  if (searchvalue !== "") {
    const searchTerm = searchvalue.toLowerCase();
    // Use filter to get the matching names
    dataArray = dataArray.filter(name => name.toLowerCase().includes(searchTerm));
  }

  return (
    <div className="flex flex-col w-[100%] relative h-[100%]">
      <Searchbar value={searchvalue} placeholder="🔍 Search collections" changeSearchvalue={setSearchvalue} inputWidth="80%" />
      <div className="flex flex-col overflow-y-auto max-h-[81%]">
        {dataArray.map((value, index) => <div className="collectionholder w-[80%] mx-auto text-center hover:bg-base-300 rounded-md my-2 py-1" key={index}><NavLink to={value}>{value}</NavLink></div>)}
        {dataArray.length?null:<div className="text-center">No such collections</div>}
      </div>
      <button className="btn btn-active sticky bottom-0  w-[80%] mx-auto">➕ Add Collection</button>
    </div>
  )
}
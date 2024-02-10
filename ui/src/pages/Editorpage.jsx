import { useEffect, useState } from "react";
import useSetNav from "../customHooks/useSetNav";
import Collection from "../component/Editorpage/Collection";
import Documentstable from "../component/Editorpage/Documentstable";

export default function Editorpage() {
    useSetNav();
    const [collectionDataArray,setCollectionDataArray] = useState([]);
    useEffect(()=>{
        console.log("called fetch request");
    },[]);  


    return (
        <div className="flex w-[100%] overflow-auto">
            <div className="sidepanel w-[20%] min-w-[270px] relative border-r-[1px]">
                <Collection dataArray={['users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport','users','message','posts','messgereport']}/>
            </div>
            <div className="document-table w-[80%] min-w-[500px]">
                <Documentstable />
            </div>
        </div>
    );
}

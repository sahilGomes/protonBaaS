import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import useSetNav from "../customHooks/useSetNav";
import Collection from "../component/Editorpage/Collection";
import Documentstable from "../component/Editorpage/Documentstable";
import CSidepanle from "../component/Editorpage/CSidepanle";

export default function Editorpage() {
    useSetNav();  //to set rootlayout state
    const { setPopmessage } = useOutletContext();
    const [collectionDataArray, setCollectionDataArray] = useState([]);  // collectiondata from fetch
    const [activeCollection, setActiveCollection] = useState(undefined); //togetActive collection
    const [showPanelData, setShowPanelData] = useState(null);  //to show overlayout for collection setting/new
    const [loadingState, setLoading] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            const signal = abortController.signal;

            try {
                const response = await fetch(`${location.protocol}//${location.hostname}:8080/api/collections/`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": JSON.parse(localStorage.getItem("admin_auth")).token
                        }
                    },
                );
                const result = await response.json();
                // Check if the component is still mounted before updating state
                if (!signal.aborted) {
                    setCollectionDataArray(result["items"]);
                    // setActiveCollection(result["items"][0].name);
                    result["items"].length === 0 ? setActiveCollection(undefined) : setActiveCollection(result["items"][0].name);
                    setLoading(false);
                }
            } catch (error) {
                // Handle error
                setPopmessage(`Error fetching data at collection message:,${error.message}`)
                //   setLoading(false);
            }
        };

        fetchData();

        // Cleanup function to abort fetch when component unmounts
        return () => {
            abortController.abort();
        };
    }, []);
    // 
    if (loadingState) return <h1 className="loading-collection">Loading...</h1>
    return (
        <>
            <div className="flex w-[100%]  overflow-x-auto">
                <div className="sidepanel w-[20%] min-w-[270px] relative border-r-[1px]">
                    <Collection dataArray={collectionDataArray} activeCollection={activeCollection} setActiveCollection={setActiveCollection} setShowPanelData={setShowPanelData} />
                </div>
                <div className="document-table w-[80%] min-w-[500px] p-4 relative overflow-x-hidden">
                    {activeCollection && <Documentstable activeCollection={activeCollection} collectionData={collectionDataArray} setParentShowPanelData={setShowPanelData} />}
                </div>
            </div>
            <div className="overlayout-collection absolute right-[-1px] w-0 h-[100%] transition-all duration-100 bg-base-300 overflow-hidden bord border-l border-accent">
                {showPanelData !== null && <CSidepanle showPanelData={showPanelData} setShowPanelData={setShowPanelData} />}
            </div>
        </>
    );
}
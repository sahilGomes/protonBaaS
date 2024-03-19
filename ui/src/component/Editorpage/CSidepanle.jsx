import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";


// look at json stringify at save
export default function CSidepanle({ showPanelData, setShowPanelData }) {
    const { setPopmessage } = useOutletContext();
    const [collectionSchema, setCollectionSchema] = useState(showPanelData.singleCollectionSchema);
    const [collectionName, setCollectionName] = useState({ "name": showPanelData.activeCollection });
    const [schemaString, setSchemaString] = useState(JSON.stringify(showPanelData.singleCollectionSchema.schema));
    const [ruleString, setRuleString] = useState(JSON.stringify(showPanelData.singleCollectionSchema.rules));
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if (showPanelData.action === "edit") {
            let arraySchema = JSON.parse(schemaString);
            setSchemaString(JSON.stringify(arraySchema.map(obj=>{
                delete obj._id;
                return obj;
            })));
        }
    },[]);

    function handleCancelButton(e) {
        setShowPanelData(null);
        let overlayout = document.getElementsByClassName("overlayout-collection")[0];
        overlayout.classList.remove("show");
    }

    function handleonChangeName(e) {
        let key = e.target.name;
        let value = e.target.value;
        setCollectionName({ [key]: value });
    }

    function handleonChangeCollectionSchema(e) {
        setSchemaString(e.target.value);
    }

    function handleonChangeRules(e) {
        setRuleString(e.target.value);
    }

    function handleSave(e) {
        setLoading(true);
        try {
            // Parse the JSON string to obtain the object
            let extractedSchemaObject = JSON.parse(schemaString);
            let extractedRuleObject = JSON.parse(ruleString);
            let datatoSend = { ...collectionName, schema: extractedSchemaObject, rules: extractedRuleObject }
            const abortController = new AbortController();
            const fetchData = async () => {
                const signal = abortController.signal;

                try {
                    let url_point = showPanelData.action === "new" ? "/api/collections" : `/api/collections/${showPanelData.singleCollectionSchema._id}`;
                    let fetchMethod = showPanelData.action === "new" ? "POST" : "PUT";
                    const response = await fetch(`${location.protocol}//${location.hostname}:8080${url_point}`,
                        {
                            method: fetchMethod,
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": JSON.parse(localStorage.getItem("admin_auth")).token
                            },
                            body: JSON.stringify(datatoSend)
                        },
                    );
                    // Check if the component is still mounted before updating state
                    if (!signal.aborted) {
                        if (response.status === 200) {
                            setLoading(false);
                            setShowPanelData(null);
                            setPopmessage(showPanelData.action === "new"?"Created new Collection.REFRESH":"Updated.REFRESH")
                            let overlayout = document.getElementsByClassName("overlayout-collection")[0];
                            overlayout.classList.remove("show");
                        }
                        else {
                            setLoading(false);
                            setPopmessage("Collection might already exists");
                        }
                    }
                } catch (error) {
                    // Handle error
                    setPopmessage(`Error fetching data at collection message:,${error.message}`)
                    setLoading(false);
                }
            };

            fetchData()
        } catch (error) {
            setPopmessage(error.message);
            setLoading(false);
        }
    }

    return (
        <>
            <div className="p-2  flex flex-col h-[100%]">
                <div className="nav-header flex justify-between h-[5%]">
                    <div>{showPanelData.action === "new" ? "New" : "Edit"} Collection</div>
                    <div onClick={(e) => {
                        setShowPanelData(null);
                        let overlayout = document.getElementsByClassName("overlayout-collection")[0];
                        overlayout.classList.remove("show");
                    }} className="cursor-pointer bg-primary p-1 text-primary-content select-none">close</div>
                </div>
                <div className="form-option flex flex-col h-[85%] overflow-y-auto">
                    <div>
                        <label className="form-control w-full">
                            <div className="label">
                                <span className="label-text">Name*</span>
                            </div>
                            <input type="text" placeholder="e.g:- Posts" className="collection-name input input-bordered w-full" required value={showPanelData.action !== "new" ? collectionName.name : undefined} name="name" onChange={handleonChangeName} />
                        </label>
                    </div>
                    <div>
                        <div>Fields</div>
                        <textarea name="collection-schema" className=" textarea textarea-bordered w-[100%]" id="" cols="50" rows="5" placeholder="put schema e.g:-[{'name':'posts','type':'string'},{'name':'messages','type':'string'}]" onChange={handleonChangeCollectionSchema} required value={showPanelData.action !== "new" ? schemaString : undefined}></textarea>

                    </div>
                    <div>
                        <div>Api rules</div>
                        <textarea name="collection-schema" className="textarea textarea-bordered w-[100%]" id="" cols="50" rows="5" placeholder='put rules e.g:-{"list rule":"","view rule":"","update rule":"","delete rule":"","create rule":""}' onChange={handleonChangeRules} value={showPanelData.action !== "new" ? ruleString : undefined}></textarea>
                    </div>
                </div>
                <div className="base h-[10%] flex justify-end gap-4 items-center">
                    <button className="btn btn-neutral" onClick={handleCancelButton}>cancel</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading ? true : false}>{loading ? "Saving" : "Save"}</button>
                </div>
            </div>
        </>
    )
}
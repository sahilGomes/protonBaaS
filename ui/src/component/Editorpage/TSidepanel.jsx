import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function TSidepanel({ showPanelData, setShowPanelData }) {
    const { setPopmessage } = useOutletContext();
    const [newRecordData, setNewRecordData] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const abortController = new AbortController();

    useEffect(() => {
        if (showPanelData.action === 'edit') {
            let recordDataToSet = { ...showPanelData.recordData };
            ["_id", "__v", "createdAt", "updatedAt", "userId"].forEach((values) => delete recordDataToSet[values]);
            setNewRecordData(JSON.stringify(recordDataToSet));
        }
    }, []);

    function handleCancelButton(e) {
        abortController.abort();
        setShowPanelData(null);
        let overlayout = document.getElementsByClassName("overlayout-table-data")[0];
        overlayout.classList.add("left-[100%]");
        overlayout.classList.remove("show");
    }

    async function fetchData(abortController) {
        const signal = abortController.signal;
        setLoading(true);
        try {
            if (newRecordData === undefined) throw new Error("Record data empty");
            let recordId = showPanelData.action === "new" ? "" : showPanelData.recordData._id;
            let method = showPanelData.action === "new" ? "POST" : "PUT";
            const response = await fetch(`${location.protocol}//${location.hostname}:8080/api/collections/${showPanelData.schema._id}/records/${recordId}`,
                {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": JSON.parse(localStorage.getItem("admin_auth")).token
                    },
                    body: newRecordData,
                    signal: signal
                }
            );
            // Check if the component is still mounted before updating state
            if (!signal.aborted) {
                if (response.status === 200) {
                    setPopmessage(showPanelData.action === "new"?"Added new data":"Updated data");
                    setLoading(false);
                    handleCancelButton(null);
                }
                else {
                    setPopmessage("Something went wrong");
                    setLoading(false);
                }
            }
        } catch (error) {
            if (error.name === "AbortError") return;
            // Handle error
            setPopmessage(`Status:${error.message}`)
            setLoading(false);
        }
    };

    function handleSave(e) {
        fetchData(abortController);
    }

    function handleRecordDataChange(e) {
        setNewRecordData(e.target.value);
    }

    return (
        <>
            <div className="flex justify-between font-sans text-neutral-content h-[5%]">
                <div>{showPanelData.action === 'new' ? "New" : "Edit"} <span className="font-black">{showPanelData.schema.name} </span> records</div>
                <div onClick={(e) => {
                    let overlayout = document.getElementsByClassName("overlayout-table-data")[0];
                    overlayout.classList.add("left-[100%]");
                    overlayout.classList.remove("show");
                    setShowPanelData(null);
                }} className="cursor-pointer bg-primary p-1 text-primary-content select-none">close</div>
            </div>
            <div className="record-data-conatiner h-[85%] overflow-y-auto">
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">ID</span>
                        </div>
                        <input type="text" className="record-id input input-bordered w-full" required value={showPanelData.action === "new" ? "It's auto generated..." : showPanelData.recordId} name="id" disabled />
                    </label>
                </div>
                <div>
                    <div>Record data</div>
                    <textarea name="record-data" className=" textarea textarea-bordered w-full" id="" cols="50" rows="10" required value={newRecordData} onChange={handleRecordDataChange} />
                </div>
            </div>
            <div className="base h-[10%] flex justify-end gap-4 items-center">
                <button className="btn btn-neutral" onClick={handleCancelButton} disabled={loading ? true : false}>cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading ? true : false}>{loading ? "Saving.." : "Save"}</button>
            </div>
        </>
    )
}
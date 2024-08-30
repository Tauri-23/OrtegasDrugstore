import { useEffect, useState } from "react";

export default function GuestAbout() {
    const [count, setCount] = useState(0);
    const [name, setName] = useState(null);
    const [isSaveBtnDisabled, setSaveBtnDisabled] = useState(true);

    useEffect(() => {
        if(name === null || name === '') {
            setSaveBtnDisabled(true);
        } else {
            setSaveBtnDisabled(false);
        }
    }, [name]);

    // const handleCountAdd = () => {
    //     setCount(count + 1);
    // }

    // const handleCountDeduct = () => {
    //     setCount(count -1);
    // }

    const handleNameInput = (event) => {
        setName(event.target.value);
    }

    return(
        <>
            Guset About<br/>
            {/* {count}<br/>
            <button onClick={handleCountAdd}>Add Count</button>
            <button onClick={handleCountDeduct}>Decrement Count</button> */}
            <input type="text" onInput={handleNameInput}/>
            <button disabled={isSaveBtnDisabled}>Save</button>
        </>
    );
}
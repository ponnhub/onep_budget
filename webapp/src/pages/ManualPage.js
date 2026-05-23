import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function ManualPage() {

    const  { state } = useLocation()

    if (!state) return (<>มีให้อ่านเล่มเดียว</>)

    const { profile } = state
    console.log('profile', profile);

    return <>เอาไปอ่านเลย 2 เล่ม</>

}


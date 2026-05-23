import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function GroupPage(props) {

    console.log('====================================');
    console.log('props', props);
    console.log('====================================');
    const { group } = props

    // console.log('====================================');
    // console.log('calling at ', Date.now());
    // console.log('====================================');

    // const { state } = useLocation()

    // console.log('====================================');
    // console.log(state && Object.keys(state));
    // console.log('====================================');

    // const content = useMemo(() => {
    //     if (group) {        
    //         // const { group } = state

    //         console.log('====================================');
    //         console.log('group', group);
    //         console.log('====================================');

    //         return (<>กลุ่มและรายละเอียดกลุ่ม <Link to={'/dashboard/user'}>ok</Link> </>)
    //     }
    //     return <>nothing yet</>

    // }, [group])
    
    // console.log('====================================');
    // console.log('group', group);
    // console.log('====================================');


    if (!group) return <>no group</>
    // const { group } = state

    // console.log('====================================');
    // console.log('group', group);
    // console.log('====================================');

    return <>{JSON.stringify(group)}</>
}
// Import the functions you need from the SDKs you need
import { faker } from "@faker-js/faker";
import {
    initializeApp
} from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    getFirestore,
    connectFirestoreEmulator,
    collection,
    getDoc,
    getDocs,
    deleteDoc,
    deleteField,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    query,
    where,
    orderBy,
    limit,
    getCountFromServer,
    serverTimestamp,
    startAfter,
    startAt,
} from "firebase/firestore";
import { DateTime } from "luxon";
import { MaxPageEvents } from "../App";

const isLocalhost = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.0/8 are considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) ||
window.location.hostname.includes('ngrok'));


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCMhIxm226qSST_AaHuzR8rjARZQklyfS4",
    authDomain: "onep-9f0ce.firebaseapp.com",
    databaseURL: "https://onep-9f0ce-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "onep-9f0ce",
    storageBucket: "onep-9f0ce.appspot.com",
    messagingSenderId: "875024315045",
    appId: "1:875024315045:web:e4cd8dd58c26f51616134c",
    measurementId: "G-MFJYSTBCE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

if (isLocalhost) {
    console.log('====================================');
    console.log('🔥 Firebase running on localhost');
    console.log('====================================');
    connectFirestoreEmulator(db, "localhost", 8080); //
}

class HTTPService {

    async getGroups () {
        this.data = ""
        const q = query(collection(db, "groups"));
        const results = []
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            
            results.push(doc.data())
        });
        return results

    }

    async updateGroup(params) {

        this.result = ""
        const { groupId, updates } = params

        const groupRef = doc(db, "groups", groupId);

        // Set the "capital" field of the city 'DC'
        await updateDoc(groupRef, updates)
        .then( _ => {
            console.log('ok');
        });

    }

    async getGroupIdOf (params) {
        const { userId } = params
        const userRef = doc(db, "users", userId)
        this.groupId = faker.datatype.uuid()
        return this.groupId
    }

    async addActivity(params) {
        // console.log('params', params);
        const { id, profile } = params
        this.simpleData = ""
        try {
            if (id) {
                updateDoc(doc(db, "events", id), {
                    ...params,
                    updated: serverTimestamp()
                })
                    .then(_ => {
                        // console.log("Updated Document with ID: ", docRef.id);
                    })

            
                return params.id
            }

            const docRef = doc(collection(db, "events"))

            await setDoc(docRef, {
                    ...params,
                    created: serverTimestamp(),
                    updated: serverTimestamp()
                }, {
                    merge: true
                }).then(async _ => {
                // const userEventsRef = doc(db, "userEvents", profile.userId,  docRef.id)
                const {
                    basicInfo,
                    ...others
                } = params

                const eventParams = {
                    basicInfo
                }

                await updateDoc(doc(db, "userEvents", profile.userId), {
                        [docRef.id]: eventParams
                    })
                    .catch(e => {
                        console.log(e);
                        setDoc(doc(db, "userEvents", profile.userId), {
                            [docRef.id]: eventParams
                        }, {
                            merge: true
                        })
                    })

                return docRef.id
            });

            // console.log("Document written with ID: ", docRef.id);
            
        } catch (e) {
            console.error("Error adding document: ", e);
        }    
        return undefined
        }

    async readActivity (params) {
        this.activity = ""

        const { profile , lastActivity} = params
        
        if (!profile) return []

        console.log('lastActivity', lastActivity);
        const q = query(collection(db, "events"), where("profile.userId", "==", profile.userId), orderBy('updated', 'desc'), startAfter(lastActivity), limit(MaxPageEvents));

        // startAfter(lastActivity || DateTime.fromMillis(0).toJSDate()) , 

        const results = []

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", results.push(doc.data()));
            console.log(doc.data().updated);
            results.push({
                id: doc.id,
                ...doc.data()
            })
        });

        // const querySnapshot = await getDocs(collection(db, "activities"));
        // querySnapshot.forEach((doc) => {
        //     console.log(`${doc.id} => ${doc.data()}`);
        // });

        return results
    }

    async readEvent (params) {
        this.event = ""

        const { eventId } = params
        if (!eventId) return []
        
        const event = await getDoc(doc(db, "events", eventId));
        
        if (event.exists) return event.data()
        return {}
    }



    async deleteEvent( params ) {
        this.event = ""
        const { userId, eventId } = params
        if (!eventId) return []
        
        await deleteDoc(doc(db, "events", eventId));
        await updateDoc(doc(db, "userEvents", userId), {
            [eventId]: deleteField()
        })

        
        // if (deletedEvent.exists) return deletedEvent.data()
        return {}
    }

    async readUserProfile(params) {
        this.events = ""
        const { userId } = params
        
        const profile = await getDoc(doc(db, "users", userId));
        
        if (profile.exists) return profile.data()
        return {}
        
    }


    async readUserStatus(params) {
        this.events = ""
        const { userId } = params
        
        const profile = await getDoc(doc(db, "users", userId));
        
        if (profile.exists && profile.data()) {
            console.log('profile.data()', profile.data());
            const { approved } = profile.data()
            return approved
        }
        return false
        
    }

    async readGroupInfo(params) {
        this.info = ""
        const { groupId } = params
        if (!groupId) return {}

        const groupInfo = await getDoc(doc(db, "groups", groupId));

        if (groupInfo.exists) {


            // console.log('====================================');
            // console.log(groupId === "C6766f8fa9ea006a988e7e9f0dc056fc2");
            // console.log('====================================');
            const q = query(collection(db, "groups", groupId, "users"),);

            const usersCount = await getCountFromServer(q);
            // console.log('====================================');
            // console.log(usersCount.data().count);
            // console.log('====================================');
            return ({...groupInfo.data(), usersCount: usersCount.data().count})
        }
        return {}
        
    }

    async updateUserProfile(params) {

        this.data = ""

        const { userId } = params

        const userRef = doc(collection(db, "users"), userId)
        await updateDoc(userRef, params)
        .then(_ =>   true)
        .catch(e => {
            console.log(e);
            setDoc(userRef,  params, { merge: true })
            .then(_ =>  true)
        })
    }

    async readUserEvents(params) {
        this.events = ""
        const { userId } = params
        
        const q = query(collection(db, "events"), where("profile.userId", "==", userId));

        const results = []

        const eventsCount = await getCountFromServer(q);
        return eventsCount.data()
    }


    async generateDownloadRequestId(params) {
        // console.log('params', params);
        // const { eventId } = params
        this.simpleData = ""
        try {
            
            const docRef = doc(collection(db, "downloadrequests"))

            await setDoc(docRef, {
                        ...params,
                        created: serverTimestamp()                        
                    }, {
                    merge: true
                })
                            

            console.log("Document written with ID: ", docRef.id);
            return docRef.id
            
        } catch (e) {
            console.error("Error adding download request: ", e);
        }    
        return undefined
    }

    async saveDownloader(params) {
        this.timestamp = serverTimestamp()
        
        const { downloadId, userId, displayName, pictureUrl } = params
        const eventParams = {
            userId,
            displayName,
            pictureUrl,
            timestamp: this.timestamp
        }
        const downloadRef = doc(collection(db, "downloadrequests", downloadId, 'downloader'), userId)

        await updateDoc(downloadRef, eventParams)
        .catch(e => {
            console.log(e);
            setDoc(downloadRef, eventParams, {
                merge: true
            })
        })
        return this.timestamp
    }


    async getFileEvent(params) {

        this.fileUrl = ""

        const { id } = params
        
        const downloadrequest = await getDoc(doc(db, "downloadrequests", id));
        
        
        if (downloadrequest.exists) {
            const { eventId } = downloadrequest.data()
            return this.readEvent({ eventId})
            
        }
        return undefined
        
    }

}
export default HTTPService
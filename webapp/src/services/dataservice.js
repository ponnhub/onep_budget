// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";


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

const functions = getFunctions(app);
if (window.location.hostname.includes('localhost')) {
    console.log('running on localhost');
    connectFunctionsEmulator(functions, "localhost", 5001); // 
}
const initialGroup = httpsCallable(functions, 'api/initialgroup', );
const getfilecontent = httpsCallable(functions, 'api/getfilecontent', );
const getpersonqueryname = httpsCallable(functions, 'api/getpersonqueryname', );
const getplanqueryname = httpsCallable(functions, 'api/getplanqueryname', );
// const monitorUserActivites = httpsCallable(functions, 'api/monitorUserActivites', );

  class DataService {
    
    initialGroup(groupId) {
        this.data = ""
        initialGroup({groupId}).then(_ => {
            console.log('done');
        })
    }

    getFileContent() {
      this.content = ""
      return new Promise((resolve, reject) => {        
        getfilecontent().then(buffer => {
          console.log('buffer.length', buffer.data);
          resolve(buffer.data)
        })
      })  
    }

    getPersonWithNameQuery(params) {
      this.person = {}
      return new Promise((resolve, reject) => {        
        getpersonqueryname(params).then(person => {
          console.log('person', person.data);
          resolve(person.data)
        })
      }) 


    }

    getPlanWithNameQuery(text) {
      this.plan = {}
      return new Promise((resolve, reject) => {        
        getplanqueryname({text}).then(plan => {
          console.log('plan', plan.data);
          resolve(plan.data)
        })
      }) 


    }

}
export default DataService
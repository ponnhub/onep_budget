const axios = require('axios');
const functions = require("firebase-functions");
const  {createReport, listCommands, getMetadata} = require('docx-templates');
const fs = require('fs');
const stringSimilarity = require("string-similarity");

const {
    WebhookClient
} = require('dialogflow-fulfillment');
// const dialogflow = require('@google-cloud/dialogflow');
const {
    v4: uuidv4
} = require('uuid');
// Instantiates a intent client
// const {
//     IntentsClient
// } = newFunction();

// Instantiates a session client
// const sessionClient = new dialogflow.SessionsClient();

const {
    KEY, ONEPNotifyTokens, LIFF_URI
} = require("./constants");
const {
    FB_PATH,
    end,
    dialogflowId
} = require("./data/config");

//line bot sdk
const line = require('@line/bot-sdk');
// create LINE SDK config from env variables
const config = {
    channelAccessToken: "gZZez+fkSmHtRzbPPGBwFD4dnCXKOV/E4l/NHnjuXtzF4tqusyC5HXBtDo/vrCBKF3zkC3PxrnqR63HVy1fZYvtJzdz55Zd5T+jigWy2REfLXTdp1gwK6bslrN7HxixnNlKGd6XsFvYISBUhFCNlFwdB04t89/1O/w1cDnyilFU=", //process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: "c301a8852c0487ebb83e4b14fdeb8888" //process.env.CHANNEL_SECRET,
};

// console.log(process.env);
// create LINE SDK client
const client = new line.Client(config);

//line notify
const notifySystemAdmin = require('line-notify-nodejs')(ONEPNotifyTokens.assiatant);

const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const saCredentials = require('./onep-9f0ce-firebase-adminsdk-cwi1g-229f74491a.json')
const express = require('express');
const cors = require('cors');
const os = require('os');
const luxon = require("luxon")
luxon.Settings.defaultLocale = 'th';
luxon.Settings.defaultOutputCalendar = 'buddhist';

//firebase project setting
const PROJECT_ID = saCredentials.project_id
const {
    chip,
    quickReply,
    postback,
    openUri
} = require("./payloads/payloads");
const Payload = require("./payloads/payloads");
// const Questions = require("./model/questions");
const { object } = require('firebase-functions/v1/storage');
const Flex = require('./payloads/flex');
const { Blob } = require('buffer');
const { join } = require('path');
const path = require('path');
const firebaseLocal = os.hostname() != 'localhost'; // it's localhost on Firebase
console.log(`probably recheck if os.hostname() != 'localhost' (${os.hostname()}) and webhook URL https://fe48-2001-fb1-5d-6f8f-3d7d-7d30-6d7c-ebb6.ap.ngrok.io/onep-9f0ce/us-central1/api/webhook or https://us-central1-research-thai-rtaf.cloudfunctions.net/api/fulfullments`);
if (firebaseLocal) {
    const adminServiceAccountPrivatekey = saCredentials.private_key;
    const adminServiceAccountClientEmail = saCredentials.client_email;

    //local
    admin.initializeApp({
        databaseURL: `http://localhost:9000/?ns=${PROJECT_ID}-default-rtdb`, //http://localhost:9000/?ns=tamniyombot65-eafd4-default-rtdb
        credential: admin.credential.cert({
            projectId: PROJECT_ID,
            clientEmail: adminServiceAccountClientEmail,
            privateKey: adminServiceAccountPrivatekey
        })
    });
    // // END
} else {
    //server
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://onep-9f0ce-default-rtdb.asia-southeast1.firebasedatabase.app`
    });
    //END
}

const ROOT_REF = admin.database().ref('line-bot');
const FIRESTORE = admin.firestore()
// researchuser
//nibceg-0pebxi-roDjug


// tools
function flattenObject(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}


const app = express();
app.use(cors({
    origin: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// app.use('/static', express.static(path.join(__dirname, 'docx')))


app.all('/', (req, res, next) => {
    console.log('checking auth');
    next()
})

let postToDialogflow;

app.post('/webhook', async (req, res) => {

    // postToDialogflow = () => {
    //     req.headers.host = "bots.dialogflow.com";
    //     let url = `https://bots.dialogflow.com/line/${dialogflowId}/webhook`;
    //     return axios.post(url, JSON.stringify(req.body), {
    //         headers: req.headers
    //     });
    // };

    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));



})

app.post('/upsertProfile', (req, res) => {
    let {
        profile
    } = req.body.data
    console.log(profile);
    register(profile).then(success => {
        if (success) res.send({
            data: 'ok'
        })
    })
})

app.post('/getpersonqueryname',  async (req, res) => {

    let {
        text,
        unitName,
        userId
    } = req.body.data

    console.log(text, unitName, userId);

    let personnel = require('./data/personnel.json')
    if (unitName) {
        const groups = [...new Set(personnel.filter(p => p.group !== undefined).map(p => p.group))]

        // console.log(groups);

        const groupMatches = stringSimilarity.findBestMatch(unitName, groups);

        // console.log("groupMatches", groupMatches);
        const foundGroupIndex = groups.findIndex(g => g === groupMatches.bestMatch.target)
        console.log("found group", groups[foundGroupIndex]);
        // console.log('====================================');
        // console.log(stringSimilarity.compareTwoStrings(groups[foundGroupIndex].unitName, personnel[foundIndex].unitName));
        // console.log('====================================');


        if (foundGroupIndex && groups[foundGroupIndex]) personnel = personnel.filter(p => {
            // console.log(p.group);

            return (p.group === groups[foundGroupIndex])
        })
        console.log(personnel);

    }


    const matches = stringSimilarity.findBestMatch(text, personnel.map(p => p.fullname));

    // console.log("matches", matches);
    const foundIndex = personnel.findIndex(p => p.fullname === matches.bestMatch.target)
    console.log("found", personnel[foundIndex]);

    const { internalOrder } = personnel[foundIndex]
    const userRef = FIRESTORE.collection('users')
    const userDoc = await userRef.where('internalOrder', '==', internalOrder).get();       
    // console.log('userDoc', userDoc);
    if ((!userDoc.empty)) {
        console.log('user taken!');

        const users =[]
        
        userDoc.forEach(doc => {
            users.push(doc.data())
        });        

        // userDoc.forEach(doc => {
        //     console.log(doc.id, '=>', doc.data());
        //   });
          
        return res.status(200).send({
            data: {
                personnel: personnel[foundIndex],
                claimed: true,
                self: users.find(u => u.userId === userId)
            }
        })

    }

    res.status(200).send({
        data: personnel[foundIndex]
    })


})

app.post('/getplanqueryname',  async (req, res) => {

    let {
        text
    } = req.body.data

    console.log(text);

    const budgetplans = require('./data/budget66.json')

    const paths = flattenObject(budgetplans)
    const pathvalues = Object.values(paths)

    const matches = stringSimilarity.findBestMatch(text, pathvalues);

    console.log("matches", matches);
    const foundIndex = pathvalues.findIndex(p => p === matches.bestMatch.target)
    console.log("found", pathvalues[foundIndex]);

    res.status(200).send({
        data: {
            path: Object.keys(paths)[foundIndex],
            planresolved: (() => {

                const initKeysPath = []
                const keys = Object.keys(paths)[foundIndex].split(".")
                let result = {}
                while (keys.length) {
                    const collection = keys.shift()                    
                    const doc = keys.shift()
                    initKeysPath.push(collection)
                    initKeysPath.push(doc)

                    const value = paths[[...initKeysPath, 'name'].join(".")] || paths[initKeysPath.join(".")]
                    if (value) result[collection] = value
                }
                return result
            })(),
            budgetplancodes: (() => {

                const initKeysPath = []
                console.log('Object.keys(paths)[foundIndex]', Object.keys(paths)[foundIndex]);
                const keys = Object.keys(paths)[foundIndex].split(".")
                do
                 {
                    const _ = keys.shift()               
                    const doc = keys.shift() 
                    console.log(keys);    
                    console.log(doc);
                    
                    if (doc) initKeysPath.push(doc)

                } while (keys.length)
                return initKeysPath.join("/")
            })(),
            value: pathvalues[foundIndex]
        }
    })


})
    
app.post('/getfilecontent',  async (req, res) => {
    
    const template = fs.readFileSync('doctemplates/oneptemplate.docx');


    const commands = await listCommands(template, ['{', '}']);
    console.log('commands', commands);

    getMetadata(template)
    .then(data => console.log('data', data))


    console.log('template',template);
    const buffer = await createReport({
        template,
        data: {
            groupName: 'OK',
            title: 'ขออนุมัติ',
        },
    });

    // console.log('buffer', buffer);
    // console.log('buffer.length', buffer.length);

    // join(__dirname, 'dist', filename
    // const blob = new Blob([buffer]); // JavaScript Blob
    
    // console.log('blob', blob);


    // res.setHeader('Content-Length', buffer.length);
    // res.setHeader('Content-Type', "application/octet-stream");
    console.log('__dirname', __dirname);
    fs.writeFileSync(join(__dirname, 'docx', 'file.docx'), buffer)

    res.status(200).send({
        data: {
            url: join(__dirname, 'docx', 'file.docx')
        }
    })
})

app.post('/initialgroup', async (req, res) => {
    let {
        groupId
    } = req.body.data

    const groupRef = FIRESTORE.collection('groups').doc(groupId);
        const doc = await groupRef.get();
        if (!doc.exists) {
            console.log('No such group!');

            return res.status(200).end()

        } else {
            console.log('group data:', doc.data());
            const flex = new Flex()
            client.pushMessage(groupId, [flex.agentInitialMenu(doc.data()), flex.registerUser(doc.data())])
            return res.status(200).end()
        }
        
})

const messagePayload = (text) => {
    return {
        type: "text",
        text: text
    };
}

// function newFunction() {
//     return require('@google-cloud/dialogflow');
// }

async function handleEvent(event) {
    // if (event.type !== 'message' || event.message.type !== 'text') {
    //   return Promise.resolve(null);
    // }

    // notifySystemAdmin.notify({ message: JSON.stringify(event)})

    if ([KEY.FOLLOW, KEY.UNFOLLOW].includes(event.type)) {
        let userId = event.source.userId;
        const userRef = FIRESTORE.collection('users').doc(userId);
        userRef.set({
            [event.type]: Date.now(),
            following: event.type === KEY.FOLLOW
        }, { merge: true})

        // register({
        //     ...profile,
        //     [KEY.FOLLOW]: Date.now()
        // })

        if (event.type === KEY.UNFOLLOW) {
            const profile = await userRef.get()
            notifySystemAdmin.notify({ message: `${(profile.exists && profile.data().displayName) || userId} เพิ่ง ${event.type}`})
        } else {
            const profile = await client.getProfile(userId)
            notifySystemAdmin.notify({ message: `${profile.displayName} เพิ่ง ${event.type}`})     
        }

    }
    
    const isGroupEvent = event.source.type === KEY.GROUP;
    console.log(JSON.stringify(event.source));
    if (!isGroupEvent) return end

    let groupId = event.source.groupId;
    const groupRef = FIRESTORE.collection('groups').doc(groupId);
    let replyToken = event.replyToken

    if (event.type === KEY.JOIN) {

        if (event.source.type !== 'group') return end
        // register group for onep budget
        console.log('====================================');
        console.log('bot joined ', groupId);
        console.log('====================================');
        // Create a reference to the cities collection
        
        const doc = await groupRef.get();
        if (!doc.exists || (doc.exists && !doc.data().approved)) {
            console.log('No such group!');

            return client.getGroupSummary(groupId)
            .then( summary =>  {
                console.log('====================================');
                console.log(summary);
                console.log('====================================');
                const flex = new Flex()
                replySilentlyWith([flex.registeGroup(summary), quickReply('กดลงทะเบียนกลุ่มเพียงครั้งเดียว', [postback({text: 'ลงทะเบียนกลุ่ม', data: 'mode=registergroup'})])])

                // {
                //     type: 'button',
                //     action: {
                //       type: 'postback',
                //       label: 'ลงทะเบียนกลุ่ม',
                //       displayText: 'ลงทะเบียนกลุ่ม',
                //       data: 'mode=registergroup'
                //     },
                //     color: '#0194D9',
                //     style: 'primary'
                //   }

                notifySystemAdmin.notify({message : `bot joined ${summary.groupName}`})
                notifySystemAdmin.notify({message : groupId})
            })

        } else {
            console.log('group data:', doc.data());
        }
            
        return end

    }

    
    let userId = event.source.userId;
    let USER_REF = userId ? ROOT_REF.child('users').child(userId) : ""
    const userRef = FIRESTORE.collection('users').doc(userId);


    // if (event.type === KEY.UNFOLLOW) {

    //     let displayName = (await ROOT_REF.child(FB_PATH.users).child(userId).child('displayName').once('value')).val()
    //     register({
    //         displayName,
    //         userId,
    //         [KEY.UNFOLLOW]: Date.now()
    //     })
    //     return end
    // }

    // let profile = await client.getGroupMemberProfile(groupId, userId)
    // console.log('====================================');
    // console.log(profile);
    // console.log('====================================');
    // register(profile)


    switch (event.type) {
            //group
        case KEY.MEMBER_JOINED:
            break

        case KEY.MESSAGE:

        //TODO: distinguish group and 1-1 messages

        let { text } = event.message


            let awaitdirectresponse = (await USER_REF.child('awaitdirectresponse').once('value')).val()
            if (awaitdirectresponse) {

                //TODO: fulfill awaiting response with text

                //if fulfilled:
                USER_REF.child('awaitdirectresponse').set(null)
                //else


                return end
            } else {

                switch (text.trim().toLowerCase()) {
                    case 'menu':
                    case 'เมนู':
                        const flex = new Flex()
                        const doc = await groupRef.get();
                        if (!doc.exists || (doc.exists && !doc.data().approved)) {
                            return replyWith(messagePayload('กลุ่มนี้ยังไม่ได้รับสิทธิ์ใช้งาน โปรดติดต่อผู้ดูแลระบบ'))
                        } else {
                            // console.log('group data:', doc.data());
                            return replyWith([flex.registerUser(doc.data())])
                        }
            
                        
                        
                    // case 'a':
                    default:
                        //forward to dialogflow
                        // console.log('forwarding', text, 'to dialogflow');
                        // postToDialogflow(text)
                        return end

                        //return client.replyMessage(replyToken, quickReply('จะสามารถทำได้เร็วๆ นี้ครับ', [chip('เมนู')]))
                }
            }


        case KEY.POSTBACK:

            if (isGroupEvent) return handleGroupPostback(event.postback.data)

            let data = new URLSearchParams(event.postback.data)            
            let mode = data.get('mode')
            let params = {userId, ...Object.fromEntries(data)}

            USER_REF.child('lastaction').set(Object.fromEntries(data))
            USER_REF.child('intentactions').set(null)

            switch (mode) {
                case 'init':
                    return client.replyMessage(replyToken, await initEvent(params))
                case 'delete':
                    return client.replyMessage(replyToken, await deleteDraft(params))
                case 'restore':
                    return client.replyMessage(replyToken, await restoreEvent(params))
                case 'modify':
                    return client.replyMessage(replyToken, await modifyDraft(params))
                case 'load':
                    return client.replyMessage(replyToken, await loadEvent(params))
                default:
                    break;
            }
        default:
            USER_REF.child('lastaction').set(null)
            break;
    }

    return end


    //MARK:- INTERNAL FUNCTIONS

    async function handleGroupPostback() {
        
        let data = new URLSearchParams(event.postback.data)            
        let mode = data.get('mode')
        console.log(mode);

switch (mode) {
    case 'registergroup':
        
        const groupDoc = await groupRef.get();
        if (!groupDoc.exists || (groupDoc.exists && !groupDoc.data().approved) ) {
            console.log('No such group!');


            client.getGroupSummary(groupId)
            .then( summary =>  {


                FIRESTORE.collection('groups').doc(groupId).set({
                    ...summary,
                    approved: false
                })
                .then( _ => replyWith([messagePayload(`เรียบร้อยแล้ว โปรดรอข้อความยืนยันการลงทะเบียนกลุ่ม "${summary.groupName}" ครับ`)]));

                
            })
            return end

        } else {
            let groupSummary = groupDoc.data()
            if (groupSummary.approved) return replyWith(messagePayload('กลุ่มนี้ได้ส่งคำขอใช้งานแล้ว โปรดรอผู้ดูแลระบบอนุมัติครับ'))
            console.log('====================================');
            console.log('group approved');
            console.log('====================================');
            return end
        }
    case 'registeruser':
        
        const userDoc = await userRef.get();
        if (!userDoc.exists || (userDoc.exists && !userDoc.data().approved) ) {
            console.log('No such user!');


            return client.getGroupMemberProfile(groupId, userId)
            .then( async profile =>  {

                let profileWithGroupInfo = profile
                const groupDoc = await groupRef.get();
                if (groupDoc.exists) {
                    const { users, usersCount, ...others } = groupDoc.data()
                    profileWithGroupInfo = {
                        ...profileWithGroupInfo,
                        groupInfo: {
                            ...others
                        }
                    }
                }


                userRef.set({
                    ...profileWithGroupInfo,
                    approved: true
                }, { merge: true})
                .then(_ => {

                    
                    groupRef.update({
                        users: FieldValue.arrayUnion(userId)
                    });
                    replySilentlyWith([quickReply(`${profile.displayName} ได้รับอนุญาตให้ใช้งานเรียบร้อยแล้ว สามารถใช้งานด้วยการกดปุ่ม "เปิดโปรแกรม" ได้เลยครับ`, [openUri(LIFF_URI, 'เปิดโปรแกรม')]),
                ])
                });                
            })

        } else {
            let profile = userDoc.data()
            userRef.set({
                ...profile,
                groupId,
                approved: true
            }, { merge: true})
            if (profile.approved) return replySilentlyWith([quickReply(`${profile.displayName} ได้สมัครใช้งานไว้แล้วครับ สามารถใช้งานได้เลย`, [openUri(LIFF_URI, 'เปิดโปรแกรม')])])
            console.log('====================================');
            console.log('user approved');
            console.log('====================================');
            return end
        }

    default:
        break;
}
    }

    function replySilentlyWith(payload) {
        return new Promise((resolve, reject) => {
            client.replyMessage(event.replyToken, payload, true).then(resolve(true)).catch(e => {
                // console.log(e.originalError);
                // console.log(JSON.stringify(e.originalError))
                console.log('====================================');
                console.log(JSON.stringify(e.originalError.response.data.details));
                console.log('====================================');
                reject(e);
                // notifyDevGroup(agent.logNotifyToken, [e.originalError, e.data, JSON.stringify(e.data)].join('\n'));
            });
        });
    }

    function replyWith(payload) {
        return new Promise((resolve, reject) => {
            client.replyMessage(event.replyToken, payload, false).then(resolve(true)).catch(e => {
                // console.log(e.originalError);
                // console.log(JSON.stringify(e.originalError))
                console.log('====================================');
                console.log(JSON.stringify(e.originalError.response.data.details));
                console.log('====================================');
                reject(e);
                // notifyDevGroup(agent.logNotifyToken, [e.originalError, e.data, JSON.stringify(e.data)].join('\n'));
            });
        });
    }




}


//MARK:- GLOBAL FUNCTIONS


async function initEvent({
    userId,
    type
}) {
    const typedata = require('./data/data.json')[type]
    const USER_REF = ROOT_REF.child('users').child(userId)
    let deletedata = new URLSearchParams()
    deletedata.set('mode', 'delete')
    deletedata.set('type', type)

    let modifydata = new URLSearchParams(deletedata.entries())
    modifydata.set('mode', 'modify')

    let loaddata = new URLSearchParams(deletedata.entries())
    loaddata.set('mode', 'load')


    return new Promise(async (resolve) => {
        let eventdraft = (await ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).once('value')).val()
        if (eventdraft) {
            await USER_REF.child('intentactions').set({
                yes : Object.fromEntries(modifydata),
                no: Object.fromEntries(deletedata),
                modify : Object.fromEntries(modifydata)
            })
            resolve([quickReply('พบร่างในระบบ ต้องการแก้ไขต่อเลย หรือลบร่างเก่าครับ', [postback({
                    text: 'ลบ',
                    data: deletedata.toString()
                }), postback({
                    text: 'แก้ไข',
                    data: modifydata.toString()
                })])])
            // return client.replyMessage(replyToken, [quickReply('พบร่างในระบบ ต้องการแก้ไขต่อเลยไหมครับ', [postback({
            //     text: 'ลบ',
            //     data: deletedata.toString()
            // }), postback({
            //     text: 'แก้ไข',
            //     data: modifydata.toString()
            // })])])

        }

        ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).set(typedata)
            .then(_ => {
                //TODO:- แสดงภาพรวม และ qrp

                USER_REF.child('intentactions').set({
                    no: Object.fromEntries(deletedata),
                    modify : Object.fromEntries(modifydata),
                    load : Object.fromEntries(loaddata)
                })
                let payload = new Payload()
                resolve([
                    payload.event(), 
                    quickReply('ผมคำนวณค่าใช้จ่ายมาให้แล้วครับ หากมีแก้ไขให้กดที่ แก้ไขรายการ เพื่อแก้ไข หากถูกต้อง ให้กดบันทึกได้เลยครับ', [chip('แก้ไขรายการ'), chip('บันทึก'), chip('ดูภาพรวม'), postback({
                        text: 'ลบ',
                        data: deletedata.toString()
                    })])])

                // return client.replyMessage(replyToken, [quickReply('เรียบร้อยครับ', [chip('แก้ไขรายการ'), chip('ดูภาพรวม'), postback({text: 'ลบ', data: deletedata.toString()})])])
        })
    })


}

async function deleteDraft({
    userId,
    type
}) {


    const USER_REF = ROOT_REF.child('users').child(userId)
    let initdata = new URLSearchParams()
    initdata.set('mode', 'init')
    initdata.set('type', type)


    let restoredata = new URLSearchParams(initdata.entries())
    restoredata.set('mode', 'restore')

    return new Promise(async (resolve) => {

        let todelete = (await ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).once('value')).val()
        ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child('lastdeleted').child(type).set(todelete)

        ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).set(null)
        .then(_ => {
            // if (success)

            USER_REF.child('intentactions').set({
                init: Object.fromEntries(initdata),
                restore: Object.fromEntries(restoredata)
            })

            resolve([quickReply('ลบร่างเรียบร้อยครับ', [postback({
                text: 'สร้างใหม่',
                data: initdata.toString()
            }),postback({
                text: 'กู้คืน',                
                data: restoredata.toString()
            }), chip('ยกเลิก')])])
        })
    })

}

async function restoreEvent({
    userId,
    type
}) {

    const typedata = (await ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child('lastdeleted').child(type).once('value')).val()
    const USER_REF = ROOT_REF.child('users').child(userId)
    let deletedata = new URLSearchParams()
    deletedata.set('mode', 'delete')
    deletedata.set('type', type)

    let modifydata = new URLSearchParams(deletedata.entries())
    modifydata.set('mode', 'modify')

    let loaddata = new URLSearchParams(deletedata.entries())
    loaddata.set('mode', 'load')


    return new Promise(async (resolve) => {

        ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).set(typedata)
        .then(_ => {
            //TODO:- แสดงภาพรวม และ qrp

            USER_REF.child('intentactions').set({
                no: Object.fromEntries(deletedata),
                modify : Object.fromEntries(modifydata),
                load : Object.fromEntries(loaddata)
            })
            let payload = new Payload()
            resolve([
                payload.event(), 
                quickReply('กู้คืนเรียบร้อยครับ', [chip('แก้ไขรายการ'), chip('ดูภาพรวม'), postback({
                    text: 'ลบ',
                    data: deletedata.toString()
                })])])

            // return client.replyMessage(replyToken, [quickReply('เรียบร้อยครับ', [chip('แก้ไขรายการ'), chip('ดูภาพรวม'), postback({text: 'ลบ', data: deletedata.toString()})])])
        })
        
    })
    

}


async function modifyDraft({
    eventId,
    type
}) {
    let payload = new Payload()
    if (eventId) {
        
    } else if (type) {
        return payload.eventDetail()
    } else {
        return [{type: 'text', text: 'not found'}]
    }
    
    
    // ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).once('value')
    // .then(snapshot => {
    //     if (!snapshot.exists()) return end

    // })

}

async function saveEvent({
    userId,
    type
}) {

    return [{type: 'text', text: 'ok'}]
    ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).once('value')
    .then(snapshot => {
        if (!snapshot.exists()) return end

    })
}

async function loadEvent({
    userId,
    type,
    eventId
}) {


    let payload = new Payload()
    if (eventId) {        

        //load with eventId and set current viewing/editing id

    } else if (type) {
        return payload.event()
    } else {
        return [{type: 'text', text: 'not found'}]
    }
    
    
    ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).once('value')
    .then(snapshot => {
        if (!snapshot.exists()) return end

    })
}

async function removeEvent({
    userId,
    type
}) {

    return [{type: 'text', text: 'ok'}]
    ROOT_REF.child(FB_PATH.eventdrafts).child(userId).child(type).once('value')
    .then(snapshot => {
        if (!snapshot.exists()) return end

    })
}



async function register(profile) {

    console.log('====================================');
    console.log('registering');
    console.log('====================================');
    if (!profile) return end
    if (!profile[KEY.UNFOLLOW]) {
        let {
            displayName,
            pictureUrl
        } = profile
        ROOT_REF.child(FB_PATH.activities).child(profile.userId).update({
            displayName,
            pictureUrl: pictureUrl || ''
        })
    }

    return Promise.all([
        ROOT_REF.child(FB_PATH.users).child(profile.userId).update({
            ...profile,
            lastLoggedin: Date.now()
        }),
        ...['follow', 'unfollow', 'login', 'weblogin'].map(node => {
            if (profile[node]) {
                ROOT_REF.child(FB_PATH.activities).child(profile.userId).child(node).update({
                    [Date.now()]: true
                })

                let {
                    userId,
                    ...others
                } = profile
                ROOT_REF.child(FB_PATH.weblog).child(FB_PATH.activities).push().set({
                    ...others,
                    date: Date.now(),
                    type: node
                })
            }
        })
    ])


}

app.post('/fulfillment',  async (request, response) => {


  const agent = new WebhookClient({
    request,
    response
  });

//   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
//   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  let result = request.body.queryResult
  let intentDisplayName = result.intent.displayName.trim()
  let originalIntent = request.body.originalDetectIntentRequest
  let source =  originalIntent && originalIntent.payload.data.source //{"userId":"Udd7346edda5c29e7351071a982d3e1dd","type":"user"} //

//   if (!source) return response.send(end)

  let userId = source && source.userId
  let USER_REF = ROOT_REF.child('users').child(userId)
  let replyToken = originalIntent && originalIntent.payload.data.replyToken

  //Agent functions fulfillment
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  async function hello() {
    console.log('ok hello');
    return response.send(end)
  }

  async function cancel(agent) {
    console.log('cancelling');
    USER_REF.child('lastaction').set(null)
    USER_REF.child('intentactions').set(null)
    agent.add('ยกเลิกเรียบร้อยครับ' )
  }


  async function handleIntentAction(agent) {
    let intentSuffix = intentDisplayName.split(".").pop()
    console.log('handling Intent Action');
    let action = (await USER_REF.child('intentactions').child(intentSuffix).once('value')).val()
    if (action) {
        USER_REF.child('intentactions').child(intentSuffix).set(null)
        
        let { mode } = action
        let params = { userId, ...action}
        switch (mode) {
            case 'init':
                return initEvent(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            case 'delete':
                return deleteDraft(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            case 'modify':
                return modifyDraft(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            case 'save':
                 return saveEvent(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            case 'load':
                return loadEvent(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            case 'remove':
                return removeEvent(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            case 'restore':
                return restoreEvent(params).then(payloads => {
                    client.replyMessage(replyToken, payloads)
                    agent.add("")
                })
            default:
                agent.add("จะทำได้ในไม่ช้านี้ครับ")
                break;
        }

    }
    return agent.add('ไม่พบรายการที่ดำเนินการได้ครับ')
  }


  console.log('intentDisplayName', intentDisplayName);

    if ([
        'smalltalk.greetings.hello'
    ].includes(intentDisplayName)) return hello()


  let intentMap = new Map();


  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('smalltalk.confirmation.cancel', cancel);
  intentMap.set('smalltalk.confirmation.yes', handleIntentAction);
  intentMap.set('smalltalk.confirmation.no', handleIntentAction);
  intentMap.set('a_option.init', handleIntentAction);
  intentMap.set('a_option.load', handleIntentAction);
  intentMap.set('a_option.modify', handleIntentAction);
  intentMap.set('a_option.restore', handleIntentAction);

    agent.handleRequest(intentMap).then(_ => {
        USER_REF.child('lastRequest').set(Date.now())
    });

})

exports.api = functions.https.onRequest(app);
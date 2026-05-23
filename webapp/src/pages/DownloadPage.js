import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"

import { saveAs } from "file-saver";



import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Stack, Typography } from '@mui/material';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import SaveIcon from '@mui/icons-material/Save';
import MessageIcon from '@mui/icons-material/Message';

import PropTypes from 'prop-types';

// line liff
import liff from '@line/liff';

import { AppContext } from "../App";
import { isLocalhost } from "..";
import DocService from "../services/docservice";
import HTTPService from "../services/httpservice";

const dayjs = require('dayjs')
const buddhistEra = require('dayjs/plugin/buddhistEra')
const LocalizedFormat = require('dayjs/plugin/localizedFormat')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(LocalizedFormat)
dayjs.extend(buddhistEra)
dayjs.extend(relativeTime)
// import  template from '../doctemplates/oneptemplate.docx';

  // const liff = window.liff
  const liffId = process.env.REACT_APP_LIFF_ID // isLocalhost ? '1657818347-OQA4wE9x'  //

  const httpservice = new HTTPService()

  const flexMessage = (params) => ({
      type: 'flex',
      altText: 'ไฟล์ร่าง พร้อมสำหรับดาวน์โหลดแล้ว กดเพื่อดาวน์โหลดได้เลย',
      contents: {
        type: 'bubble',
        direction: 'ltr',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'vertical',
                  flex: 4,
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'filler'
                    },
                    {
                      type: 'text',
                      text: 'ดาวน์โหลดไฟล์',
                      size: 'lg',
                      color: '#FFFC00FF',
                      align: 'start',
                      wrap: true,
                      contents: []
                    },
                    {
                      type: 'filler'
                    }
                  ]
                }
              ]
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: params.title,
              align: 'start',
              size: 'md',
              wrap: true,
              contents: []
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          paddingAll: '0px',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'md',
              paddingAll: '10px',
              paddingBottom: '20px',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: 'Download',
                    uri: params.url
                  },
                  style: 'primary'
                }
              ]
            },
            {
              type: 'separator',
              color: '#00A304FF'
            },
            {
              type: 'box',
              layout: 'horizontal',
              paddingAll: '8px',
              height: '36px',
              backgroundColor: '#E7FFD23D',
              contents: [
                {
                  type: 'text',
                  text: params.unitName,
                  size: 'xxs',
                  align: 'center',
                  gravity: 'center',
                  wrap: true,
                  contents: []
                }
              ]
            }
          ]
        },
        styles: {
          header: {
            backgroundColor: '#A6CE39'
          },
          body: {
            backgroundColor: '#E7FFFEFF'
          },
          footer: {
            backgroundColor: '#E7FFFEFF'
          }
        }
      }
    })

  DownloadPage.propTypes = {
    event: PropTypes.object
  }

export default function DownloadPage(props) {

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id')

  const { profile } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true);
  const [userApproved, setUserApproved] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState("ดาวน์โหลด");
  const { onClose, open } = props;

  const [event, setEvent] = useState(props && props.event);

  const [groupInfo, setGroupInfo] = useState(event && event.basicInfo && event.basicInfo.selectedGroupInfo || profile && profile.groupInfo);

  const handleClose = () => {
    onClose()
  };

  const [log, setLog] = useState("");
  const [approved, setApproved] = useState(profile && profile.approved);

  async function generateFileEventMap() {
    return new Promise((resolve, _) => {
      httpservice.generateDownloadRequestId({
        eventId : event.id,
        creator: profile.fullname || profile.displayName,
        downloaded: false
      })
      .then( id => {

        console.log('retunred', id);
        console.log('event', event);
        console.log();
        const {
          title = '-', dateRange = '-'
        } = (event && event.basicInfo) || {}
        resolve({
          title,
          unitName: (groupInfo && groupInfo.unitName) || '-',
          dateRange,
          url: `https://${window.location.hostname}/download?id=${id}`
        })
      })
    })
  }

  async function shareTarget() {

    const info = await generateFileEventMap()

     const result = await liff.shareTargetPicker([flexMessage(info)])

     if (result) handleClose()

   }

  async function sendMessage() {


    const info = await generateFileEventMap()

    const result = await liff.sendMessages([flexMessage(info)])
    if (result) liff.closeWindow()

  }

  useEffect(() => {

    if (id) localStorage.setItem('id', id);

    if (!event && id) {

        (async () => {
          httpservice.getFileEvent( { id })
          .then(event => {
            setEvent(event)
            setGroupInfo(event.profile.groupInfo)

            // TODO:-delete node

          })
        })()

    }

  }, [id, event]);

  async function getUserApprovalStatus(userId) {
    const httpservice = new HTTPService()
    return new Promise((resolve, _) => {
      httpservice.readUserStatus({ userId})
      .then(status => {
        resolve(status)
      })
      .catch(e => console.log(e))
    })
  }

  useEffect(() => {

    if (isLocalhost) {

      const { userId } = profile
      if (!userId) {
        setUserApproved(false)
        setIsLoading(false)
        return undefined
      }
      getUserApprovalStatus(userId)
      .then(status => {
        setUserApproved(status)
        setIsLoading(false)
      })

    }

    (async () => {

      if (isLocalhost) return
      await liff.init({ liffId, withLoginOnExternalBrowser: true}) // : '1657818347-3bebKn0z'

      if (liff.isInClient()) {

        console.log('isInClient');
        setLog([log, 'isInClient'].join("\n"))

        const context = liff.getContext()

        setLog([log, 'context'].join("\n"))
        setLog([log, JSON.stringify(context)].join("\n"))

        const { userId } = context
        if (!userId) {
          setUserApproved(false)
          setIsLoading(false)
        }
        getUserApprovalStatus(userId)
        .then(status => {
          setUserApproved(status)
          setIsLoading(false)
        })



      } else if (liff.isLoggedIn()) {
        console.log('isLoggedIn()   ');
        setLog([log, 'isLoggedIn'].join("\n"))

        const profile = await liff.getProfile()

        const code = searchParams.get('code')
        if (code) {
          const id = localStorage.getItem('id');
          localStorage.removeItem('id');
          window.location.replace(`https://${window.location.hostname}/download?id=${id}`)
        }


        const { userId } = profile
        if (!userId) {
          setLog([log, `userId: ${userId}`].join("\n"))
          setUserApproved(false)
          setIsLoading(false)
        }
        getUserApprovalStatus(userId)
        .then(status => {
          setLog([log, `status: ${status}`].join("\n"))
          setUserApproved(status)
          setIsLoading(false)
        })

      } else {

        // setLog([log, window.location.href].join("\n"))
        // setLog([log, 'should login then redirect'].join("\n"))

        liff.login({ redirectUri: `https://${window.location.hostname}/download?id=${id}` })

      }
    })()
    return undefined

  }, []);


  // docx template


// Documents contain sections, you can have multiple sections per document, go here to learn more about sections
// This simple example will only contain one section
// const doc = new Document({
//     sections: [
//         {
//             properties: {},
//             children: [
//                 new Paragraph({
//                     children: [
//                         new TextRun("ค่าใช้จ่ายในการประเมินอาคารสีเขียวสำนักงานนโยบายและแผนทรัพยากรธรรมชาติและสิ่งแวดล้อม"),
//                         new TextRun({
//                             text: "สผ.",
//                             bold: true,
//                         }),
//                         new TextRun({
//                             text: "\tโปรแกรมอนุมัติค่าใช้จ่าย",
//                             bold: true,
//                         }),
//                     ],
//                 }),
//             ],
//         },
//     ],
// });

// const generate = () => {

//     Packer.toBlob(doc).then(blob => {
//         // console.log(blob);
//         saveAs(blob, "onep project budget.docx");
//         console.log("Document created successfully");
//       });

// }
// const generateFromTemplate = async () => {

// // get blob from serve
//     const ds = new DataService()
//     ds.getFileContent()
//     .then(data => {
//         console.log(data.url);
//     })

// }

const generateDocument = async () => {

  const docService = new DocService({ groupInfo, event})
  const doc = await docService.generateDocument()

    // console.log('got doc');
    const out = doc.getZip().generate({
      type: 'blob',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }); // Output the document using Data-URI
    saveAs(out, `${[event.basicInfo.title, event.profile && event.profile.groupInfo.unitName, event.updated ? dayjs(event.updated.toDate()).locale('th').format('BBBB-MM-DD LT') : ''].join(" - ")}.docx` || 'ไฟล์ร่างอนุมัติ.docx');

};

const saveLogAndGenerateDocument = async () => {
  if (liff.isLoggedIn()) {
    setDownloadLabel('กำลังบันทึก Log')
    const profile = await liff.getProfile()
    const httpservice = new HTTPService()

    await httpservice.saveDownloader({
      downloadId: id,
      ...profile,
      pictureUrl: profile.pictureUrl || "/assets/images/bee/onep_bee_xs.png"
      
    })

    await getUserApprovalStatus(profile.userId)
      .then(async status => {
        if (status) {
          setDownloadLabel('กำลังสร้างเนื้อหาไฟล์ DOCX')
          generateDocument()
            .then(setDownloadLabel('ดาวน์โหลด'))                  
         
        }
      })
  }
}

return <>{
  id


  ? isLoading
    ? <>ระบบจำเป็นต้องตรวจสอบสิทธิ์การใช้งานของคุณก่อนให้ดาวน์โหลดไฟล์</>
    : <Stack direction={'column'} sx={{ m: 2, p: 2, width: '50%'}} spacing={2}>
      
      
      {userApproved 
      ? <Button
        onClick={saveLogAndGenerateDocument}
        variant="contained" size="large">{downloadLabel}</Button>

      : <><Typography variant='p' color='error' textAlign={'center'} >คุณยังไม่ได้สมัครใช้งานในกลุ่มไลน์กลุ่มงานของท่าน</Typography>
      <Typography variant='caption' textAlign={'center'} >เข้าใช้งานครั้งแรก กรุณากดสมัครใช้งานจากกลุ่มไลน์ของท่าน</Typography>
      <Typography variant='caption' textAlign={'center'} >หากท่านสมัครไว้แล้ว กรุณาประสานการขอใช้งานกับแอดมินของกลุ่มไลน์ของท่าน</Typography></>
      }
      
      <Button
        onClick={() => {
          window.open('', '_self', '');
          window.close();
        }}
        variant="outlined" size="large">ปิดหน้าต่างนี้</Button>
        {/* <Typography variant="caption">LOG {log}</Typography> */}
    </Stack>
    
    

  : (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>ดาวน์โหลดหรือแชร์ไฟล์</DialogTitle>
        <Stack direction={'column'} sx={{ m:2}}>
          {!liff.isInClient() && <Button variant="contained" onClick={() => {
            generateDocument()
            handleClose()
            }} startIcon={<SaveIcon />}>ดาวน์โหลดไฟล์</Button>}
          {/* <Button onClick={generate}>DOWNLOAD</Button> */}
          <Button color="warning" onClick={() => shareTarget({...groupInfo, eventId: event.id})}  startIcon={<CoPresentIcon />}>แชร์ให้ผู้ใช้ไลน์</Button>
          {liff.isInClient() && <Button color="info" variant="contained" onClick={() => sendMessage({...groupInfo, eventId: event.id})} startIcon={<MessageIcon />}>แชร์ในแชท</Button>}
          {/* <Typography variant="caption">{log}</Typography> */}
        </Stack>
    </Dialog>
  )




}
    {/* <Typography>{log}</Typography> */}


    </>

}
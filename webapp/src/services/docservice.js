import { OtherHousesSharp } from '@mui/icons-material';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils';
import THBText from 'thai-baht-text'
import { isLocalhost } from '..';
import { isNumeric, NUMBER, THAINUMBER, THAINUMBER_NO_SEPARATOR,  } from '../App';

// import  template from '../doctemplates/oneptemplate.docx';

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
  }

class DocService {


    constructor({groupInfo, event, ...others}) {
        this.groupInfo = groupInfo
        this.event = event
        this.info = others
    }


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

generateDocument() {

    // const {groupInfo} = this.profile
    // console.log('groupInfo, event', this.groupInfo, this.event);

    const {
      unitName="",
      unitType="",
      docprefix="๑๐./"    
    } = this.groupInfo

    const {
      title="",
      place="",
      onepusers = [],
      types="",
      dateRange="[แก้ไขวันที่]",
      budgetPlan={ budgetplancodes: ''}, // having budgetplancodes      
      fields=[]
    } = this.event.basicInfo

    const {    
      editedMonthyear="",        
      budget=0,
      budgetYear="",
      borrowBudget="",
      travelCost="",
      product="",
      mainActivity="",
      subActivity=""
    } = this.event

    // const {      
    //   product="",
    //   mainActivity="",
    //   subActivity="",
    //   borrowBudget="",
    //   travelCost=""
    // } = this.info

    // : [
    //   {
    //     index:1,
    //     name: "",
    //     subtotal: ""
    //   },{
    //     index:2,
    //     name: "",
    //     subtotal: ""
    //   }
    // ]

    const applicant = onepusers && onepusers.find(u => u.applicant) || [...onepusers].shift()
    
    // console.log('groupInfo', this.roupInfo);
    // console.log('budgetPlan',budgetPlan);
    // console.log('fields', fields);

    return new Promise((resolve, reject) => {
        loadFile(
          '/doctemplates/oneptemplate.docx',// isLocalhost ? '/doctemplates/oneptemplate_local.docx' :  '/doctemplates/oneptemplate.docx',
            (error, content)  => {
              if (error) {
                throw error;
              }
              // console.log('content', content);
              const zip = new PizZip(content);
              const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
              });
              doc.setData({
                  event: title,
                  types,
                  location: place,
                  groupName: [`กลุ่มงาน${unitName}` || unitType].join(" / "),
                  title: `ขออนุมัติ${title}`,
                  personexists : onepusers.length ? '๑.๑ รายชื่อเจ้าหน้าที่ดังนี้' : '',
                  persons : onepusers.map((u, index) => ({...u, id: THAINUMBER_NO_SEPARATOR(index + 1) } )),
                  budget: THAINUMBER(budget),
                  budgetText: budget ? THBText(Number(budget)) : "",
                  budgetYear,
                  plan: budgetPlan,
                  budgetplancodes: budgetPlan.budgetplancodes,
                  product,
                  mainActivity,
                  subActivity,
                  dateRange: dateRange.split(" ").map(s => isNumeric(s) ? THAINUMBER_NO_SEPARATOR(s) : s ).join(" "),
                  editedMonthyear: editedMonthyear.split(" ").map(s => isNumeric(s) ? THAINUMBER_NO_SEPARATOR(s) : s ).join(" "),
                  fields,
                  borrowBudget: (borrowBudget && THAINUMBER(borrowBudget)) || (budget && THAINUMBER(budget)),
                  borrowBudgetText: borrowBudget ? THBText(Number(borrowBudget)) : (budget ? THBText(Number(budget)) : ""),
                  applicant: applicant && applicant.fullname || "",
                  applicantPosition: applicant && [applicant.position, applicant.positionType || ""].join("") || "",
                  docprefix,
                  travelCost
              });
              try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render();
              } catch (error) {
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
                const replaceErrors = (key, value)  => {
                  if (value instanceof Error) {
                    return Object.getOwnPropertyNames(value).reduce( (
                      error,
                      key
                    )  => {
                      error[key] = value[key];
                      return error;
                    },
                    {});
                  }
                  return value;
                }
                console.log(JSON.stringify({ error }, replaceErrors));
      
                if (error.properties && error.properties.errors instanceof Array) {
                  const errorMessages = error.properties.errors
                    .map( (error) => error.properties.explanation)
                    .join('\n');
                  console.log('errorMessages', errorMessages);
                  // errorMessages is a humanly readable message looking like this :
                  // 'The tag beginning with "foobar" is unopened'
                }
                reject(error)
                throw error;
              }
              // const out = doc.getZip().generate({
              //   type: 'blob',
              //   mimeType:
              //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              // }); // Output the document using Data-URI
              // return out
              resolve(doc)
            }
          );
    })
    
  };


// Done! A file called 'My Document.docx' will be in your file system.
}

export default DocService
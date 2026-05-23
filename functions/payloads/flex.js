const { LIFF_URI } = require("../constants");

class Flex {

    constructor() {

    }

    agentInitialMenu(groupSummary) {
        return {
            type: 'flex',
            altText: 'ข้อตกลงการใช้งาน',
            contents: {
                type: 'bubble',
                header: {
                    type: 'box',
                    layout: 'vertical',
                    paddingAll: '10px',
                    contents: [{
                        type: 'text',
                        text: `กลุ่ม ${groupSummary.groupName}\nได้รับอนุญาตให้ใช้งาน`,
                        weight: 'bold',
                        wrap: true,
                        size: 'lg',
                        contents: []
                    }]
                },
                hero: {
                    type: 'image',
                    url: groupSummary.pictureUrl,
                    size: 'full',
                    aspectRatio: '2:1',
                    aspectMode: 'cover'
                },
                body: {
                    type: 'box',
                    layout: 'vertical',
                    contents: [{
                            type: 'box',
                            layout: 'vertical',
                            margin: 'md',
                            contents: [{
                                type: 'button',
                                action: {
                                    type: 'uri',
                                    label: 'ข้อกำหนดการใช้งาน Line API',
                                    uri: 'https://manager.line.biz/terms?region=TH'
                                },
                                height: 'sm',
                                style: 'primary'                                
                            }]
                        },
                        {
                            type: 'box',
                            layout: 'vertical',
                            margin: 'md',
                            contents: [{
                                type: 'button',
                                action: {
                                    type: 'uri',
                                    label: 'นโยบายความเป็นส่วนตัว LINE',
                                    uri: 'https://line.me/th/terms/policy/'
                                },
                                height: 'sm',
                                style: 'primary',
                            }]
                        },
                        {
                            type: 'box',
                            layout: 'vertical',
                            margin: 'md',
                            contents: [{
                                type: 'button',
                                action: {
                                    type: 'uri',
                                    label: 'ข้อกำหนดและเงื่อนไขการใช้ LINE',
                                    uri: 'https://terms.line.me/line_terms?lang=th'
                                },
                                height: 'sm',
                                style: 'primary',
                            }]
                        }
                    ]
                },
                footer: {
                    type: 'box',
                    layout: 'vertical',
                    flex: 0,
                    spacing: 'sm',
                    contents: [{
                            type: 'box',
                            layout: 'vertical',
                            spacing: 'sm',
                            margin: 'lg',
                            contents: [{
                                    type: 'box',
                                    layout: 'baseline',
                                    spacing: 'sm',
                                    contents: [{
                                        type: 'text',
                                        text: '* การใช้งานบัญชีนี้หรือกลุ่มที่มีบัญชีนี้เป็นสมาชิกอยู่ให้ถือว่าท่านและสมาชิกทุกคนในกลุ่มยอมรับนโยบายฯ ข้อตกลงและเงื่อนไขข้างต้นทั้งหมด\nเราสัญญาว่าจะมอบประสบการณ์การใช้งานที่ดีที่สุด พร้อมไปกับการปฏิบัติตามข้อกำหนดการใช้งานบัญชีทางการด้วยระบบเอพีไออย่างเคร่งครัด',
                                        size: 'xxs',
                                        wrap: true,
                                        color: '#AAAAAA',
                                        flex: 1,
                                        align: 'center',
                                        contents: []
                                    }]
                                }

                            ]
                        },
                        {
                            type: 'spacer',
                            size: 'sm'
                        }
                    ]
                }
            }
        }
    }

    registerUser(group) {
        return {
            type: 'flex',
            altText: 'สมัครใช้งาน',
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
                        type: 'image',
                        url:'https://budget.onep.go.th/assets/images/logo_onep-300x300.png',
                        flex: 1,
                        size: 'lg'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        flex: 4,
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'text',
                            text: 'โปรแกรมอนุมัติค่าใช้จ่าย',
                            size: 'lg',
                            color: '#FFFC00FF',
                            align: 'start',
                            wrap: true,
                            contents: []
                          },
                          {
                            ...group && group.docprefix ? {
                              type: 'text',
                              text: group.docprefix,
                              size: 'xxs',
                              color: '#555555FF',
                              align: 'end',
                              contents: []
                            } : {
                              type: 'filler'
                            }
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
                    text: 'ลงทะเบียนสมาชิก',
                    align: 'start',
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
                    paddingAll: '10px',
                    paddingBottom: '20px',
                    spacing : 'md',
                    contents: [
                  
                      {
                          type: 'button',
                          action: {
                            type: 'postback',
                            label: 'สมัครใช้งาน',
                            displayText: 'สมัครใช้งาน',
                            data: 'mode=registeruser'
                          },
                          color: '#0194D9',
                          style: 'primary'
                        },
                        {
                        type: 'button',
                        action: {
                          type: 'uri',
                          label: 'เปิดโปรแกรม',
                          uri: LIFF_URI
                        },
                        style: 'secondary'
                      }
                    ]
                  },
                  {
                    type: 'separator',
                    color: '#00A304FF'
                  },                  
                  {
                    type: 'box',
                    layout: 'vertical',
                    paddingAll: '8px',
                    height: '72px',
                    backgroundColor: '#E7FFD23D',
                    contents: [
                      {
                        type: 'text',
                        text: 'กลุ่มงาน' + (group && group.unitName || ''),
                        size: 'xxs',
                        align: 'center',
                        gravity: 'center',
                        wrap: true,
                        contents: []
                      },
                      {
                        type: 'text',
                        text: (group && group.unitType) || '-',
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
                  backgroundColor: '#E7FFFE'
                },
                footer: {
                  backgroundColor: '#E7FFFE'
                }
              }
              
            }                          
        }
    }


    registeGroup(summary) {
        return {
            type: 'flex',
            altText : 'ok', 
            contents: {
                type: 'bubble',
                direction: 'ltr',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `ลงทะเบียน\nกลุ่ม "${summary.groupName}"\nเพื่อใช้งานโปรแกรมอนุมัติค่าใช้จ่าย`,
                      weight: 'bold',
                      align: 'center',
                      wrap: true,
                      contents: []
                    }
                  ]
                },
                hero: {
                  type: 'image',
                  url: summary.pictureUrl || 'https://vos.line-scdn.net/bot-designer-template-images/bot-designer-icon.png',
                  size: 'full',
                  aspectRatio: '4:3',
                  aspectMode: 'cover'
                },
                // body: {
                //   type: 'box',
                //   layout: 'vertical',
                //   contents: [
                //     {
                //       type: 'button',
                //       action: {
                //         type: 'postback',
                //         label: 'ลงทะเบียนกลุ่ม',
                //         displayText: 'ลงทะเบียนกลุ่ม',
                //         data: 'mode=registergroup'
                //       },
                //       color: '#0194D9',
                //       style: 'primary'
                //     }
                //   ]
                // }
              }
              
        }

    }
}

module.exports = Flex;
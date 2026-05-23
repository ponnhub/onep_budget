const KEY = {

    INIT_GROUP: '#initgroup',
    REGISTER: 'ลงทะเบียน',
    LABEL_START_TRANSLATION: 'Start Translation',
    LABEL_STOP_TRANSLATION: 'Stop Translation',
    START_TRANSLATION: 'translationOn',
    STOP_TRANSLATION: 'translationOff',
    PREFERRED_LANG: 'preferedLang',
    MENU_TH: 'เมนู',
    MENU: 'menu',
    POLICY: 'นโยบายความเป็นส่วนตัว',
    TERMS: 'ข้อกำหนดการใช้งาน',
    TERMS_CONDITIONS: 'ข้อกำหนดและเงื่อนไข',

    PREVIOUS: {
        mode: 'previous',
        en: '⬅️ previous',
        th: '⬅️ ก่อนหน้า',
        abbr: {
            en: '⬅️',
            th: '⬅️'
        }
    },
    NEXT: {
        mode: 'next',
        en: 'next ➡️',
        th: 'ถัดไป ➡️',
        abbr: {
            en: '➡️',
            th: '➡️'
        }
    },
    OK: {
        en: 'ok',
        th: 'ตกลง'
    },
    CANCEL: {
        en: 'Cancel',
        th: 'ยกเลิก'
    },
    DONE: {
        en: 'Done',
        th: 'เสร็จ'
    },
    SKIP: {
        en: 'Skip',
        th: 'ข้ามไปก่อน'
    },
    NOTIFY_GROUP: 'notifygroup',

    CONFIG_GROUP: 'configgroup',
    CONFIG_GROUP_LABEL: 'ตั้งค่ากลุ่ม',

    ASSIGN_USERS: 'assignuser',
    ASSIGN_USERS_LABEL: 'กำหนดสิทธิ์ผู้ใช้',

    ASSIGN_DO_VIEWERS: 'assignviewer',
    ASSIGN_DO_VIEWERS_LABEL: 'ผบช.',

    ASSIGN_SQN_ADMINS: 'assignsqnadmin',
    ASSIGN_SQN_ADMINS_LABEL: 'Admin ของฝูง',

    ASSIGN_SQN_EDITOR: 'assignsqneditor',
    ASSIGN_SQN_EDITOR_LABEL: 'Editor ของฝูง',

    ASSIGN_DO_ADMINS: 'assigndoadmin',
    ASSIGN_DO_ADMINS_LABEL: 'Admin ของกรม',

    ASSIGN_SQN_PILOTS: 'assignsqnpilot',
    ASSIGN_SQN_PILOTS_LABEL: 'นักบิน',


    ADD_REPORT: 'addreport',
    TEXT_ADD_REPORT: 'add report',
    ADD_REPORT_LABEL: 'เพิ่มผลการฝึก',

    EDIT_REPORT: 'editreport',
    DELETE_RERORT: 'deletereport',

    EDIT_SIM: 'editsim',
    TEXT_EDIT_SIM: 'Edit SIM',
    EDIT_SIM_LABEL: 'เพิ่ม/เลือก SIM',

    EDIT_COURSE: 'editcourse',
    USER_TEXT_EDIT_COURSE: 'Edit course',
    EDIT_COURSE_LABEL: 'เพิ่ม/เลือกหลักสูตร',

    EDIT_STARTDATE: 'editstartdate',
    EDIT_STARTDATE_LABEL: 'แก้ไขวันเริ่ม',

    EDIT_ENDDATE: 'editenddate',
    EDIT_ENDDATE_LABEL: 'แก้ไขวันสิ้นสุด',

    EDIT_LOCATION: 'editlocation',
    EDIT_LOCATION_LABEL: 'แก้ไขสถานที่',

    EDIT_TACTICS: 'edittactics',
    EDIT_TACTICS_LOOP: 'edittacticsloop',

    EDIT_SUBTACTICS: 'editsubtactics',
    EDIT_SUBTACTICS_LABEL: 'แก้ไขคะแนน',

    USER_TEXT_VIEW_REPORTS: 'view reports',

    USER_REGISTER: 'register',
    USER_REGISTER_LABEL: 'ลงทะเบียนใช้งาน',

    USER_VIEW_PROFILE: 'viewprofile',
    USER_TEXT_VIEW_PROFILE: 'view profile',
    USER_VIEW_PROFILE_LABEL: 'ดูโปรไฟล์',

    USER_EDIT_PROFILE: 'editprofile',
    USER_TEXT_EDIT_PROFILE: 'edit profile',
    USER_EDIT_PROFILE_LABEL: 'แก้ไขโปรไฟล์',

    USER_EDIT_PROFILE_RANK: 'editprofilerank',
    USER_EDIT_PROFILE_RANK_LABEL: '💂🏼‍♂️ ยศ',

    USER_EDIT_PROFILE_FIRSTNAME: 'editprofilefirstname',
    USER_EDIT_PROFILE_FIRSTNAME_LABEL: '🔤 ชื่อ',

    USER_EDIT_PROFILE_SURNAME: 'editprofilesurname',
    USER_EDIT_PROFILE_SURNAME_LABEL: '🔤 นามสกุล',

    USER_EDIT_PROFILE_EMAIL: 'editprofileemail',
    USER_EDIT_PROFILE_EMAIL_LABEL: '✉️ อีเมล',

    USER_EDIT_PROFILE_SQN: 'editprofilesqn',
    USER_EDIT_PROFILE_SQN_LABEL: '⃝ ฝูงที่สังกัด',

    USER_EDIT_PROFILE_TYPES: 'editprofiletypes',
    USER_EDIT_PROFILE_TYPES_LABEL: '🎫 แบบเครื่อง',

    USER_EDIT_PROFILE_PICTURE: 'editprofilepicture',
    USER_EDIT_PROFILE_PICTURE_LABEL: '🖼 แก้ไขรูปโปรไฟล์',

    VIEW_PROFILES_SQN: 'viewsqnprofiles',
    VIEW_PROFILES_SQN_LABEL: 'ดูโปรไฟล์สังกัดฝูง',

    VIEW_LIFF: 'web view',
    VIEW_LIFF_LABEL: 'เปิดเว็บ',

    VIEW_SUBMITTED_REPORTS_SQN: 'viewsqnreports',
    VIEW_SUBMITTED_REPORTS_SQN_LABEL: 'ดูรายงานผล SIM ของฝูง',

    SUBMIT_REPORT: 'submitreport',

    ASSIGN_USER_PRESSED: 'assignuserpressed',

    USER_MENU_LABEL: 'เปิดเมนูผู้ใช้',

    UPDATE_USER_PROFILE: '#updateuserprofile',
    UPDATE_USER_STATUS: '#updateuserstatus',

    ADD_SQN_LOGO_LABEL: 'แก้ไขโลโก้',
    ADD_SQN_LOGO: 'addsqnlogo',
    ADD_SQN_NAME_LABEL: 'แก้ไขชื่อฝูง',
    ADD_SQN_NAME: 'addsqnname',
    OPEN_GROUP_MENU: 'opengroupmenu',
    OPEN_USER_MENU: 'openusermenu',
    OPEN_EDITOR_MENU: 'openeditormenu',
    PICKDATE: 'pickdate',
    PICKTIME: 'picktime',
    CONFIRM: 'confirm',
    JOIN: 'join',
    FOLLOW: 'follow',
    UNFOLLOW: 'unfollow',

    MEMBER_JOINED: 'memberJoined',

    MEMBER_LEFT: 'memberLeft',
    GROUP: 'group',
    GROUPS: 'groups',
    ROOM: 'room',
    USERS: 'users',
    USERS_LEFT: 'usersleft',
    POSTBACK: 'postback',
    MESSAGE: 'message',
    STICKER: 'sticker',
    TEXT: 'text',
    LOCATION: 'location',
    IMAGE: 'image',
    AGENT_CONFIG: 'agentConfig',
    LAST_ACTIVITY: 'lastActivity',

    ASSIGNEE: 'assignee',
    TASKS: 'tasks',
    ARCHIVE_TASKS: 'archivetasks',
    USER_TASKS: 'usertasks',
    REFERENCE_DATA: 'refdata',
    TASKTYPE: 'tasktypes',
    REMOVED: 'removed',
    ranks: [
        'นนอ.', 'ร.ต.', 'ร.ท.', 'ร.อ.', 'น.ต.', 'น.ท.', 'น.อ.', 'น.อ.(พ)', ' พล.อ.ต.', ' พล.อ.ท.', ' พล.อ.อ.'
    ],

    EVENTS: 'events',
    ADD_EVENT: '#addevent',
    ADD_EVENT_LABEL: 'เพิ่มในปฏิทิน',

    VIEW_EVENTS: '#viewevents',
    VIEW_EVENTS_LABEL: 'ปฏิทิน',

    TEST: 'test',
    TEST_RESULT: 'testResult',

    DELETE_EVENT: '#deleteevent',

    TASK: 'งาน',
    PREVIEW_TASK: 'แสดงงานแบบในกลุ่ม',
    ADD_TASK: '#addtask',
    VIEW_TASK: "#viewtasks",
    TOGGLE_ACTIVATE_TASK: '#toggleactivatetask',
    DELETE_TASK: '#deletetask',

    MY_TASK: 'งานฉัน',
    READ_CONFIRM: 'readConfirmation',

    ACTICE: 'active',
    PRESENCE_REQUIRED: 'presenceRequired',

    WFH: 'WFH',
    WAO: 'WAO',

    PRESENCE_CONTROL_COMMAND: '#presencecontrol',
    PRESENCE_CONTROL_LABEL: 'ลงชื่อปฏิบัติงาน WFH',
    PRESENCE_CONTROL_LABEL_SHORT: 'ลงชื่อ WFH',
    PRESENCE_CONTROL_LABEL_ABBR: 'WFH',
    PRESENCE_CONTROL_NODE: 'presence',
    PRESENCE_CONTROL_HISTORY: 'presencehistory',
    DETAILED_PRESENCE : 'ยอดละเอียด',
    SUMMARIZED_PRESENCE: 'เช็คยอด',

    REFRESH: 'refresh',
    EDIT_EVENT_ASSIGNEES: 'editeventassignees',


    CREATE_NAMELIST: '#namelist',
    CREATE_NAMELIST_TEXT: 'สำรวจยอด',
    NAMELIST_LABEL: 'ลงชื่อ',
    NAMELIST_LABEL_FULL: 'สร้างโหวต/สำรวจยอด',
    NAMELIST: 'namelist',

    DRIVE: 'drive',
    DRIVE_LABEL: 'เปิด Drive',
    DRIVE_MIMETYPE_FOLDER: 'application/vnd.google-apps.folder',
    DRIVE_SEARCH_FOLDERS : 'searchableFolders',
    DRIVE_STRUCTURE: 'driveStructure',
    INDEX_DRIVE_FOLDERS: 'indexDriveFolder',
    INDEX_DRIVE_FOLDERS_LABEL: 'Index Drive Folders',


    SUPPLEMENT_EVENTS: 'supplementEvent',
    VIEW_SUPPLEMENT_EVENTS_LABEL: 'ปฏิทินแผนงาน/โครงการ',
    VIEW_SUPPLEMENT_EVENTS: 'viewSupplementEvents',

    PROJECT_PLAN_EVENTS: 'projectPlanEvents',
    PROJECT_PLAN_EVENTS_LABEL: 'ปฏิทินคณะ ฝสธ.(เสธ.ทอ.)',
    VIEW_PROJECT_PLAN_EVENTS: 'viewProjectPlanEvents',


    MEDIA_CAROUSEL: 'mediaCarousel',

    SPECIAL_HOLIDAY: 'specialHoliday',
    EDIT_SPECIAL_HOLIDAY: 'addHoliday',
    EDIT_SPECIAL_HOLIDAY_LABEL: 'วันหยุดกรณีพิเศษ',
    UPDATE_HOLIDAY: 'updateHolidays',
    UPDATE_HOLIDAY_LABEL: 'อัพเดตวันหยุด',


};

const ONEP_COMMAND = {
    POSTBACK_MODE: {
        init: 'init',
        delete: 'delete',
        restore : 'restore',
        modify: 'modify',
        load: 'load'
    }
}

const ONEP_PLAN_KEYS = {
    plan: 'แผนงาน',
    products: 'ผลผลิต',
    projects: 'โครงการ',
    activities: 'กิจกรรมหลัก',
    subactivities: 'กิจกรรมย่อย'
}

const ONEPNotifyTokens = {
    assiatant: '5Y6FVXQRaHREbxetEplluvf8nik6bqpS6Q3UbquYW32'
}

const LIFF_URI = "https://liff.line.me/1657818347-PKWkyEj7"

module.exports = {
    KEY,
    ONEP_COMMAND,
    ONEP_PLAN_KEYS,
    ONEPNotifyTokens,
    LIFF_URI
}

const unitLabel = (unit) => {        

    switch (unit) {
        case 'person':
            
            return 'คน';
        case 'day':
            
            return 'วัน';
        case 'night':
            
            return 'คืน';
        case 'room':
            
            return 'ห้อง';
    
        case 'meal':
            
            return 'มื้อ';

        case 'hour':
            
            return 'ชั่วโมง';

        case 'place':
        
            return 'แห่ง';

        case 'bag':
        
            return 'ใบ';

        case 'book':
        
            return 'เล่ม';

        case 'leg':
        
            return 'เที่ยว';

        case 'km':
        
            return 'กม.';

        case 'assessee':
        
            return 'จำนวนผู้รับประเมิน';

        case 'event':
        default:
            
            return '';;
    }
    
};
export default unitLabel
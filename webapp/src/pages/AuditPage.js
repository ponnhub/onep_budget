import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
} from '@mui/material';

import DataService from '../services/dataservice';



export default function AuditPage() {

  const ds = new DataService()


  return (
    <>
      <Helmet>
        <title> ตรวจสอบร่าง | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          ตรวจสอบร่าง
          </Typography>          
        </Stack>

        <Card>
          [กำลังปรับปรุง]
        </Card>
      </Container>      
    </>
  );
}

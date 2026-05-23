import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';

// line liff
import liff from '@line/liff';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// components
import Iconify from '../components/iconify';
import { AppContext } from '../App';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const navigate = useNavigate()

  const { profile } = useContext(AppContext)

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

const steps = [
  {
    label: 'เข้าร่วมกลุ่มไลน์ของกลุ่มงาน และกดลงทะเบียน',
    description: `ผู้ดูแลระบบของ สผ. หรือของกลุ่มงานท่านเพื่อเริ่มต้นลงทะเบียนกลุ่ม หลังจากทีกลุ่ม
              ของท่านได้รับอนุญาตให้เริ่มต้นใช้งานแล้ว ท่านจะสามารถกดลงทะเบียนเพื่อพิสูจน์ตัวบุคคล
              ของท่าน แล้วท่านจะสามารถลงชื่อเพื่อเข้าใช้ระบบได้จากคอมพิวเตอร์ การใช้งานจากลิงค์
              ภายในกลุ่มของท่านจะเป็นวิธีที่สะดวกที่สุด`,
  },
  {
    label: 'ลงชื่อเข้าใช้จากเว็บ หรือกลุ่มไลน์',
    description:
      `ภายในกลุ่มไลน์ ท่านสามารถกดปุ่ม "ลงทะเบียน" เพื่อเริ่มต้นใช้งานได้เสมอ ท่านจำเป็นต้องป้อนข้อมูลในครั้งแรกเท่านั้น
      หากท่านสะดวกใช้งานจากคอมพิวเตอร์ ขอให้ท่านลงทะเบียนจากภายในกลุ่มไลน์ก่อนเพียงครั้งเดียว`,
  },
  {
    label: 'ใช้งานโปรแกรมจากเมนูต่าง ๆ',
    description: `เมื่อท่านเลือกกลุ่มงานแล้ว ท่านสามารถเริ่มต้นใช้งานโปรแกรมได้เลย หากมีคำถามน้องน้ำผิ้งยินดีให้คำตอบครับ`,
  },
];
  return (
    <>
      <Helmet>
        <title> Dashboard | โปรแกรมอนุมัติค่าใช้จ่าย </title>
      </Helmet>

      <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 5 }}>
        โปรแกรมอนุมัติค่าใช้จ่าย
        </Typography>


        {liff.isInClient() && <Button onClick={() => {
          window.open(`https://budget.onep.go.th`)
          liff.closeWindow()
        }} variant="contained" startIcon={<Iconify icon="iconoir:open-in-browser" />}>
            เปิดบนเบราเซอร์
          </Button>}
      </Stack>
        

        <Typography variant="body2" sx={{ mb: 5 }}>
              วิธีการใช้งาน
            </Typography>

        <Box sx={{ maxWidth: 400 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      optional={
                        index === 2 ? (
                          <Typography variant="caption">ขั้นสุดท้าย</Typography>
                        ) : null
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'ปิด' : 'ขั้นต่อไป'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            ย้อนกลับ
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>เสร็จเรียบร้อยทุกขั้นตอน</Typography>
                  {!profile && <Button variant='contained' color='success' onClick={() => navigate('/login')} sx={{ mt: 1, mr: 1 }}>
                    ลงชื่อเข้าใช้
                  </Button>}
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    เริ่มต้นอ่านใหม่
                  </Button>

                </Paper>
              )}
            </Box>

      </Container>


    </>
  );
}

import { Box, Container, Link, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

function ContactPage() {
  
  return (
    <Container sx={{ mt: 10 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Avatar
          alt="Zakaria"
          src="/images/Pers_Pic.jpg" 
          sx={{ width: 100, height: 100, margin: 'auto', mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1" align="center" mb={2} gutterBottom>
          I'd love to connect and talk about web development, projects, or potential collaboration!
        </Typography>

        <Box display='flex' flexDirection='column' justifyContent='center' gap={2} >
          <Stack direction='row' spacing={1}  >
            <GitHubIcon />
            <Link href="https://github.com/ZakariaAK94" target="_blank" rel="noopener">
              github.com/ZakariaAK94
            </Link>
          </Stack>
          <Stack direction='row' spacing={1} >
            <LinkedInIcon />
            <Link href="https://www.linkedin.com/in/zakaria-akil/" target="_blank" rel="noopener">
              linkedin.com/in/zakaria-akil/
            </Link>
          </Stack>
          <Stack direction='row' spacing={1} >
          <Link href="mailto:akilzakaria02@gmail.com" underline="hover">
            <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            akilzakaria02@gmail.com
          </Link>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

export default ContactPage;



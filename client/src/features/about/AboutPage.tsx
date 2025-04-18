import { Box, Container, Paper, Typography } from '@mui/material';

function AboutPage() {
  return (
    <Container sx={{ mt: 5, mb:2 }}>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        <img
          src="/images/storeImage.png"
          alt="StoreImage"
          style={{ maxWidth: '100%', height:'500px' ,borderRadius: 16 }}
        />
      </Paper>

        <Typography variant="h4" gutterBottom>
          About the Restore App
        </Typography>

        <Typography variant="body1" align="center" mb={2}>
          Restore is a full-stack e-commerce platform I built entirely as a self-learning project.
          It gave me the opportunity to dive deep into modern web development and software engineering practices.
        </Typography>

        <Typography variant="body1" align="center" mb={2}>
          The app includes core features like user authentication, secure payments using Stripe, webhook handling,
          role-based access control, and continuous integration and deployment.
        </Typography>

        <Typography variant="body1" align="center" mb={2}>
          There are two types of users: <strong>Members</strong> can access the catalog, about, and contact pages, while
          <strong> Admins</strong> have access to inventory management and error monitoring.
        </Typography>

        <Typography variant="body1" align="center" mb={2}>
          <strong>Technologies:</strong> ASP.NET Core, React, Redux, TypeScript, Material UI, Entity Framework, C#,
          SQLite (Dev), PostgreSQL (Prod), Docker, GitHub Actions, Fly.io, Stripe.
        </Typography>

        <Typography variant="h6" align="center" mt={2}>
          I'm continuously improving the app and adding features as I explore new concepts.
        </Typography>
      </Box>
    </Container>
  );
}

export default AboutPage;

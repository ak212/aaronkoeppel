import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React from 'react'

export const Footer = (): JSX.Element => {
  return (
    <footer>
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '100px 100px 100px',
          gap: '1vw',
          justifyContent: 'center',
          padding: '1vw',
          alignItems: 'center',
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
              "Droid Sans", "Helvetica Neue", sans-serif`,
          marginTop: '2vh',
        }}
      >
        <Button
          variant="contained"
          startIcon={<GitHubIcon />}
          href="https://github.com/ak212"
          target="_blank"
          sx={{ color: 'black', backgroundColor: 'white' }}
        >
          GitHub
        </Button>
        <Button
          variant="contained"
          startIcon={<LinkedInIcon />}
          href="https://www.linkedin.com/in/aaron-koeppel/"
          target="_blank"
          sx={{ color: 'black', backgroundColor: 'white' }}
        >
          LinkedIn
        </Button>
        <Button
          variant="contained"
          startIcon={<MailOutlineIcon />}
          href="mailto:aaron.a.koeppel@gmail.com"
          sx={{ color: 'black', backgroundColor: 'white' }}
        >
          Email
        </Button>
      </Box>
    </footer>
  )
}

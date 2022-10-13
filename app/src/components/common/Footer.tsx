import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { Button } from '@mui/material'
import React from 'react'

export const Footer = (): JSX.Element => {
  return (
    <footer>
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
    </footer>
  )
}

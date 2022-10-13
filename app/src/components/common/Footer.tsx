import { Button } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import React from 'react'

export const Footer = (): JSX.Element => {
  return (
    <footer>
      <Button variant="contained" startIcon={<GitHubIcon />} href="https://github.com/ak212" target="_blank">
        GitHub
      </Button>
      <Button
        variant="contained"
        startIcon={<LinkedInIcon />}
        href="https://www.linkedin.com/in/aaron-koeppel/"
        target="_blank"
      >
        LinkedIn
      </Button>
      <Button variant="contained" startIcon={<MailOutlineIcon />} href="mailto:aaron.a.koeppel@gmail.com">
        Email
      </Button>
    </footer>
  )
}

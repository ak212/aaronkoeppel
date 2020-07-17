import { Button } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import React from 'react'

class Footer extends React.Component {
   public render = () => {
      return (
         <footer>
            <Button variant='contained' startIcon={<GitHubIcon />} href='https://github.com/ak212' target='_blank'>
               GitHub
            </Button>
            <Button
               variant='contained'
               startIcon={<LinkedInIcon />}
               href='https://www.linkedin.com/in/aaron-koeppel/'
               target='_blank'
            >
               LinkedIn
            </Button>
            <Button variant='contained' startIcon={<MailOutlineIcon />} href='mailto:aaron.a.koeppel@gmail.com'>
               Email
            </Button>
         </footer>
      )
   }
}

export default Footer

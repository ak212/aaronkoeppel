import React from 'react'

class MainPage extends React.Component {
   public render = () => {
      return (
         <div className='App-header'>
            <h2>Welcome to Aaron Koeppel's website.</h2>
            <div
               className='LI-profile-badge'
               data-version='v1'
               data-size='medium'
               data-locale='en_US'
               data-type='horizontal'
               data-theme='dark'
               data-vanity='aaron-koeppel'
            >
               <a
                  className='LI-simple-link'
                  href='https://www.linkedin.com/in/aaron-koeppel?trk=profile-badge'
               >
                  Aaron Koeppel
               </a>
            </div>
         </div>
      )
   }
}

export default MainPage

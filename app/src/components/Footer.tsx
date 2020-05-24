import React from 'react'

class Footer extends React.Component {
   public render = () => {
      return <footer id={"footer"}>{new Date().getFullYear()}</footer>
   }
}

export default Footer

import Box from '@mui/material/Box'
import React from 'react'

export const MainPage = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
      }}
    >
      <h2>{`Welcome to Aaron Koeppel's website.`}</h2>
    </Box>
  )
}

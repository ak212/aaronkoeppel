import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import uniqueId from 'lodash/uniqueId'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  header: string
  body: string
  link: string
  image: string
}

export const ProjectCard = ({ header, body, link, image }: Props) => {
  const [hover, setHover] = useState<boolean>(false)
  const navigate = useNavigate()

  return (
    <Grid key={uniqueId()} item xs>
      <Card
        sx={{ width: '17rem', height: '22rem', borderRadius: '20px' }}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
      >
        {hover ? (
          <>
            <CardContent sx={{ minHeight: '16rem' }}>
              <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                {header}
              </Typography>
              <Box sx={{}}>
                <Typography variant="body2">{body}</Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate(link)}>
                Learn More
              </Button>
            </CardActions>
          </>
        ) : (
          <Box sx={{ transform: 'translateY(-50%)', top: '50%', position: 'relative' }}>
            <CardMedia component="img" image={image} title={header} />
          </Box>
        )}
      </Card>
    </Grid>
  )
}

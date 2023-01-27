import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import cssSvg from '../../assets/css.svg'
import graphqlSvg from '../../assets/graphql.svg'
import html5Svg from '../../assets/html5.svg'
import javaSvg from '../../assets/java.svg'
import railsSvg from '../../assets/rails.svg'
import reactSvg from '../../assets/react.svg'
import recreationgov from '../../assets/recreationgov.svg'
import reduxSvg from '../../assets/redux-saga.svg'
import typescriptSvg from '../../assets/typescript.svg'
import { ProjectCard } from '../../components/common/ProjectCard'
import { ToolCard } from '../../components/common/ToolCard'

export const MainPage = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        marginTop: '10rem',
        paddingLeft: '3rem',
        paddingRight: '3rem',
      }}
    >
      <Typography variant="h2" fontWeight="600">
        {`Hello, I'm Aaron Koeppel.`}
      </Typography>
      <Box sx={{ marginTop: '3rem' }}>
        <Typography variant="body1">
          {`I'm a passionate full-stack software engineer emphasizing on front-end development with ${
            new Date().getFullYear() - 2015
          } years of experience. I enjoy building featureful applications that make users' lives easier.`}
        </Typography>
      </Box>
      <Box sx={{ marginTop: '5rem' }}>
        <Box sx={{ marginBottom: '1rem' }}>
          <Typography variant="h4" fontWeight="600">
            Tools
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <ToolCard image={reactSvg} title="React" />
          <ToolCard image={typescriptSvg} title="Typescript" />
          <ToolCard image={html5Svg} title="HTML5" />
          <ToolCard image={cssSvg} title="CSS" />
          <ToolCard image={reduxSvg} title="Redux" />
          <ToolCard image={graphqlSvg} title="Graphql" />
          <ToolCard image={javaSvg} title="Java" />
          <ToolCard image={railsSvg} title="Rails" />
        </Grid>
      </Box>
      <Box sx={{ marginTop: '5rem' }}>
        <Box sx={{ marginBottom: '1rem' }}>
          <Typography variant="h4" fontWeight="600">
            Projects
          </Typography>
        </Box>
        <Grid container justifyContent="center" alignItems="center" spacing={8}>
          <ProjectCard
            header="Campsite Availability Finder"
            body={`Camping is more popular than ever, so I often find myself looking at several campgrounds in an area before finding one (or more) that I'll stay at for a camping trip. I built a tool that uses the Recreation.gov API and allows you to compare the availability of whatever campgrounds you are interested in.`}
            link="/campsites"
            image={recreationgov}
          />
          <ProjectCard
            header="NHL Scoreboard"
            body={`I'm a big fan of hockey and like to keep up scores and highlights for the NHL. I built an NHL Scoreboard that will show the games of the day, scoring plays, and highlights using the NHL API. It'll also give scoring notification snackbar if you are on the page when a team scores.`}
            link="/nhl-scoreboard"
            image={`https://www-league.nhlstatic.com/images/logos/league-dark/133-flat.svg`}
          />
          <ProjectCard
            header="Video Player"
            body={`I enjoy travelling and have a drone for aerial photography. I created a simple Youtube video player to cycle through videos I edited together from some of my trips.`}
            link="/drone-videos"
            image={`https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg`}
          />
        </Grid>
      </Box>
    </Box>
  )
}

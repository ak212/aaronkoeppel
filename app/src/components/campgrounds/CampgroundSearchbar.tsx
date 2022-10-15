import { Autocomplete, Chip, TextField } from '@mui/material'
import { startCase, uniqueId } from 'lodash'
import React from 'react'
import { useAppSelector } from '../../state/hooks'
import { RootState } from '../../state/store'
import { campsitesSelectors, EntityType, isRecreationArea, RecreationArea } from '../../store/campsites'
import { CampgroundIcon } from '../icons/CampgroundIcon'
import { RecreationAreaIcon } from '../icons/RecreationAreaIcon'

interface Props {
  autoCompleteText: string
  selectedRecAreas: RecreationArea[]

  onChange: (event: React.ChangeEvent<unknown>, value: (string | RecreationArea)[]) => void
  onInputChange: (event: React.ChangeEvent<unknown>, value: string) => void
}

export const CampgroundSearchbar = ({ autoCompleteText, selectedRecAreas, onChange, onInputChange }: Props) => {
  const autocompleteValues: RecreationArea[] = useAppSelector((state: RootState) =>
    campsitesSelectors.getAutocomplete(state),
  )

  return (
    <Autocomplete
      multiple
      freeSolo
      limitTags={4}
      id="recreation-areas"
      options={autocompleteValues.filter(
        ra => [EntityType.REC_AREA, EntityType.CAMPGROUND].indexOf(ra.entity_type) !== -1,
      )}
      getOptionLabel={option => (isRecreationArea(option) ? startCase(option.name.toLowerCase()) : option)}
      onInputChange={onInputChange}
      value={selectedRecAreas}
      onChange={onChange}
      renderTags={(value: RecreationArea[], getTagProps) =>
        value.map((recArea: RecreationArea, index: number) => (
          <div key={uniqueId()}>
            <Chip
              variant="outlined"
              label={startCase(recArea.name.toLowerCase())}
              icon={recArea.entity_type === EntityType.REC_AREA ? <RecreationAreaIcon /> : <CampgroundIcon />}
              {...getTagProps({ index })}
              color="primary"
              sx={{
                color: 'white',
                '& .MuiChip-icon': {
                  color: '#1976d2',
                },
              }}
            />
          </div>
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          label="Search Recreation Areas"
          margin="normal"
          variant="outlined"
          InputProps={{ ...params.InputProps, type: 'search' }}
          value={autoCompleteText}
          sx={{ label: { color: '#1976d2' }, input: { color: 'white' } }}
        />
      )}
    />
  )
}

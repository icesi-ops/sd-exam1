import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { TextField, Typography, Button, Stack, MenuItem } from '@mui/material'
import { GameSchema, GameType } from "../schemas/GameSchema"
import { z } from 'zod';
import GameService from '../services/GameService';

const GameFormProps = z.object({
  action: z.string(),
  game: GameSchema.optional(),
})

type GameFormPropsType = z.infer<typeof GameFormProps>;


function GameForm(props: { action: string, game?: GameType }) {

  const gameProps: GameFormPropsType = props;

  let preloadedData = gameProps.game?.release_year ?
    gameProps.game :
    {
      name: '',
      release_year: 2010,
    }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1969 }, (_, index) => 1970 + index);


  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: preloadedData
  });

  function onSubmit(data: GameType) {
    gameProps.action == 'add' ?
    addGame(data)
    : editGame(data)
  };

  async function addGame(newGame: GameType) {
    await GameService.addGame(newGame);
    // location.reload();
  }

  async function editGame(newGame: GameType) {
    await GameService.editGame(newGame);
    // location.reload();
  }

  return (

    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} width={400} justifyContent='center'>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }} color='black'>
            {gameProps.action === 'add' ? 'Add new game' : 'Edit game'}
          </Typography>

          {gameProps.action === 'edit' ? <TextField
            label='ID'
            disabled
            type='id'
            {...register('id', { required: 'ID is required' })}
            error={!!errors.id}
            helperText={errors.id?.message}
          /> : null}
          <TextField
            label='Name'
            type='name'
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            select
            fullWidth
            label='Release Year'
            defaultValue='2010'
            inputProps={register('release_year', { required: 'Release year is required' })}

            error={!!errors.release_year}
            helperText={errors.release_year?.message}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="info">
            {gameProps.action === 'add' ? 'Add game' : 'Edit game'}
          </Button>
          <DevTool control={control} />
        </Stack>
      </form>

    </>
  )
}

export default GameForm

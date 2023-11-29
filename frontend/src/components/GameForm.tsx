import { useForm } from "react-hook-form";
import { useEffect } from 'react'
// import { DevTool } from "@hookform/devtools";
import { TextField, Typography, Button, Stack, MenuItem } from '@mui/material'
import { GameSchema, GameType } from "../schemas/GameSchema"
import { z } from 'zod';
import GameService from '../services/GameService';

const GameFormProps = z.object({
  action: z.enum(["add", "edit"]),
  game: GameSchema.optional(),
})

type GameFormPropsType = z.infer<typeof GameFormProps>;


function GameForm(props: GameFormPropsType) {

  const { action, game } = props;

  

  // const [image, setImage] = useState<Blob | undefined>(undefined)

  let preloadedData = game?.release_year ?
    game :
    {
      name: '',
      release_year: 2010,
      image: undefined
    }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1969 }, (_, index) => 1970 + index);


  const {
    handleSubmit,
    register,
    formState: { errors },
    // control,
    watch
  } = useForm({
    defaultValues: preloadedData
  });

  const watchImage = watch("image")

  function onSubmit(data: GameType) {
    action == 'add' ?
      addGame(data)
      : editGame(data)
  };

  async function addGame(newGame: GameType) {
    // @ts-ignore
    // newGame.image = URL.createObjectURL(newGame.image![0])
    
    await GameService.addGame(newGame);
    location.reload();
    
    
  }

  async function editGame(newGame: GameType) {
    await GameService.editGame(newGame);
    location.reload();
  }

  useEffect(() => {
    if(watchImage !== undefined){
      //@ts-ignore
      setImage(URL.createObjectURL(watchImage![0]))
    }
    
  }, [watchImage])

  


  return (

    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} width={400} justifyContent='center'>
          <Typography variant='h5' sx={{ fontWeight: 'bold' }} color='black'>
            {action === 'add' ? 'Add new game' : 'Edit game'}
          </Typography>

          {action === 'edit' ? <TextField
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

          {/* <TextField inputProps={{ accept: "image/png, image/gif, image/jpeg, image/jpg", max: 1, ...register('image', { required: 'Image is required' }) }} type="file" /> */}

          {/* @ts-ignore
          <img src={image} /> */}

          <Button type="submit" variant="contained" color="info">
            {action === 'add' ? 'Add game' : 'Edit game'}
          </Button>
          {/* <DevTool control={control} /> */}
        </Stack>
      </form>

    </>
  )
}

export default GameForm

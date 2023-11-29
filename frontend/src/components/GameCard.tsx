import { GameType } from "../schemas/GameSchema"
import { useState, useEffect } from 'react'
import GameFormModal from "./GameFormModal";
import { CardMedia, Typography, Button, CardContent, CardActions, Card } from '@mui/material'
import GameService from "../services/GameService";
import { capitalizeFirstLetter } from "../utils/CommonMethods";

function GameCard(props: { id: string, name: string, release_year: number }) {

  const game: GameType = props;

  useEffect(() => {
    console.log(game)
  
  }, [game])
  
  const [openForm, setOpenForm] = useState(false)

  function displayForm() {
    setOpenForm(true)
  }
  function closeForm() {
    setOpenForm(false)
  }

  async function deleteGame(id: string) {
    await GameService.deleteGame(id)
    location.reload()
  }

  return (
    <>
      
      <GameFormModal open={openForm} closeForm={closeForm}  action='edit' game={game}/>

      <Card sx={{ minWidth: '100%', minHeight: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {capitalizeFirstLetter(game.name)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {game.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Release year: {game.release_year}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: 'center' }}>
          <Button onClick={displayForm} variant='contained' size="small">Edit</Button>
          <Button onClick={() => deleteGame(game.id!)} variant='contained' color='error' size="small">Delete</Button>
        </CardActions>
      </Card>
    </>
  )
}

export default GameCard






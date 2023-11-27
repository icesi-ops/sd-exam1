import { useState, useEffect } from "react"
import GameCard from "../components/GameCard"
import GameForm from "../components/GameForm"
import { Button, Modal, Box, Typography, IconButton, Grid } from "@mui/material"
import GameService from "../services/GameService"
import CloseIcon from '@mui/icons-material/Close';
import { GameType } from "../schemas/GameSchema"
import GameFormModal from "../components/GameFormModal"
function Home() {

  const [games, setGames] = useState<GameType[] | []>([])



  async function getGames() {
    const fetchedGames = await GameService.getGames()
    setGames(fetchedGames);
  }

  useEffect(() => {
    getGames()
  }, [])


  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [openForm, setOpenForm] = useState(false)

  function displayForm() {
    setOpenForm(true)
  }
  function closeForm() {
    setOpenForm(false)
  }

  function renderGames() {
    return games.map((game: GameType) =>
      <Grid item xs={12} sm={4}>
        <GameCard name={game.name} release_year={game.release_year} id={game.id!} />
      </Grid>)
  }


  return (
    <>
      <Button onClick={displayForm} variant="contained">Add new game</Button>

      <GameFormModal open={openForm} closeForm={closeForm} action="add" game={undefined}></GameFormModal>

      <Grid container spacing={1} rowSpacing={1} columnSpacing={{ xs: 1 }}>
        {Array.isArray(games) && games.length > 0 ?
          renderGames()
          : <Typography variant='h5'>No games to show</Typography>
        }
      </Grid>
    </>
  )
}

export default Home
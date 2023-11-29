import { useState, useEffect } from "react"
import GameCard from "../components/GameCard"
import { Button, Box, Typography, Grid } from "@mui/material"
import GameService from "../services/GameService"
import { GameType } from "../schemas/GameSchema"
import GameFormModal from "../components/GameFormModal"
import GameStopImg from "../assets/GameStop.png"
function Home() {

  const [games, setGames] = useState<GameType[] | []>([])



  async function getGames() {
    const fetchedGames = await GameService.getGames()
    setGames(fetchedGames);
  }

  useEffect(() => {
    getGames()
  }, [])



  const [openForm, setOpenForm] = useState(false)

  function displayForm() {
    setOpenForm(true)
  }
  function closeForm() {
    setOpenForm(false)
  }

  function renderGames() {
    return games.map((game: GameType) =>
      <Grid key={game.id} item xs={12} sm={4}>
        <GameCard name={game.name} release_year={game.release_year} id={game.id!} />
      </Grid>)
  }


  return (
    <>
      <Box>
        <img style={{ width: '30%' }} src={GameStopImg} />
      </Box>
      <Button sx={{ m: 3 }} onClick={displayForm} variant="contained">Add new game</Button>

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
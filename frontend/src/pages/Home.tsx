import { useState } from "react"
import GameCard from "../components/GameCard"
import GameForm from "../components/GameForm"
import { Button } from "@mui/material"
function Home() {
  const [openForm, setOpenForm] = useState(false)

  function displayForm() {
    setOpenForm(!openForm)
  }
  return (
    <>
      <Button onClick={displayForm} variant="contained">Add new game</Button>
      {openForm ? <GameForm action='add' game={undefined}></GameForm> : null}
      <GameCard name='melo' release_year={2} id='a' />

    </>
  )
}

export default Home
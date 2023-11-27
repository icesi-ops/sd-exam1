import GameCard from "../components/GameCard"
import GameForm from "../components/GameForm"
function Home() {
  return (
    <>
      <GameCard name='melo' release_year={2} id='a' />
      <GameForm action='add' game={undefined}></GameForm>
    </>
  )
}

export default Home
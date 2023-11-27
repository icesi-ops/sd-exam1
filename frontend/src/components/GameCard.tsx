import { GameType } from "../schemas/GameSchema"
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { capitalizeFirstLetter } from "../utils/CommonMethods";

function GameCard(props: { id: string, name: string, release_year: number }) {

  const game : GameType = props;

  return (
    <Card sx={{ maxWidth: 345 }}>
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
          ID: { game.id }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Release year: { game.release_year }
        </Typography>
      </CardContent>
      <CardActions sx={{display:"flex", justifyContent:'center'}}>
        <Button variant='contained' size="small">Edit</Button>
        <Button variant='contained' color='error' size="small">Delete</Button>
      </CardActions>
    </Card>
  )
}

export default GameCard






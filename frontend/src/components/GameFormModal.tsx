import { Box, Modal, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { GameSchema } from '../schemas/GameSchema'
import GameForm from './GameForm';
import { z } from 'zod'

const GameFormModalProps = z.object({
    open: z.boolean(),
    closeForm: z.function(),
    action: z.enum(["add", "edit"]),
    game: GameSchema.optional(),
});

type GameFormModalPropsType = z.infer<typeof GameFormModalProps>;


function GameFormModal(props: GameFormModalPropsType) {

    const { open, closeForm, action, game } = props;

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


    return (
        <Modal
            open={open}
            onClose={closeForm}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton sx={{ ml: "90%" }} onClick={closeForm}>
                    <CloseIcon />
                </IconButton>
                <GameForm action={action} game={game} />
            </Box>
        </Modal>
    )
}

export default GameFormModal
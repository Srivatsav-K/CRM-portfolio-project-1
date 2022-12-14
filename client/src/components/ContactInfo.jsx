import { Stack, Typography } from '@mui/material'

const ContactInfo = ({ source, user }) => {
    return (
        <Stack maxWidth='40%'>
            <Typography color='GrayText' variant='h6' >{source.name}</Typography>
            {user && <Typography color='GrayText' variant='h6'>{user.username}</Typography>}
            <Typography color='GrayText'>{source.phone}</Typography>
            <Typography color='GrayText'>{source.address}</Typography>
            <Typography color='GrayText'>{source.gst}</Typography>
        </Stack>
    )
}

export default ContactInfo
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
//----------------------------------------------------------------------------------------------------
import TableComponent from '../components/TableComponent'
//----------------------------------------------------------------------------------------------------
import { Button, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
//----------------------------------------------------------------------------------------------------

const Orders = () => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [orders, user] = useSelector((state) => [state.orders.data, state.user.data])

    const columns = [
        { heading: 'Title', value: 'title' },
        { heading: 'Value', value: 'total' },
        { heading: 'Contact', value: 'contact.name' },
        { heading: 'Client', value: 'client.name' },
        { heading: 'Date', value: 'date', type: 'date' },
        { heading: 'Delivey', value: 'estimatedDeliveryDate', type: 'date' },
        { heading: 'Items', value: 'items', type: 'array' },
        { heading: 'Order Status', value: 'status' },
        { heading: 'Payment Status', value: 'paymentStatus' }
    ]

    const adminColumns = [...columns, { heading: 'Created By', value: 'user.username' }]

    const filteredData = useMemo(() => {
        const result = orders.filter((ele) => {
            return (
                ele.title.toLowerCase().includes(search.toLowerCase()) ||
                ele.contact.name.toLowerCase().includes(search.toLowerCase()) ||
                ele.client.name.toLowerCase().includes(search.toLowerCase()) ||
                format(parseISO(ele.date), "dd-MM-yyyy").includes(search.toLowerCase()) ||
                ele.user.username.toLowerCase().includes(search.toLowerCase()) ||
                ele.total.toString().includes(search)
            )
        }).filter((ele) => {
            if (sort === 'paymentPending') {
                return ele.paymentStatus === 'pending'
            } else if (sort === 'paymentReceived') {
                return ele.paymentStatus === 'received'
            } else if (sort === 'orderCancelled') {
                return ele.status === 'cancelled'
            } else {
                return ele
            }
        }).sort((a, b) => {
            if (sort === 'Value - low-high') {
                return a.total - b.total
            } else if (sort === 'Value - high-low') {
                return b.total - a.total
            } else if (sort === 'Items - low-high') {
                return a.items.length - b.items.length
            } else if (sort === 'Items - high-low') {
                return b.items.length - a.items.length
            } else {
                return null
            }
        })
        return result
    }, [orders, search, sort])


    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        if (name === 'search') {
            setSearch(value)
        } else if (name === 'sort') {
            setSort(value)
        }
    }

    return (
        <Grid container spacing={3} >

            <Grid item container justifyContent='space-between'>
                <Typography variant='h3' fontWeight='400' color='primary'>Orders - {orders.length}</Typography>

                <Stack justifyContent='center'>
                    <Button component={Link} to='/user/new-order' variant='contained' size='small' >+ New order</Button>
                </Stack>
            </Grid>

            <Grid item container spacing={2}>
                <Grid item xs={12} sm={9} >
                    <TextField
                        type="text"
                        name='search'
                        value={search}
                        onChange={handleChange}
                        placeholder='Search '
                        size='small'
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={3}>
                    <TextField
                        name='sort'
                        select
                        value={sort}
                        onChange={handleChange}
                        label='Sort by'
                        fullWidth
                        size='small'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SortIcon />
                                </InputAdornment>
                            )
                        }}
                    >
                        <MenuItem value='' >Default</MenuItem>
                        <MenuItem value='Value - low-high'>Value - low-high</MenuItem>
                        <MenuItem value='Value - high-low'>Value - high-low</MenuItem>
                        <MenuItem value='Items - low-high'>Items - low-high</MenuItem>
                        <MenuItem value='Items - high-low'>Items - high-low</MenuItem>
                        <MenuItem value='paymentPending'>Pending Payment</MenuItem>
                        <MenuItem value='paymentReceived'>Received Payment</MenuItem>
                        <MenuItem value='orderCancelled'>Cancelled Orders</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {(orders.length === 0) ? (
                    <Typography color='GrayText' textAlign='center' variant="h5">
                        No Orders present
                    </Typography>
                ) : (
                    <TableComponent columns={user.role === 'admin' ? adminColumns : columns} data={filteredData} />
                )}
            </Grid>


        </Grid>
    )
}

export default Orders
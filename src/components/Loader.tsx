'use client'

import { SyncLoader } from 'react-spinners'

const Loader = () => {
    return (
        <div
            className='
                h-screen
                flex
                flex-col
                justify-center
                items-center
            '
        >
            <SyncLoader
                size={15}
                color='#000'
                speedMultiplier={1}
                margin={6}
                loading
            />
        </div>
    )
}

export default Loader;